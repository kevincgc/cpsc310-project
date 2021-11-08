import {InsightDataset, InsightDatasetKind, InsightError} from "./IInsightFacade";
import {isValidCourses} from "./Const";
import JSZip from "jszip";
import fs from "fs-extra";
import http from "http";

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
	if (!id.match(/^[^_]+$/) || id.match(/^[ ]+$/)) {
		return false;
	}
	return true;
}

export function addDatasetValidate(id: string,
	datasets: InsightDataset[], kind: InsightDatasetKind) { // : [boolean, string] {
	return new Promise<void>((resolve, reject) => {
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
export function  getCourseFilesAsStrings(content: any): Promise<string[]> {
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

export function getAddedDatasets(datasets: any[]) {
	let ids: string[] = [];
	for (let dataset of datasets) {
		ids.push(dataset.id);
	}
	return ids;
}

export async function getLatLong(address: string = "2211 Wesbrook Mall") {
	const url = "http://cs310.students.cs.ubc.ca:11316/api/v1/project_team179/";
	// From https://stackoverflow.com/a/50244236
	const httpGet = (getUrl: any) => {
		return new Promise((resolve, reject) => {
			http.get(getUrl, (res: any) => {
				res.setEncoding("utf8");
				let returnedData = "";
				res.on("data", (chunk: any) => returnedData += chunk);
				res.on("end", () => resolve(returnedData));
			}).on("error", reject);
		});
	};

	const locationString = await httpGet(url + address.replace(/\s/g, "%20")) as string;
	let location = await JSON.parse(locationString);
	if (!location.error) {
		return location;
	} else {
		throw new InsightError("getLatLong: " + location.error);
	}
}
