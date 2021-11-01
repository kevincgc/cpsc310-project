import {isValidQuery} from "./ValidateQuery";
import {InsightDatasetKind, InsightError} from "./IInsightFacade";
import {coursesFeatures, features, filter, keyDict, logic, ParsedApplyElement, roomsFeatures} from "./Const";
import Decimal from "decimal.js";
import {isString} from "./ValidateQuery Helpers";
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
export function isDatasetInDatasets(datasets: any, id: string, kind: InsightDatasetKind) {
	if (datasets.length === 0) {
		return false;
	}
	let found = false;
	for (let dataset of datasets) {
		if (id === dataset.id && kind === dataset.kind) {
			found = true;
		}
	}
	return found;
}
export function sortDataset(query: any, dataset: any) {
	if (isString(query["OPTIONS"]["ORDER"])) {
		let orderedDataset = dataset;
		orderedDataset.sort(dynamicSort(query["OPTIONS"]["ORDER"]));
		return orderedDataset;
	} else {
		return sortByKeys(dataset, query["OPTIONS"]["ORDER"]["keys"],
			query["OPTIONS"]["ORDER"]["dir"]);
	}
}
export function executeFilter(object: any, currentDataset: any[]): any[] {
	let courses: any[] = currentDataset;
	let data = [];
	let operator = "";
	for (let key in object) {
		operator = key;
	}
	for (let key in object[operator]) {
		let field = key.split("_")[1];
		switch (operator) {
			case "IS": {
				let wcStart: boolean = object[operator][key][0] === "*" ? true : false;
				let wcEnd: boolean = object[operator][key][object[operator][key].length - 1] === "*" ? true : false;
				if (wcStart && wcEnd && (object[operator][key].length === 1 ||
					object[operator][key].length === 2)) {
					data = courses;
					break;
				}
				let definite = object[operator][key].replace(/[*]/g, "");
				let regex = new RegExp("^" + (wcStart ? ".*" : "") + definite + (wcEnd ? ".*" : "") + "$");
				data = courses.filter((a) => regex.test(a[keyDict[field]]));
				break;
			}
			case "EQ":
				data = courses.filter((a) => a[keyDict[field]] === object[operator][key]);
				break;
			case "GT":
				data = courses.filter((a) => a[keyDict[field]] > object[operator][key]);
				break;
			case "LT":
				data = courses.filter((a) => a[keyDict[field]] < object[operator][key]);
				break;
			case "NOT": {
				let insideQueryResult = executeNode(object[operator], currentDataset);
				data = currentDataset.filter((val) => !insideQueryResult.includes(val));
				break;
			}
		}
	}
	return data;
}
export function executeLogic(object: any, currentDataset: any[]): any[] {
	let results: any[] = [];
	let operator = "";
	for (let key in object) {
		operator = key;
	}
	for (let key in object[operator]) {
		results.push(executeNode(object[operator][key], currentDataset));
	}
	let data: any[] = results[0];
	if (operator === "AND") {
		for (let result of results) {
			data = data.filter((val) => result.includes(val));
		}
	}
	if (operator === "OR") {
		for (let result of results) {
			let combined = data.concat(result);
			combined = [...new Set([...data,...result])]; // from https://stackoverflow.com/a/38940354
			data = combined;
		}
	}
	return data;
}
export function executeNode(object: any, currentDataset: any[]) {
	let operator = "null";
	for (let key in object) {
		operator = key;
	}
	if (filter.find((a) => a === operator)) {
		return executeFilter(object, currentDataset);
	} else if (logic.find((a) => a === operator)) {
		return executeLogic(object, currentDataset);
	} else {
		return currentDataset;
	}
}
