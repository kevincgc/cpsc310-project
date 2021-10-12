import {InsightDataset, InsightDatasetKind} from "./IInsightFacade";
import JSZip from "jszip";

export function isValidCourses(jsonObject: JSON) {
	if ("Title" in jsonObject &&
		"tier_eighty_five" in jsonObject) {
		return true;
	} else {
		return false;
	}
}

export function parseJsonAsync (jsonString: string): Promise<JSON> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			try {
				let json = JSON.parse(jsonString);
				resolve(json);
			} catch (e) {
				reject(new Error());
			}
		});
	});
}

export function isValidId (id: string): [boolean, string] {
	if (id.includes("_") || id.match(/^[ ]+$/)) {
		return [false, "invalid id: can't have underscore or be all spaces"];
	}
	return [true, ""];
}

export function addDatasetValidate(id: string,
	datasets: InsightDataset[], kind: InsightDatasetKind): [boolean, string] {
	const jsZip = new JSZip();
	if (kind === InsightDatasetKind.Rooms) {
		return [false, "InsightDatasetKind.Rooms not implemented"];
	}
	let [result, str] = isValidId(id);
	if (result === false) {
		return [result, str];
	}
	for (let dataset of datasets) {
		if (dataset.id === id) {
			return [false, "id already added"];
		}
	}
	return [true, ""];
}

export function getValidCourses(validResults: any[]) {
	let courses: any[] = [];
	for (let file of validResults) {
		for (let course of file.result) {
			if (course.Section === "overall") {
				course.Year = 1900;
			}
			if (isValidCourses(course)) {
				courses.push(course);
			}
		}
	}
	return courses;
}