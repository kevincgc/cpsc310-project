export {isValidQuery};

function isValidKey (input: string) {
	return isValidMKey(input) || isValidSKey(input);
}

function isValidMKey (input: string) {
	const validMKeys = [/^[^_]+_avg$/, /[^_]+_pass$/, /[^_]+_fail$/, /[^_]+_audit$/, /[^_]+_year$/];
	return validMKeys.some((rx) => rx.test(input));
}

function isValidSKey (input: string) {
	const validSKeys = [/^[^_]+_dept$/, /[^_]+_id$/, /[^_]+_instructor$/, /[^_]+_title$/, /[^_]+_uuid$/];
	return validSKeys.some((rx) => rx.test(input));
}

function isValidLogicComparison (input: any): boolean {
	if (!(input["AND"] || input["OR"])) {
		return false;
	}
	let keyCount = 0;
	let isValid = true;
	for (let key in input) {
		keyCount++;
		for (let m in input[key]) {
			keyCount++;
			isValid = isValid && isValidFilter(input[key][m]);
		}
	}
	return isValid && keyCount >= 2;
}
function isValidMComparison (input: any): boolean {
	if (!(input["LT"] || input["GT"] || input["EQ"])) {
		return false;
	}
	let keyCount = 0;
	let isValid = false;
	for (let key in input) {
		keyCount++;
		for (let m in input[key]) {
			keyCount++;
			isValid = isValidMKey(m);
			isValid = isValid && !isNaN(input[key][m]);
		}
	}
	return isValid && keyCount === 2;
}

function isValidSComparison (input: any): boolean {
	if (!input["IS"]) {
		return false;
	}
	let keyCount = 0;
	let isValid = false;
	for (let key in input) {
		keyCount++;
		for (let m in input[key]) {
			keyCount++;
			isValid = isValidSKey(m);
			isValid = isValid && (typeof input[key][m] === "string" || input[key][m] instanceof String);
			if (isValid) {
				isValid = isValid && /^[*]?[^*]*[*]?$/.test(input[key][m]);
			}
		}
	}
	return isValid && keyCount === 2;
}
function isValidNegation (input: any): boolean {
	if (!input["NOT"]) {
		return false;
	}
	return isValidFilter(input["NOT"]);
}

function isValidFilter (input: any) {
	if (!(input instanceof Object)) {
		return false;
	}
	return isValidLogicComparison(input) || isValidMComparison(input) ||
		isValidSComparison(input) || isValidNegation(input);
}

function isValidWhere (input: any) {
	if (!(input instanceof Object)) {
		return false;
	}
	return Object.keys(input).length === 0 || isValidFilter(input);
}

function isValidColumns (input: any): boolean {
	if (!(input instanceof Array)) {
		return false;
	}
	let isValid = true;
	let count = 0;
	for (let c of input) {
		count++;
		isValid = isValid && isValidKey(c);
	}
	return isValid && count > 0;
}

function isValidOrder (input: any, columns: any): boolean {
	if (isValidKey(input)) {
		for (let c of columns) {
			if (c === input) {
				return true;
			}
		}
	}
	return false;
}

function isValidOptions (input: any) {
	return isValidColumns(input["COLUMNS"]) &&
		(input["ORDER"] ? isValidOrder(input["ORDER"], input["COLUMNS"]) : true);
}

function isValidQuery(query: any): boolean {
	if (!(query instanceof Object)) {
		return false;
	}
	return isValidWhere(query["WHERE"]) && isValidOptions(query["OPTIONS"]);
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
