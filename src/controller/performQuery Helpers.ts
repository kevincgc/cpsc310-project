import {isValidQuery} from "./ValidateQuery";
import {InsightDatasetKind, InsightError} from "./IInsightFacade";
import {keyDict} from "./Const";


// Adapted from https://stackoverflow.com/a/4760279
export function dynamicSort(key: any) {
	return function (a: any, b: any) {
		let result = (a[key] < b[key]) ? -1 : (a[key] > b[key]) ? 1 : 0;
		return result;
	};
}

// keys have to be exact match to item[key] in array
// Adapted from https://stackoverflow.com/a/41808830
export function sortByKeys(array: any, keys: any) {
	return array.sort(function (a: any, b: any) {
		let r = 0;
		keys.some(function (k: any) {
			if (a[k] < b[k]) {
				r = -1;
			} else if (a[k] > b[k]) {
				r = 1;
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
		console.log(key);
		console.log(sortedDataset[0][key]);
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
	let value = 0;
	switch (applyToken) {
		case "MAX":
			// this is from: https://stackoverflow.com/a/52916675
			value = singleGroup.reduce((p, c) => p[key] > c[key] ? p : c);
			break;
		case "MIN":
			value = singleGroup.reduce((p, c) => p[key] < c[key] ? p : c);
			break;
		case "SUM":
			value = singleGroup.reduce((p, c) => p + c);
			break;
		case "AVG":
			value = singleGroup.reduce((p, c) => p + c) / singleGroup.length;
			break;
		case "COUNT": {
			value = singleGroup.length;
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
		let key = applyRuleElement[applyKey][applyToken].split("_")[1];
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

export function datasetReduceSelectedColumns(filteredCourses: any[], kind: InsightDatasetKind, columns: string[]) {
	let coursesSelectedColumns: any[] = [];
	for (let course of filteredCourses) {
		let courseObject: any = {};
		for (let feature of features) {
			if(columns.find((element: any) => element === feature)) {
				let columnName = id + "_" + feature;
				if (feature === "year") {
					courseObject[columnName] = parseInt(course[keyDict[feature]], 10);
				} else if (feature === "uuid") {
					courseObject[columnName] = course[keyDict[feature]].toString();
				} else {
					courseObject[columnName] = course[keyDict[feature]];
				}
			}
		}
		coursesSelectedColumns.push(courseObject);
	}
}
