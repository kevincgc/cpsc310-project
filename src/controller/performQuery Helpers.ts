import {isValidQuery} from "./ValidateQuery";
import {InsightDatasetKind, InsightError} from "./IInsightFacade";
import {coursesFeatures, features, filter, keyDict, roomsFeatures} from "./Const";
import Decimal from "decimal.js";


// Adapted from https://stackoverflow.com/a/4760279
export function dynamicSort(key: any) {
	return function (a: any, b: any) {
		let result = (a[key] < b[key]) ? -1 : (a[key] > b[key]) ? 1 : 0;
		return result;
	};
}

// keys have to be exact match to item[key] in array
// Adapted from https://stackoverflow.com/a/41808830
export function sortByKeys(array: any, keys: any, dir: any = "DOWN") {
	return array.sort(function (a: any, b: any) {
		let r = 0;
		keys.some(function (k: any) {
			if (a[k] < b[k]) {
				r = dir === "UP" ? -1 : 1;
			} else if (a[k] > b[k]) {
				r = dir === "UP" ? 1 : -1;
			}
			return r;
		});
		return r;
	});
}

function getKeys(array: any[]) {
	let columns = [];
	for (let feature of array) {
		columns.push(feature.split("_")[1]);
	}
	return columns;
}

export function getFeatures (query: any) {
	return getKeys(query["OPTIONS"]["COLUMNS"]);
}

export function getGroupKeys (query: any) {
	return getKeys(query["TRANSFORMATIONS"]["GROUP"]);
}

export function validateQuery(query: any) {
	if (!isValidQuery(query)) {
		throw new InsightError("performQuery Invalid Query Grammar");
	}
}

// keys have to be exact match to item[key] in array
export function group(groupKeys: string[], sortedDataset: any[]) {
	let groups: any[][] = [];
	let currentGroup = [];
	let attributes = [];
	for (let key of groupKeys) {
		attributes.push(sortedDataset[0][key]);
	}
	for (let item of sortedDataset) {
		let isSameGroup = true;
		for (let i in groupKeys) {
			isSameGroup = isSameGroup && (item[groupKeys[i]] === attributes[i]);
		}
		if(isSameGroup) {
			currentGroup.push(item);
		} else {
			groups.push(currentGroup);
			currentGroup = [];
			currentGroup.push(item);
			attributes = [];
			for (let key of groupKeys) {
				attributes.push(item[key]);
			}
		}
	}
	if(currentGroup.length > 0) {
		groups.push(currentGroup);
	}
	return groups;
}

function applyRule(singleGroup: any[], rules: any) {
	let applyToken = rules.applyToken;
	let key = rules.key;
	let value = 1;
	switch (applyToken) {
		case "MAX":
			// this is from: https://stackoverflow.com/a/52916675
			value = singleGroup.reduce((p, c) => p[key] > c[key] ? p : c)[key];
			break;
		case "MIN":
			value = singleGroup.reduce((p, c) => p[key] < c[key] ? p : c)[key];
			break;
		case "SUM": {
			let sum: Decimal = new Decimal(0);
			for (let element of singleGroup) {
				let num = new Decimal(element[key]);
				sum = sum.add(num);
			}
			value = Number(sum.toFixed(2));
			break;
		}
		case "AVG": {
			let sum: Decimal = new Decimal(0);
			for (let element of singleGroup) {
				let num = new Decimal(element[key]);
				sum = sum.add(num);
			}
			let avg = sum.toNumber() / singleGroup.length;
			value = Number(avg.toFixed(2));
			break;
		}
		case "COUNT": {
			let set = new Set();
			for (let element of singleGroup) {
				set.add(element[key]);
			}
			value = set.size;
			break;
		}
	}
	return value;
}

function applyRulesOnGroup(singleGroup: any[], rules: ParsedApplyElement[], groupKeys: any[]) {
	let appliedItem: any = {};
	for (let rule of rules) {
		appliedItem[rule.applyKey] = applyRule(singleGroup, rule);
	}
	for (let groupKey of groupKeys) {
		appliedItem[groupKey] = singleGroup[0][groupKey];
	}
	return appliedItem;
}

export function apply(applyArray: any, groupedDataset: any[], groupKeys: any[]) {
	let appliedItemArray: any[] = [];
	let rules: ParsedApplyElement[] = [];
	for (let applyRuleElement of applyArray) {
		let applyKey = Object.keys(applyRuleElement)[0];
		let applyToken = Object.keys(applyRuleElement[applyKey])[0];
		let key = applyRuleElement[applyKey][applyToken];
		let rule: ParsedApplyElement = { applyKey: applyKey, applyToken: applyToken, key: key};
		rules.push(rule);
	}
	for (let singleGroup of groupedDataset) {
		appliedItemArray.push(applyRulesOnGroup(singleGroup, rules, groupKeys));
	}
	return appliedItemArray;
}

interface ParsedApplyElement{
	applyKey: string, applyToken: string, key: string;
}

export function datasetReduceToSelectedColumns(filteredDataset: any[], id: string, kind: InsightDatasetKind,
	columns: string[]) {
	let datasetSelectedColumns: any[] = [];
	for (let dataPoint of filteredDataset) {
		let datasetObject: any = {};
		for (let feature of features) {
			if(columns.find((element: any) => element === feature)) {
				let columnName = id + "_" + feature;
				if (feature === "year") {
					datasetObject[columnName] = parseInt(dataPoint[keyDict[feature]], 10);
				} else if (feature === "uuid") {
					datasetObject[columnName] = dataPoint[keyDict[feature]].toString();
				} else {
					datasetObject[columnName] = dataPoint[keyDict[feature]];
				}
			}
		}
		datasetSelectedColumns.push(datasetObject);
	}
	return datasetSelectedColumns;
}

export function datasetReduceToSelectedColumnsSimple(filteredDataset: any[], columns: string[]) {
	let datasetSelectedColumns: any[] = [];
	for (let dataPoint of filteredDataset) {
		let datasetObject: any = {};
		for (let column of columns) {
			datasetObject[column] = dataPoint[column];
		}
		datasetSelectedColumns.push(datasetObject);
	}
	return datasetSelectedColumns;
}

export function datasetReduceToValidColumns(filteredDataset: any[], id: string, kind: InsightDatasetKind) {
	if (kind === InsightDatasetKind.Courses) {
		return datasetReduceToSelectedColumns(filteredDataset, id, kind, coursesFeatures);
	} else {
		return datasetReduceToSelectedColumns(filteredDataset, id, kind, roomsFeatures);
	}
}
