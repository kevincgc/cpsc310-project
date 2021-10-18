export {isValidQuery};

// From https://stackoverflow.com/a/6283527
function count(obj: any) {
	return Object.keys(obj).length;
}

function isValidKey (input: string, id: string) {
	return isValidMKey(input, id) || isValidSKey(input, id);
}

function isValidMKey (input: string, id: string) {
	const validMKeys = [/^[^_]+_avg$/, /[^_]+_pass$/, /[^_]+_fail$/, /[^_]+_audit$/, /[^_]+_year$/];
	return validMKeys.some((rx) => rx.test(input)) && input.split("_")[0] === id;
}

function isValidSKey (input: string, id: string) {
	const validSKeys = [/^[^_]+_dept$/, /[^_]+_id$/, /[^_]+_instructor$/, /[^_]+_title$/, /[^_]+_uuid$/];
	return validSKeys.some((rx) => rx.test(input)) && input.split("_")[0] === id;
}

function isValidLogicComparison (input: any, id: string): boolean {
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
			isValid = isValid && isValidFilter(input[key][m], id);
		}
	}
	return isValid;
}
function isValidMComparison (input: any, id: string): boolean {
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
			// console.log(input[key][m]);
			isValid = isValidMKey(m, id);
			isValid = isValid && !isNaN(input[key][m]) &&
				!(typeof input[key][m] === "string" || input[key][m] instanceof String);
		}
	}
	return isValid;
}

function isValidSComparison (input: any, id: string): boolean {
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
			isValid = isValidSKey(m, id);
			isValid = isValid && (typeof input[key][m] === "string" || input[key][m] instanceof String);
			if (isValid) {
				isValid = isValid && /^[*]?[^*]*[*]?$/.test(input[key][m]);
			}
		}
	}
	return isValid;
}
function isValidNegation (input: any, id: string): boolean {
	if (!input["NOT"]) {
		return false;
	}
	if (!(count(input) === 1)) {
		return false;
	}
	if (!(input["NOT"] instanceof Object)){
		return false;
	}
	return isValidFilter(input["NOT"], id);
}

function isValidFilter (input: any, id: string) {
	if (!(input instanceof Object)) {
		return false;
	}
	return isValidLogicComparison(input, id) || isValidMComparison(input, id) ||
		isValidSComparison(input, id) || isValidNegation(input, id);
}

function isValidWhere (input: any, id: any) {
	if (!(input instanceof Object)) {
		return false;
	}
	if (count(input) > 1) {
		return false;
	}
	return Object.keys(input).length === 0 || isValidFilter(input, id);
}

function isValidColumns (input: any, id: string): boolean {
	if (!(input instanceof Array)) {
		return false;
	}
	let isValid = true;
	for (let c of input) {
		isValid = isValid && isValidKey(c, id);
	}
	return isValid;
}

function isValidOrder (input: any, columns: any, id: any): boolean {
	if (isValidKey(input, id)) {
		// Find Order key in Columns
		for (let c of columns) {
			if (c === input) {
				return true;
			}
		}
	}
	return false;
}

function isValidOptions (input: any, id: any) {
	if(!input["COLUMNS"] || !(input["COLUMNS"] instanceof Array) || input["COLUMNS"].length < 1) {
		return false;
	}
	if (input["ORDER"] && !(count(input) === 2)) {
		return false;
	}
	if (!input["ORDER"] && !(count(input) === 1)) {
		return false;
	}
	if (input["ORDER"] && !(typeof input["ORDER"] === "string" || input["ORDER"] instanceof String)) {
		return false;
	}
	return isValidColumns(input["COLUMNS"], id) &&
		(input["ORDER"] ? isValidOrder(input["ORDER"], input["COLUMNS"], id) : true);
}

function isValidQuery(query: any): boolean {
	if (!(query instanceof Object)) {
		return false;
	}
	if(!query["WHERE"] || !query["OPTIONS"] || !query["OPTIONS"]["COLUMNS"] ||
		query["OPTIONS"]["COLUMNS"].length === 0 || !(count(query) === 2)) {
		return false;
	}
	let id = query["OPTIONS"]["COLUMNS"][0].split("_")[0];
	return isValidWhere(query["WHERE"], id) && isValidOptions(query["OPTIONS"], id);
}

// function isValidQueryKey(id: string, key: string): boolean {
// 	const validKeys: string[] =
// 		["dept", "id", "avg", "instructor", "title", "pass", "fail", "audit", "uuid", "year"];
// 	let regexs: any[] = [];
// 	for (let k of validKeys) {
// 		regexs.push(new RegExp("#" + id + "_" + k + "#", "i"));
// 	}
// 	for (let regex of regexs) {
// 		if (key.match(regex)) {
// 			return true;
// 		}
// 	}
// 	return false;
// }
