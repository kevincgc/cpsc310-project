import {IInsightFacade, InsightDataset, InsightDatasetKind, InsightError, NotFoundError} from "./IInsightFacade";
import JSZip, {JSZipObject} from "jszip";
import {InsightDatasetClass} from "./InsightDatasetClass";
let JSzip = require("jszip");
const fs = require("fs-extra");
/**
 * This is the main programmatic entry point for the project.
 * Method documentation is in IInsightFacade
 *
 */
export default class InsightFacade implements IInsightFacade {
	private datasets: InsightDatasetClass[];
	private datasetsJson: JSON[];
	constructor() {
		this.datasets = [];
		this.datasetsJson = [];
	}
	private isValidCourses(jsonObject: JSON) {
		if ("Title" in jsonObject &&
			"tier_eighty_five" in jsonObject) {
			return true;
		} else {
			return false;
		}
	}
	public addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<string[]> {
		this.datasetsJson = [];
		return new Promise<string[]>((resolve, reject) => {
			JSzip.loadAsync(content, {base64: true}).then((zip: JSZip) => {
				zip.forEach((relativePath: string, file: JSZipObject) => {
					file.async("string").then((str: string) => {
						let fileJson = JSON.parse(str);
						for (let j of fileJson.result) {
							if (this.isValidCourses(j)) {
								console.log(j.Title);
								this.datasetsJson.push(j);
							}
						}
					}).then(() => {
						for (let i in this.datasetsJson) {
							fs.outputJson("data/" + id + "/" + String(i) + ".json", this.datasetsJson[i])
								.then(() => fs.readJson(file))
								.then((data: any) => {
									console.log(data.name);
								})
								.catch((err: any) => {
									console.error(err);
								});
						}
						if (this.datasetsJson.length > 0) {
							this.datasets.push(new InsightDatasetClass(id, kind, this.datasetsJson));
							let ids: string[] = [];
							for (let dataset of this.datasets) {
								ids.push(dataset.id);
							}
							resolve(ids);
						} else {
							reject(new InsightError("no valid sections"));
						}
					});
				});
			});
		});
	}

	public removeDataset(id: string): Promise<string> {
		return Promise.reject("Not implemented.");
	}

	public performQuery(query: any): Promise<any[]> {
		return Promise.reject("Not implemented.");
	}

	public listDatasets(): Promise<InsightDataset[]> {
		return new Promise<InsightDataset[]>((resolve, reject) => {
			let datasets: InsightDataset[] = [];
			for (let dataset of this.datasets) {
				datasets.push({id: dataset.id, kind: dataset.kind, numRows: dataset.numRows});
			}
			resolve(datasets);
		});
	}
}
