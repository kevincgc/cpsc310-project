import {InsightDatasetKind} from "./IInsightFacade";
import {getArrayKeys, isArray, isValidKey, isValidMKey, isValidCourseKey, isValidRoomKey, isValidCourseMKey,
	isValidCourseSKey, getDatasetInfo, count, isObject, isString, isValidRoomSKey, isValidSKey,
	isValidRoomMKey} from "./ValidateQuery Helpers";

export {isValidQuery};

function isValidLogicComparison (input: any, id: string, kind: any): boolean {
	if (!(input["AND"] || input["OR"])) {
		return false;
	}
	if (!(count(input) === 1)) {
		return false;
	}
	let isValid = true;
	for (let key in input) {
		if (!(count(input[key]) > 0) || !(input[key] instanceof Array)) {
			return false;
		}
		for (let m in input[key]) {
			isValid = isValid && isValidFilter(input[key][m], id, kind);
		}
	}
	return isValid;
}

function isValidMComparison (input: any, id: string, kind: any): boolean {
	if (!(input["LT"] || input["GT"] || input["EQ"])) {
		return false;
	}
	if (!(count(input) === 1) || !(input instanceof Object)) {
		return false;
	}
	let isValid = false;
	for (let key in input) {
		if (!(count(input[key]) === 1) || !(input[key] instanceof Object)) {
			return false;
		}
		for (let m in input[key]) {
			isValid = isValidMKey(m, id, kind);
			isValid = isValid && !isNaN(input[key][m]) && !isString(input[key][m]);
		}
	}
	return isValid;
}

function isValidSComparison (input: any, id: string, kind: any): boolean {
	if (!input["IS"]) {
		return false;
	}
	if (!(count(input) === 1) || !(input instanceof Object)) {
		return false;
	}
	let isValid = false;
	for (let key in input) {
		if (!(count(input[key]) === 1) || !(input[key] instanceof Object)) {
			return false;
		}
		for (let m in input[key]) {
			isValid = isValidSKey(m, id, kind);
			isValid = isValid && (typeof input[key][m] === "string" || input[key][m] instanceof String);
			if (isValid) {
				isValid = isValid && /^[*]?[^*]*[*]?$/.test(input[key][m]);
			}
		}
	}
	return isValid;
}

function isValidNegation (input: any, id: string, kind: any): boolean {
	if (!input["NOT"]) {
		return false;
	}
	if (!(count(input) === 1)) {
		return false;
	}
	if (!(input["NOT"] instanceof Object)){
		return false;
	}
	return isValidFilter(input["NOT"], id, kind);
}

function isValidFilter (input: any, id: string, kind: any) {
	if (!(input instanceof Object)) {
		return false;
	}
	// let logic = isValidLogicComparison(input, id, kind);
	// let m = isValidMComparison(input, id, kind);
	// let s = isValidSComparison(input, id, kind);
	// let neg = isValidNegation(input, id, kind);
	return isValidLogicComparison(input, id, kind) || isValidMComparison(input, id, kind) ||
		isValidSComparison(input, id, kind) || isValidNegation(input, id, kind);
}

function isValidWhere (input: any, id: any, kind: any) {
	if (!(input instanceof Object)) {
		return false;
	}
	if (count(input) > 1) {
		return false;
	}
	return Object.keys(input).length === 0 || isValidFilter(input, id, kind);
}

function isValidOrder (input: any, columnKeys: any[], id: any, kind: InsightDatasetKind): boolean {
	if (typeof input === "string" || input instanceof String) {
		if (isValidKey(input as string, id, kind) && columnKeys.includes(input)) {
			return true;
		}
	} else if (input instanceof Object) {
		let orderKeys = Object.keys(input);
		if (orderKeys.length !== 2 || (!(isArray(input[orderKeys[0]]) && isString(input[orderKeys[1]])) &&
			!(isString(input[orderKeys[0]]) && isArray(input[orderKeys[1]])))) {
			return false;
		}
		let direction = isString(input[orderKeys[0]]) ? input[orderKeys[0]] : input[orderKeys[1]];
		if (direction !== "UP" && direction !== "DOWN") {
			return false;
		}
		let sortKeys = isArray(input[orderKeys[0]]) ? input[orderKeys[0]] : input[orderKeys[1]];
		for (let key of sortKeys) {
			if (!columnKeys.includes(key)) {
				return false;
			}
		}
		return true;
	}
	return false;
}

function isValidColumns (input: any, applyKeys: string[], id: string, kind: InsightDatasetKind): boolean {
	if (!(input instanceof Array)) {
		return false;
	}
	let isValid = true;
	for (let c of input) {
		isValid = isValid && (isValidKey(c, id, kind) || applyKeys.includes(c));
	}
	return isValid;
}

function isValidOptions (input: any, applyKeys: any[], id: any, kind: any) {
	if(!input["COLUMNS"] || !(input["COLUMNS"] instanceof Array) || input["COLUMNS"].length < 1) {
		return false;
	}
	if (input["ORDER"] && !(count(input) === 2)) {
		return false;
	}
	if (!input["ORDER"] && !(count(input) === 1)) {
		return false;
	}
	if (input["ORDER"] && !(isString(input["ORDER"]) || input["ORDER"] instanceof Object)) {
		return false;
	}
	let columnKeys = getArrayKeys(input["COLUMNS"]);
	return isValidColumns(input["COLUMNS"], applyKeys, id, kind) &&
		(input["ORDER"] ? isValidOrder(input["ORDER"], columnKeys, id, kind) : true);
}

