import {IInsightFacade, InsightDataset, InsightDatasetKind, InsightError, NotFoundError} from "./IInsightFacade";
import JSZip from "jszip";

const fs = require("fs-extra");
// const jsZip = require("jszip");
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
					for (let file of validResults) {
						for (let course of file.result) {
							if (InsightFacade.isValidCourses(course)) {
								courses.push(course);
							}
						}
					}
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

	private static isValidQueryKey(id: string, key: string): boolean {
		const validKeys: string[] =
			["dept", "id", "avg", "instructor", "title", "pass", "fail", "audit", "uuid", "year"];
		let regexs: any[] = [];
		for (let k of validKeys) {
			regexs.push(new RegExp("#" + id + "_" + k + "#", "i"));
		}
		for (let regex of regexs) {
			if (key.match(regex)) {
				return true;
			}
		}
		return false;
	}

	public static isValidLogicComparison (input: any): boolean {
		if (!(input["AND"] || input["OR"])) {
			return false;
		}
		let isValid = true;
		for (let key in input) {
			isValid = isValid && this.isValidFilter(input[key]);
		}
		return isValid;
	}
	public static isValidMComparison (input: any): boolean {
		if (!(input["LT"] || input["GT"] || input["EQ"])) {
			return false;
		}
		const validMKeys = [/^[^_]+_avg$/, /[^_]+_pass$/, /[^_]+_fail$/, /[^_]+_audit$/, /[^_]+_year$/];
		let keyCount = 0;
		let isValid = false;
		for (let key in input) {
			keyCount++;
			for (let m in input[key]) {
				keyCount++;
				isValid = validMKeys.some((rx) => rx.test(m));
				isValid = isValid && !isNaN(input[key][m]);
			}
		}
		return isValid && keyCount === 2;
	}

	public static isValidSComparison (input: any): boolean {
		if (!input["IS"]) {
			return false;
		}
		const validSKeys = [/^[^_]+_dept$/, /[^_]+_id$/, /[^_]+_instructor$/, /[^_]+_title$/, /[^_]+_uuid$/];
		let keyCount = 0;
		let isValid = false;
		for (let key in input) {
			keyCount++;
			for (let m in input[key]) {
				keyCount++;
				isValid = validSKeys.some((rx) => rx.test(m));
				isValid = isValid && (typeof input[key][m] === "string" || input[key][m] instanceof String);
			}
		}
		return isValid && keyCount === 2;
	}
	public static isValidNegation (input: any): boolean {
		if (!input["NOT"]) {
			return false;
		}
		return InsightFacade.isValidFilter(input["NOT"]);
	}

	public static isValidFilter (input: any) {
		return InsightFacade.isValidLogicComparison(input) || InsightFacade.isValidMComparison(input) ||
			InsightFacade.isValidSComparison(input) || InsightFacade.isValidNegation(input);
	}

	public static isValidWhere (input: any) {
		return Object.keys(input).length === 0 || InsightFacade.isValidFilter(input);
	}

	public static isValidOptions (input: any) {
		let isValid = true;
		return isValid;
	}

	public static isValidQuery(query: any): boolean {
		return this.isValidWhere(query["WHERE"]) && this.isValidOptions(query["OPTIONS"]);
	}

	public performQuery(query: any): Promise<any[]> {
		return new Promise<any[]>((resolve, reject) => {
			let where: any = query["WHERE"];
			let options: any = query["OPTIONS"];
		});
	}
}
