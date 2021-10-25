import {InsightDataset, InsightDatasetKind, InsightError} from "./IInsightFacade";
import JSZip from "jszip";
import {keyDict} from "./Const";

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

export function parseJsonAsync(jsonString: string): Promise<JSON> {
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

export function isValidId (id: string): boolean {
	if (id.includes("_") || id.match(/^[ ]+$/)) {
		return false;
	}
	return true;
}

export function addDatasetValidate(id: string,
	datasets: InsightDataset[], kind: InsightDatasetKind) { // : [boolean, string] {
	return new Promise<void>((resolve, reject) => {
		if (kind === InsightDatasetKind.Rooms) {
			reject(new InsightError("addDataset InsightDatasetKind.Rooms not implemented"));
		}
		if (!isValidId(id)) {
			reject(new InsightError("addDataset ID Can't Contain Underscore Or Be All Spaces"));
		}
		for (let dataset of datasets) {
			if (dataset.id === id) {
				reject(new InsightError( "addDataset ID Already Added"));
			}
		}
		resolve();
	});
}

export function getValidCourses(validResults: any[]) {
	return new Promise<string[]>((resolve, reject) => {
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
		resolve(courses);
	});
}

export function getFilesAsStringsRooms(content: any): Promise<string[]> {
	return new Promise<string[]>((resolve, reject) => {
		const jsZip = new JSZip();
		jsZip.loadAsync(content, {base64: true}).then((zip: JSZip) => {
			const fileStrings: any[] = [];
			zip.forEach((relativePath, file) => {
				if (relativePath.startsWith("rooms/index")) {
					fileStrings.push(file.async("text"));
				}
			});
			resolve(fileStrings);
		}).catch((e) => {
			reject(new InsightError("addDataset Not A Valid Zip File"));
		});
	});
}

export async function getValidJsons(files: string[]) {
	let fileJsons: any[] = [];
	for (let file of files) {
		fileJsons.push(parseJsonAsync(file));
	}
	// Start of code based on https://stackoverflow.com/a/46024590
	const results = await Promise.all(fileJsons.map((p) => p.catch((e: Error) => e)));
	return results.filter((result) => !(result instanceof Error));
	// End of code based on https://stackoverflow.com/a/46024590
}

export function getFilesAsStrings(content: any): Promise<string[]> {
	return new Promise<string[]>((resolve, reject) => {
		const jsZip = new JSZip();
		jsZip.loadAsync(content, {base64: true}).then((zip: JSZip) => {
			const fileStrings: any[] = [];
			zip.forEach((relativePath, file) => {
				if (relativePath.startsWith("courses/")) {
					fileStrings.push(file.async("text"));
				}
			});
			resolve(fileStrings);
		}).catch((e) => {
			reject(new InsightError("addDataset Not A Valid Zip File"));
		});
	});
}