function isValidGroup(input: any, id: string, kind: InsightDatasetKind): boolean {
	if (!(input instanceof Array)) {
		return false;
	}
	let isValid = true;
	for (let c of input) {
		isValid = isValid && isValidKey(c, id, kind);
	}
	return isValid;
}

function isValidApplyRule (input: any, id: string, kind: any): boolean {
	if (!(count(input) === 1) || !(input instanceof Object) || isString(input)) {
		return false;
	}
	let applyKey = Object.keys(input);
	if (applyKey.length !== 1 || !(input[applyKey[0]] instanceof Object) || !applyKey[0].match(/^[^_]+$/)) {
		return false;
	}
	let applyToken = Object.keys(input[applyKey[0]]);
	if (applyToken.length !== 1 || !isString(input[applyKey[0]][applyToken[0]])) {
		return false;
	}
	let validNumericTokens = ["MAX", "MIN", "AVG", "SUM"];
	let validTokens = validNumericTokens.concat(["COUNT"]);
	if (!validTokens.includes(applyToken[0])) {
		return false;
	}
	return ((validNumericTokens.includes(applyToken[0]) && isValidMKey(input[applyKey[0]][applyToken[0]], id, kind)) ||
		(!validNumericTokens.includes(applyToken[0]) && isValidKey(input[applyKey[0]][applyToken[0]], id, kind)));
}

export function isValidApply(input: any, id: string, kind: InsightDatasetKind): boolean {
	// Apply is an array of objects
	if (!(input instanceof Array)) {
		return false;
	}
	for (let rule of input) {
		if(!(rule instanceof Object) || isString(rule)){
			return false;
		}
	}
	// Apply does not contain duplicate keys
	let applyKeys: string[] = [];
	for (let rule of input) {
		let applyKey = Object.keys(rule);
		if (!applyKeys.includes(applyKey[0])) {
			applyKeys.push(applyKey[0]);
		} else {
			return false;
		}
	}
	let isValid = true;
	for (let rule of input) {
		isValid = isValid && isValidApplyRule(rule, id, kind);
	}
	return isValid;
}

export function isValidTransformations(input: any, columnKeys: any[], id: string, kind: InsightDatasetKind): boolean {
	if(!input["GROUP"] || !(input["GROUP"] instanceof Array) || input["GROUP"].length < 1 ||
		!input["APPLY"] || !(input["APPLY"] instanceof Array) || count(input) !== 2){
		return false;
	}
	let groupKeys = getArrayKeys(input["GROUP"]);
	let applyKeys = [];
	for (let applyElement of input["APPLY"]) {
		let key = Object.keys(applyElement);
		if (key.length !== 1 || key[0] === "0" || key[0].includes("_")) {
			return false;
		}
		applyKeys.push(key[0]);
	}
	for (let key of columnKeys) {
		if (!groupKeys.includes(key) && !applyKeys.includes(key)) {
			return false;
		}
	}
	return isValidGroup(input["GROUP"], id, kind) && isValidApply(input["APPLY"], id, kind);
}

function isValidQuery(query: any): boolean {
	if (!(query instanceof Object)) {
		return false;
	}
	if(!query["WHERE"] || !query["OPTIONS"] || !query["OPTIONS"]["COLUMNS"]) {
		return false;
	} else if (query["OPTIONS"]["COLUMNS"].length === 0 || !isArray(query["OPTIONS"]["COLUMNS"]) ||
		!isString(query["OPTIONS"]["COLUMNS"][0])) {
		return false;
	}
	if (query["TRANSFORMATIONS"]) {
		if  (count(query) !== 3 || !query["TRANSFORMATIONS"]["APPLY"] || !query["TRANSFORMATIONS"]["GROUP"]) {
			return false;
		} else if (!isArray(query["TRANSFORMATIONS"]["GROUP"]) || query["TRANSFORMATIONS"]["GROUP"].length === 0 ||
			!isString(query["TRANSFORMATIONS"]["GROUP"][0])) {
			return false;
		}
	} else {
		if (count(query) !== 2) {
			return false;
		}
	}
	let datasetInfo = getDatasetInfo(query);
	if (datasetInfo.err || datasetInfo.id.includes("_") || datasetInfo.id.match(/^[ ]*$/)) {
		return false;
	}
	let kind: any = datasetInfo.kind;
	let id: any = datasetInfo.id;
	let applyKeys = [];
	if (query["TRANSFORMATIONS"]) {
		if (isValidApply(query["TRANSFORMATIONS"]["APPLY"], id, kind)) {
			for (let rule of query["TRANSFORMATIONS"]["APPLY"]) {
				let applyKey = Object.keys(rule);
				applyKeys.push(applyKey[0]);
			}
		} else {
			return false;
		}
	}
	let columnKeys = getArrayKeys(query["OPTIONS"]["COLUMNS"]);
	return isValidWhere(query["WHERE"], id, kind) && isValidOptions(query["OPTIONS"], applyKeys, id, kind) &&
		(query["TRANSFORMATIONS"] ? isValidTransformations(query["TRANSFORMATIONS"], columnKeys, id, kind) : true);
}
