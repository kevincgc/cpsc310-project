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
