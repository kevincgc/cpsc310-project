import {InsightDatasetKind, InsightError} from "./IInsightFacade";

// From https://stackoverflow.com/a/6283527
export function count(obj: any) {
	if (obj === null) {
		throw new InsightError("null object");
	}
	return Object.keys(obj).length;
}

export function isString(input: any): boolean {
	if (input === null) {
		throw new InsightError("null object");
	}
	return (typeof input === "string" || input instanceof String);
}

export function isArray(input: any): boolean {
	if (input === null) {
		throw new InsightError("null object");
	}
	return input instanceof Array;
}

export function isJsonObj(input: any, isCheckLen: boolean = true): boolean {
	if (input === null) {
		throw new InsightError("null object");
	}
	if (!(input instanceof Object && !isArray(input) && !isString(input) && isNaN(input))) {
		return false;
	}
	if (isCheckLen) {
		if (Object.keys(input).length === 0) {
			return false;
		}
	}
	return true;
}

export function isValidKey (input: string, id: string, kind: InsightDatasetKind) {
	return (isValidRoomKey(input, id) && kind === InsightDatasetKind.Rooms) ||
		(isValidCourseKey(input, id) && kind === InsightDatasetKind.Courses);
}

export function isValidMKey (input: string, id: string, kind: InsightDatasetKind) {
	return (isValidRoomMKey(input, id) && kind === InsightDatasetKind.Rooms) ||
		(isValidCourseMKey(input, id) && kind === InsightDatasetKind.Courses);
}

export function isValidSKey (input: string, id: string, kind: InsightDatasetKind) {
	return (isValidRoomSKey(input, id) && kind === InsightDatasetKind.Rooms) ||
		(isValidCourseSKey(input, id) && kind === InsightDatasetKind.Courses);
}

export function isValidCourseKey (input: string, id: string) {
	return isValidCourseMKey(input, id) || isValidCourseSKey(input, id);
}

export function isValidRoomKey (input: string, id: string) {
	return isValidRoomMKey(input, id) || isValidRoomSKey(input, id);
}

export function isValidCourseMKey (input: string, id: string) {
	const validMKeys = [/^[^_]+_avg$/, /^[^_]+_pass$/, /^[^_]+_fail$/, /^[^_]+_audit$/, /^[^_]+_year$/];
	return validMKeys.some((rx) => rx.test(input)) && input.split("_")[0] === id;
}

export function isValidCourseSKey (input: string, id: string) {
	const validSKeys = [/^[^_]+_dept$/, /^[^_]+_id$/, /^[^_]+_instructor$/, /^[^_]+_title$/, /^[^_]+_uuid$/];
	return validSKeys.some((rx) => rx.test(input)) && input.split("_")[0] === id;
}

export function isValidRoomMKey (input: string, id: string) {
	const validMKeys = [/^[^_]+_lat$/, /^[^_]+_lon$/, /^[^_]+_seats$/];
	return validMKeys.some((rx) => rx.test(input)) && input.split("_")[0] === id;
}

export function isValidRoomSKey (input: string, id: string) {
	const validSKeys = [/^[^_]+_fullname$/, /^[^_]+_shortname$/, /^[^_]+_number$/, /^[^_]+_name$/,
		/^[^_]+_address$/, /^[^_]+_type$/, /^[^_]+_furniture$/, /^[^_]+_href$/];
	return validSKeys.some((rx) => rx.test(input)) && input.split("_")[0] === id;
}

export function getDatasetInfo(query: any) {
	let response = { id: "", kind: InsightDatasetKind.Rooms, err: false };
	if (query["TRANSFORMATIONS"]) {
		let id = query["TRANSFORMATIONS"]["GROUP"][0].split("_")[0];
		response.id = id;
		if(isValidRoomKey(query["TRANSFORMATIONS"]["GROUP"][0], id)) {
			response.kind = InsightDatasetKind.Rooms;
		} else if (isValidCourseKey(query["TRANSFORMATIONS"]["GROUP"][0], id)) {
			response.kind = InsightDatasetKind.Courses;
		} else {
			response.err = true;
		}
	} else {
		let id = query["OPTIONS"]["COLUMNS"][0].split("_")[0];
		response.id = id;
		if(isValidRoomKey(query["OPTIONS"]["COLUMNS"][0], id)) {
			response.kind = InsightDatasetKind.Rooms;
		} else if (isValidCourseKey(query["OPTIONS"]["COLUMNS"][0], id)) {
			response.kind = InsightDatasetKind.Courses;
		} else {
			response.err = true;
		}
	}
	return response;
}

export function getArrayKeys(input: any): any[] {
	if (!isArray(input)) {
		throw new InsightError("not an array");
	}
	return input;
}
