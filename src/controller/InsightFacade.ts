import {IInsightFacade, InsightDataset, InsightDatasetKind, InsightError, NotFoundError} from "./IInsightFacade";
import JSZip from "jszip";
import {isValidQuery} from "./ValidateQuery";

const fs = require("fs-extra");
// const jsZip = require("jszip");
/**
 * This is the main programmatic entry point for the project.
 * Method documentation is in IInsightFacade
 *
 */
const keyDict: {[index: string]: string} = {
	dept: "Subject",
	id: "Course",
	avg: "Avg",
	instructor: "Professor",
	title: "Title",
	pass: "Pass",
	fail: "Fail",
	audit: "Audit",
	uuid: "id",
	year: "Year"
};
const filter: string[] = ["GT", "LT", "EQ", "NOT", "IS"];
const logic: string[] = ["AND", "OR"];

export default class InsightFacade implements IInsightFacade {
	public datasets: InsightDataset[];
	public currentCourses: JSON[];
	public currentDatasetId: string;
	constructor() {
		this.datasets = [];
		this.currentCourses = [];
		this.currentDatasetId = "";
	}
	private static isValidCourses(jsonObject: JSON) {
		if ("Title" in jsonObject &&
			"tier_eighty_five" in jsonObject) {
			return true;
		} else {
			return false;
		}
	}

	private static parseJsonAsync (jsonString: string): Promise<JSON> {
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

	private static isValidId (id: string): [boolean, string] {
		if (id.includes("_") || id.match(/^[ ]+$/)) {
			return [false, "invalid id: can't have underscore or be all spaces"];
		}
		return [true, ""];
	}

	private static addDatasetValidate(id: string,
		datasets: InsightDataset[], kind: InsightDatasetKind): [boolean, string] {
		const jsZip = new JSZip();
		if (kind === InsightDatasetKind.Rooms) {
			return [false, "InsightDatasetKind.Rooms not implemented"];
		}
		let [result, str] = InsightFacade.isValidId(id);
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

	private static getValidCourses(validResults: any[]) {
		let courses: any[] = [];
		for (let file of validResults) {
			for (let course of file.result) {
				if (course.Section === "overall") {
					course.Year = 1900;
				}
				if (InsightFacade.isValidCourses(course)) {
					courses.push(course);
				}
			}
		}
		return courses;
	}

	public addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<string[]> {
		const jsZip = new JSZip();
		return new Promise<string[]>((resolve, reject) => {
			let [isValid, errorString] = InsightFacade.addDatasetValidate(id, this.datasets, kind);
			if (!isValid) {
				reject(new InsightError(errorString));
			}
			let courses: any[] = [];
			jsZip.loadAsync(content, {base64: true}).then((zip: JSZip) => {
				const fileStrings: any[] = [];
				zip.forEach((relativePath, file) => {
					if (relativePath.startsWith("courses/")) {
						fileStrings.push(file.async("text"));
					}
				});
				Promise.all(fileStrings).then(async function (files) {
					let fileJsons: any[] = [];
					for (let file of files) {
						fileJsons.push(InsightFacade.parseJsonAsync(file));
					}
					// Start of code based on https://stackoverflow.com/a/46024590
					const results = await Promise.all(fileJsons.map((p) => p.catch((e: Error) => e)));
					return results.filter((result) => !(result instanceof Error));
					// End of code based on https://stackoverflow.com/a/46024590
				}).then((validResults) => {
					courses = InsightFacade.getValidCourses(validResults);
					fs.outputJson("data/" + id + ".json", JSON.stringify(courses));
						// .then((data: any) => {
						// 	console.log(data);
						// })
						// .catch((err: any) => {
						// 	console.error(err);
						// });
					if (courses.length > 0) {
						this.currentCourses = courses;
						this.currentDatasetId = id;
						this.datasets.push({	id: id,	kind: kind,	numRows: courses.length	});
						let ids: string[] = [];
						for (let dataset of this.datasets) {
							ids.push(dataset.id);
						}
						resolve(ids);
					} else {
						reject(new InsightError("addDataset No Valid Sections"));
					}
				});
			}).catch((e: any) => {
				reject(new InsightError("addDataset Invalid Zip File"));
			});
		});
	}

	public removeDataset(id: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			let [isValid, errorString] = InsightFacade.isValidId(id);
			if (!isValid) {
				reject(new InsightError(errorString));
			}
			const results: any[] = [];
			for (let i = 0; i < this.datasets.length; i++) {
				if (this.datasets[i].id === id) {
					this.datasets.splice(i, 1);
					fs.remove("data/" + id + ".json").catch((err: any) => {
						reject(new InsightError(err));
					});
					resolve(id);
				}
			}
			reject(new NotFoundError("removeDataset File Not Found"));
		});
	}

