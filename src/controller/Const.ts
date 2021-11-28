export const keyDict: {[index: string]: string} = {
	dept: "Subject",
	id: "Course",
	avg: "Avg",
	instructor: "Professor",
	title: "Title",
	pass: "Pass",
	fail: "Fail",
	audit: "Audit",
	uuid: "id",
	year: "Year",
	fullname: "fullname",
	shortname: "shortname",
	number: "number",
	name: "name",
	address: "address",
	lat: "lat",
	lon: "lon",
	seats: "seats",
	type: "type",
	furniture: "furniture",
	href: "href"
};
export const roomsFeatures: string[] = ["fullname", "shortname", "number", "name", "address", "lat", "lon", "seats",
	"type", "furniture", "href"];
export const coursesFeatures: string[] = ["dept", "id", "avg", "instructor", "title", "pass", "fail", "audit", "uuid",
	"year"];
export const features: string[] = roomsFeatures.concat(coursesFeatures);
export const filter: string[] = ["GT", "LT", "EQ", "NOT", "IS"];
export const logic: string[] = ["AND", "OR"];
export const apply: string[] = ["MAX", "MIN", "SUM", "AVG", "COUNT"];

export interface ParsedApplyElement{
	applyKey: string, applyToken: string, key: string;
}

export interface RoomContainer {
	fullname: string;
	shortname: string;
	number: string;
	name: string;
	address: string;
	lat: number;
	long: number;
	seats: number;
	type: string;
	furniture: string;
	href: string;
}

export function isValidCourses(jsonObject: JSON) {
	if ("Title" in jsonObject &&
		"tier_eighty_five" in jsonObject &&
		"tier_seventy_six" in jsonObject &&
		"tier_zero" in jsonObject &&
		"Campus" in jsonObject &&
		"Stddev" in jsonObject &&
		"Detail" in jsonObject &&
		"tier_seventy_two" in jsonObject &&
		"tier_sixty_four" in jsonObject &&
		"tier_ninety" in jsonObject &&
		"Session" in jsonObject &&
		"Year" in jsonObject &&
		"Pass" in jsonObject &&
		"Fail" in jsonObject &&
		"Subject" in jsonObject &&
		"Course" in jsonObject &&
		"Avg" in jsonObject &&
		"Professor" in jsonObject &&
		"Audit" in jsonObject &&
		"id" in jsonObject &&
		"Enrolled" in jsonObject) {
		return true;
	} else {
		return false;
	}
}

export function isValidCoursesCache(jsonObject: JSON) {
	console.log(jsonObject);
	if ("dept" in jsonObject &&
		"id" in jsonObject &&
		"avg" in jsonObject &&
		"instructor" in jsonObject &&
		"title" in jsonObject &&
		"pass" in jsonObject &&
		"fail" in jsonObject &&
		"audit" in jsonObject &&
		"uuid" in jsonObject &&
		"year" in jsonObject) {
		return true;
	} else {
		return false;
	}
}

export function isValidRoomsCache(jsonObject: JSON) {
	if ("fullname" in jsonObject &&
		"shortname" in jsonObject &&
		"number" in jsonObject &&
		"name" in jsonObject &&
		"address" in jsonObject &&
		"lat" in jsonObject &&
		"lon" in jsonObject &&
		"seats" in jsonObject &&
		"type" in jsonObject &&
		"furniture" in jsonObject &&
		"href" in jsonObject) {
		return true;
	} else {
		return false;
	}
}
