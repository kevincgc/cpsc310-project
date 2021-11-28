import { IInsightFacade, InsightDataset, InsightDatasetKind, InsightError, NotFoundError, ResultTooLargeError}
	from "./IInsightFacade";
import {
	addDatasetValidate, getAddedDatasets, getCourseFilesAsStrings, getValidCourses, getValidJsons, isValidId,
	getLatLong} from "./addDatasetCoursesHelpers";
import {
	getRoomsFilesAsObjects,
	getDataFromPromise,
	parseIndex,
	parseClassrooms,
	findThenParseIndexFile, getValidClassrooms
	,getRoomFileObjects} from "./addDatasetRoomsHelpers";
import { apply, datasetReduceToSelectedColumns,	datasetReduceToSelectedColumnsSimple, datasetReduceToValidColumns,
	executeNode, getFeatures, group, isDatasetInDatasets, sortByKeys, sortDataset, validateQuery}
	from "./performQuery Helpers";
import {getDatasetInfo} from "./ValidateQuery Helpers";
import path from "path";
import {ChildNode, ParentNode} from "parse5";
import {isValidCourses, isValidCoursesCache, isValidRoomsCache} from "./Const";

const fs = require("fs-extra");
const p5 = require("parse5");
/**
 * This is the main programmatic entry point for the project.
 * Method documentation is in IInsightFacade
 *
 */
export default class InsightFacade implements IInsightFacade {
	public datasets: InsightDataset[];
	public currentDataset: any[];
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
			if (kind === InsightDatasetKind.Courses) {
				addDatasetValidate(id, this.datasets, kind).then(() => {
					return getCourseFilesAsStrings(content);
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
			} else if (kind === InsightDatasetKind.Rooms) {
				addDatasetValidate(id, this.datasets, kind).then(() => {
					return getRoomsFilesAsObjects(content);
				}).then((fileObjects) => {
					return getRoomFileObjects(fileObjects);
				}).then(async (fileObjects) => {
					let buildingInfoArray: any[] = await findThenParseIndexFile(fileObjects);
					return getValidClassrooms(fileObjects, buildingInfoArray);
				}).then((validClassrooms) => {
					return this.saveDataset(validClassrooms, id, kind);
				}).then(() => {
					resolve(getAddedDatasets(this.datasets));
				}).catch((e) => {
					reject(e);
				});
			} else {
				reject(new InsightError("addDataset Invalid InsightDatasetKind"));
			}
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
					this.currentDataset = this.currentDatasetId === id ? [] : this.currentDataset;
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

	public loadDataset(id: string, kind: InsightDatasetKind) {
		if (id !== this.currentDatasetId) {
			// if (!isDatasetInDatasets(this.datasets, id, kind)) {
			// 	throw new InsightError("performQuery Dataset Does Not Exist");
			// }
			try {
				this.currentDataset = JSON.parse(fs.readJsonSync("data/" + id + ".json"));
				if (this.currentDataset.length === 0) {
					throw new InsightError("performQuery Invalid Cached Data");
				} else if (kind === InsightDatasetKind.Courses && !isValidCourses(this.currentDataset[0])) {
					throw new InsightError("performQuery Dataset and query kind mismatch");
				} else if (kind === InsightDatasetKind.Rooms && !isValidRoomsCache(this.currentDataset[0])) {
					throw new InsightError("performQuery Dataset and query kind mismatch");
				}
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
				let filteredDataset = executeNode(query["WHERE"], this.currentDataset);
				let dataset = [];
				if (query["TRANSFORMATIONS"]) {
					let datasetSelectedColumns: any[] = datasetReduceToValidColumns(filteredDataset, datasetInfo.id,
						datasetInfo.kind);
					let groupKeys = query["TRANSFORMATIONS"]["GROUP"]; // keys have underscore and id
					let sortedByGroupsDataset = sortByKeys(datasetSelectedColumns, groupKeys);
					let groupedDataset = group(groupKeys, sortedByGroupsDataset);
					let appliedDataset = apply(query["TRANSFORMATIONS"]["APPLY"], groupedDataset, groupKeys);
					dataset = datasetReduceToSelectedColumnsSimple(appliedDataset, query["OPTIONS"]["COLUMNS"]);
				} else {
					let columns = getFeatures(query);
					dataset = datasetReduceToSelectedColumns(filteredDataset, datasetInfo.id, datasetInfo.kind,
						columns);
				}
				if (dataset.length > 5000) {
					reject(new ResultTooLargeError("performQuery > 5000 results"));
				}
				if (!query["OPTIONS"]["ORDER"]) {
					resolve(dataset);
				} else {
					resolve(sortDataset(query, dataset));
				}
			} catch (e) {
				if (e instanceof InsightError) {
					reject(e);
				} else {
					reject(new InsightError("¯\\_(ツ)_/¯"));
				}
			}
		});
	}
}
