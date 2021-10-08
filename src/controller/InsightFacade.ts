import {IInsightFacade, InsightDataset, InsightDatasetKind, InsightError, NotFoundError} from "./IInsightFacade";
import JSZip, {JSZipObject} from "jszip";
import {InsightDatasetClass} from "./InsightDatasetClass";
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
					reject("not a json");
				}
			});
		});
	}

	public addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<string[]> {

		return new Promise<string[]>((resolve, reject) => {
			let jsZip = new JSZip();
			jsZip.loadAsync(content, {base64: true}).then((zip: JSZip) => {
				const fileStrings: any[] = [];
				zip.forEach((relativePath, file) => {
					fileStrings.push(file.async("text"));
				});

				Promise.all(fileStrings).then(async function (files) {
					let fileJsons: any[] = [];

					for (let file of files) {
						fileJsons.push(InsightFacade.parseJsonAsync(file));
					}
					// Start of code based on https://stackoverflow.com/a/46024590
					const results = await Promise.all(fileJsons.map((p) => p.catch((e: Error) => e)));
					const validResults = results.filter((result) => !(result instanceof Error));
					// End of code based on https://stackoverflow.com/a/46024590
					console.log(validResults[1500]);
					console.log(validResults.length);
					// const fileJsons: any[] = [];
					// for (let file of files) {
					// 	fileJsons.push(this.parseJsonAsync(file));
					// }
					// Promise.all(fileJsons).then((jsons) => {
					// 	console.log(jsons[1500].toString());
					// 	console.log(jsons.length);
					// });

					// for (let file of files) {
					// 	let fileJson = JSON.parse(file);
					// 	for (let j of fileJson.result) {
					// 		if (this.isValidCourses(j)) {
					// 			this.datasetsJson.push(j);
					// 		}
					// 	}
					// }
				});
			});
		});
		// return new Promise<string[]>((resolve, reject) => {
		// 	JSzip.loadAsync(content, {base64: true}).then((zip: JSZip) => {
		// 		zip.forEach((relativePath: string, file: JSZipObject) => {
		// 			file.async("string").then((contentString: string) => {
		// 				datasetStrings.push(contentString);
		// 			});
		// 			Promise.all(files.map(file=>{
		// 				return fse.readFile(file, 'utf-8');
		// 			})).then(results => {
		// 				// results is an array of strings of the contents of each file
		// 			})
		// 		});
		// 		Promise.all(datasetStrings).then((result: any) => {
		// 			console.log(datasetStrings[0]);
		// 			console.log(datasetStrings.length);
		// 			resolve(datasetStrings);
		// 		});
				// let fileJson = JSON.parse(str);
				// for (let j of fileJson.result) {
				// 	if (this.isValidCourses(j)) {
				// 		console.log(j.Title);
				// 		this.datasetsJson.push(j);
				// 	}
				// }

			// .then(() => {
			// 		for (let i in this.datasetsJson) {
			// 			fs.outputJson("data/" + id + "/" + String(i) + ".json", this.datasetsJson[i])
			// 				.then(() => fs.readJson(file))
			// 				.then((data: any) => {
			// 					console.log(data.name);
			// 				})
			// 				.catch((err: any) => {
			// 					console.error(err);
			// 				});
			// 		}
			// 		if (this.datasetsJson.length > 0) {
			// 			this.datasets.push(new InsightDatasetClass(id, kind, this.datasetsJson));
			// 			let ids: string[] = [];
			// 			for (let dataset of this.datasets) {
			// 				ids.push(dataset.id);
			// 			}
			// 			resolve(ids);
			// 		} else {
			// 			reject(new InsightError("no valid sections"));
			// 		}
			// 	});
			// });
		// });
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
