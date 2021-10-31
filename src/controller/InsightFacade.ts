import {
	IInsightFacade,
	InsightDataset,
	InsightDatasetKind,
	InsightError,
	NotFoundError,
	ResultTooLargeError
} from "./IInsightFacade";
import {filter, keyDict, logic} from "./Const";
import {
	addDatasetValidate,
	getAddedDatasets,
	getFilesAsStrings,
	getValidCourses,
	getValidJsons,
	isValidId
} from "./addDataset Helpers";
import {apply, dynamicSort, getFeatures, getGroupKeys, group, sortByKeys, validateQuery} from "./performQuery Helpers";
import {getDatasetInfo} from "./ValidateQuery Helpers";

const fs = require("fs-extra");
/**
 * This is the main programmatic entry point for the project.
 * Method documentation is in IInsightFacade
 *
 */
export default class InsightFacade implements IInsightFacade {
	public datasets: InsightDataset[];
	public currentDataset: JSON[];
	public currentDatasetId: string;
	public currentDatasetKind: InsightDatasetKind;
	constructor() {
		this.datasets = [];
		this.currentDataset = [];
		this.currentDatasetId = "";
		this.currentDatasetKind = InsightDatasetKind.Courses;
	}

	public saveDataset(courses: any, id: string, kind: InsightDatasetKind) {
		return new Promise<void>((resolve, reject) => {
			if (courses.length > 0) {
				fs.outputJson("data/" + id + ".json", JSON.stringify(courses)).then(() => {
					this.currentDataset = courses;
					this.currentDatasetId = id;
					this.currentDatasetKind = kind;
					this.datasets.push({ id: id, kind: kind, numRows: courses.length });
					resolve();
				}).catch((e: any) => {
					reject(new InsightError("addDataset Can't Write To File"));
				});
			} else {
				reject(new InsightError("addDataset No Valid Sections"));
			}
		});
	}

	public addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<string[]> {
		return new Promise<string[]>((resolve, reject) => {
			addDatasetValidate(id, this.datasets, kind).then(() => {
				return getFilesAsStrings(content);
			}).then((fileStrings) => {
				return Promise.all(fileStrings);
			}).then((files) => {
				return getValidJsons(files);
			}).then((validJsons) => {
				return getValidCourses(validJsons);
			}).then((courses) => {
				return this.saveDataset(courses, id, kind);
			}).then(() => {
				resolve(getAddedDatasets(this.datasets));
			}).catch((e) => {
				reject(e);
			});
		});
	}

	public removeDataset(id: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			if (!isValidId(id)) {
				reject(new InsightError("removeDataset ID Invalid"));
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
			fs.remove("./data/" + id + ".json").then(() => {
				if (!fs.existsSync("./data/" + id + ".json")) {
					resolve(id);
				} else {
					reject(new InsightError("removeDataset Unable To Remove File"));
				}
			});
		});
	}

	public listDatasets(): Promise<InsightDataset[]> {
		return new Promise<InsightDataset[]>((resolve, reject) => {
			resolve(this.datasets);
		});
	}

	public executeFilter(object: any): any[] {
		let courses: any[] = this.currentDataset;
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
					data = this.currentDataset.filter((val) => !insideQueryResult.includes(val));
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
				combined = [...new Set([...data,...result])]; // from https://stackoverflow.com/a/38940354
				data = combined;
			}
		}
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
		} else {
			return this.currentDataset;
		}
	}

	public isDatasetInDatasets(id: string, kind: InsightDatasetKind) {
		if (this.datasets.length === 0) {
			return false;
		}
		let found = false;
		for (let dataset of this.datasets) {
			if (id === dataset.id && kind === dataset.kind) {
				found = true;
			}
		}
		return found;
	}

	public loadDataset(id: string, kind: InsightDatasetKind) {
		if (id !== this.currentDatasetId) {
			if (!this.isDatasetInDatasets(id, kind)) {
				throw new InsightError("performQuery Dataset Does Not Exist");
			}
			try {
				this.currentDataset = JSON.parse(fs.readJsonSync("data/" + id + ".json"));
				this.currentDatasetId = id;
				this.currentDatasetKind = kind;
			} catch (err: any) {
				throw new InsightError("performQuery Dataset Does Not Exist");
			}
		} else if (kind !== this.currentDatasetKind) {
			throw new InsightError("performQuery Dataset ID does not match kind");
		}
	}

	public performQuery(query: any): Promise<any[]> {
		return new Promise<any[]>((resolve, reject) => {
			try {
				validateQuery(query);
				let datasetInfo = getDatasetInfo(query);
				this.loadDataset(datasetInfo.id, datasetInfo.kind);
				let filteredDataset = this.executeNode(query["WHERE"]);
				if (query["TRANSFORMATIONS"]) {
					let groupKeys = getGroupKeys(query); // keys have underscore and id removed
					let sortedByGroupsDataset = sortByKeys(filteredDataset, groupKeys);
					let groupedDataset = group(groupKeys, sortedByGroupsDataset);
					let applyDataset = apply(query["TRANSFORMATIONS"]["APPLY"], groupedDataset, groupKeys);
				}
				let columns = getFeatures(query);
				let coursesSelectedColumns: any[] = [];
				for (let course of filteredCourses) {
					let courseObject: any = {};
					for (let feature of features) {
						if(columns.find((element: any) => element === feature)) {
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
				if (filteredDataset.length > 5000) {
					reject(new ResultTooLargeError("performQuery > 5000 results"));
				}
				if (query["OPTIONS"]["ORDER"]) {
					coursesSelectedColumns.sort(dynamicSort(query["OPTIONS"]["ORDER"]));
				}
				resolve(coursesSelectedColumns);
			} catch (e) {
				reject(e);
			}
		});
	}
}