	public listDatasets(): Promise<InsightDataset[]> {
		return new Promise<InsightDataset[]>((resolve, reject) => {
			resolve(this.datasets);
		});
	}

	public executeFilter(object: any): any[] {
		// return new Promise<any[]>((resolve, reject) => {
		let courses: any[] = this.currentCourses;
		let data = [];
		let operator = "";
		for (let key in object) {
			operator = key;
		}
		for (let key in object[operator]) {
			let field = key.split("_")[1];
			switch (operator) {
			case "IS": {
				let wcStart: boolean = object[operator][key][0] === "*" ? true : false;
				let wcEnd: boolean = object[operator][key][object[operator][key].length - 1] === "*" ? true : false;
				if (wcStart && wcEnd && (object[operator][key].length === 1 ||
					object[operator][key].length === 2)) {
					data = courses;
					break;
				}
				let definite = object[operator][key].replace(/[*]/g, "");
				let regex = new RegExp("^" + (wcStart ? ".*" : "") + definite + (wcEnd ? ".*" : "") + "$");
				data = courses.filter((a) => regex.test(a[keyDict[field]]));
				break;
			}
			case "EQ":
				data = courses.filter((a) => a[keyDict[field]] === object[operator][key]);
				break;
			case "GT":
				data = courses.filter((a) => a[keyDict[field]] > object[operator][key]);
				break;
			case "LT":
				data = courses.filter((a) => a[keyDict[field]] < object[operator][key]);
				break;
			case "NOT": {
				let insideQueryResult = this.executeNode(object[operator]);
				data = this.currentCourses.filter((val) => !insideQueryResult.includes(val));
				break;
			}
			// default:
			//	reject(new Error("executeFilter Invalid Operator"));
			}
		}
		return data;
		// resolve(data);
		// });
	}

	public executeLogic(object: any): any[] {
		let results: any[] = [];
		let operator = "";
		for (let key in object) {
			operator = key;
		}
		for (let key in object[operator]) {
			// results.push(this.executeNode(object, this.currentCourses));
			results.push(this.executeNode(object[operator][key]));
		}
		for (let key of results) {
			console.log(key.length);
		}
		let data: any[] = results[0];
		if (operator === "AND") {
			for (let result of results) {
				data = data.filter((val) => result.includes(val));
			}
		}
		if (operator === "OR") {
			for (let result of results) {
				let combined = data.concat(result);
				combined = [...new Set([...data,...result])];
				data = combined;
			}
		}
		console.log("len ", data.length);
		return data;
	}

	public executeNode(object: any): any[] {
		let operator = "";
		for (let key in object) {
			operator = key;
		}
		if (filter.find((a) => a === operator)) {
			return this.executeFilter(object);
		} else if (logic.find((a) => a === operator)) {
			return this.executeLogic(object);
		} else {
			return [];
		}
	}

	public performQuery(query: any): Promise<any[]> {
		return new Promise<any[]>((resolve, reject) => {
			if (!isValidQuery(query)) {
				reject(new InsightError("performQuery Invalid Query Grammar"));
			}

			reject(new InsightError("performQuery Not Fully Implemented"));
		});
	}
}
