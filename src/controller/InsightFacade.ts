import {IInsightFacade, InsightDataset,	InsightDatasetKind,	InsightError, NotFoundError,
	ResultTooLargeError} from "./IInsightFacade";
import JSZip from "jszip";
import {isValidQuery} from "./ValidateQuery";
import {keyDict, filter, logic, features} from "./Const";
const fs = require("fs-extra");
import {addDatasetValidate, isValidId, isValidCourses, getValidCourses, parseJsonAsync} from "./addDataset Helpers";

/**
 * This is the main programmatic entry point for the project.
 * Method documentation is in IInsightFacade
 *
 */
export default class InsightFacade implements IInsightFacade {
	public datasets: InsightDataset[];
	public currentCourses: JSON[];
	public currentDatasetId: string;
	constructor() {
		this.datasets = [];
		this.currentCourses = [];
		this.currentDatasetId = "";
	}

	public addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<string[]> {
		const jsZip = new JSZip();
		return new Promise<string[]>((resolve, reject) => {
			let [isValid, errorString] = addDatasetValidate(id, this.datasets, kind);
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
						fileJsons.push(parseJsonAsync(file));
					}
					// Start of code based on https://stackoverflow.com/a/46024590
					const results = await Promise.all(fileJsons.map((p) => p.catch((e: Error) => e)));
					return results.filter((result) => !(result instanceof Error));
					// End of code based on https://stackoverflow.com/a/46024590
				}).then((validResults) => {
					courses = getValidCourses(validResults);
					if (courses.length > 0) {
						fs.outputJson("data/" + id + ".json", JSON.stringify(courses)).then(() => {
							this.currentCourses = courses;
							this.currentDatasetId = id;
							this.datasets.push({	id: id,	kind: kind,	numRows: courses.length	});
							let ids: string[] = [];
							for (let dataset of this.datasets) {
								ids.push(dataset.id);
							}
							resolve(ids);
						}).catch((e: any) => {
							reject(new InsightError("addDataset Couldn't Output Json With ID: " + id));
						});
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
			let [isValid, errorString] = isValidId(id);
			if (!isValid) {
				reject(new InsightError(errorString));
			}
			let datasetExists = false;
			for (let i = 0; i < this.datasets.length; i++) {
				if (this.datasets[i].id === id) {
					datasetExists = true;
					this.currentDatasetId = this.currentDatasetId === id ? "" : this.currentDatasetId;
					this.datasets.splice(i, 1);
				}
			}
			if (!datasetExists) {
				reject(new NotFoundError("removeDataset Dataset Not Found"));
			}
			if (fs.existsSync("./data/" + id + ".json")) {
				fs.remove("./data/" + id + ".json").then(() => {
					if (!fs.existsSync("./data/" + id + ".json")) {
						resolve(id);
					} else {
						reject(new InsightError("removeDataset Unable To Remove File"));
					}
				});
			} else {
				reject(new InsightError("removeDataset DS Not Found On Disk"));
			}
		});
	}

	public listDatasets(): Promise<InsightDataset[]> {
		return new Promise<InsightDataset[]>((resolve, reject) => {
			resolve(this.datasets);
		});
	}

	public executeFilter(object: any): any[] {
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
			}
		}
		return data;
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
		let operator = "null";
		for (let key in object) {
			operator = key;
		}
		if (filter.find((a) => a === operator)) {
			return this.executeFilter(object);
		} else if (logic.find((a) => a === operator)) {
			return this.executeLogic(object);
		} else if (operator === "null") {
			return this.currentCourses;
		} else {
			return [];
		}
	}

	// Adapted from https://stackoverflow.com/a/4760279
	private dynamicSort(key: any) {
		return function (a: any, b: any) {
			let result = (a[key] < b[key]) ? -1 : (a[key] > b[key]) ? 1 : 0;
			return result;
		};
	}

	public getFeatures (query: any) {
		let columns = [];
		for (let feature of query["OPTIONS"]["COLUMNS"]) {
			columns.push(feature.split("_")[1]);
		}
		return columns;
	}

	public isDatasetInDatasets(id: any) {
		if (this.datasets.length === 0) {
			return false;
		}
		let found = false;
		for (let dataset of this.datasets) {
			if (id === dataset.id) {
				found = true;
			}
		}
		return found;
	}

	public performQuery(query: any): Promise<any[]> {
		return new Promise<any[]>((resolve, reject) => {
			if (!isValidQuery(query)) {
				reject(new InsightError("performQuery Invalid Query Grammar"));
			}
			let id = query["OPTIONS"]["COLUMNS"][0].split("_")[0];
			if (id !== this.currentDatasetId) {
				if (!this.isDatasetInDatasets(id)) {
					reject(new InsightError("performQuery Dataset Does Not Exist"));
				}
				try {
					this.currentCourses = JSON.parse(fs.readJsonSync("data/" + id + ".json"));
					this.currentDatasetId = id;
				} catch (err: any) {
					reject(new InsightError("performQuery Dataset Does Not Exist"));
				}
			}
			let filteredCourses = this.executeNode(query["WHERE"]);
			if (filteredCourses.length > 5000) {
				reject(new ResultTooLargeError("performQuery > 5000 results"));
			}
			let columns = this.getFeatures(query);
			let coursesSelectedColumns: any[] = [];
			for (let course of filteredCourses) {
				let courseObject: any = {};
				for (let feature of features) {
					if(columns.find((element) => element === feature)) {
						let columnName = id + "_" + feature;
						if (feature === "year") {
							courseObject[columnName] = parseInt(course[keyDict[feature]], 10);
						} else if (feature === "uuid") {
							courseObject[columnName] = course[keyDict[feature]].toString();
						} else {
							courseObject[columnName] = course[keyDict[feature]];
						}
					}
				}
				coursesSelectedColumns.push(courseObject);
			}
			if (query.OPTIONS.ORDER) {
				coursesSelectedColumns.sort(this.dynamicSort(query["OPTIONS"]["ORDER"]));
			}
			resolve(coursesSelectedColumns);
		});
	}
}
