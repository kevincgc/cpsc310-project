import {InsightDataset, InsightDatasetKind, InsightError} from "./IInsightFacade";
import JSZip from "jszip";

export function getFeatures (query: any) {
	let columns = [];
	for (let feature of query["OPTIONS"]["COLUMNS"]) {
		columns.push(feature.split("_")[1]);
	}
	return columns;
}
// Adapted from https://stackoverflow.com/a/4760279
export function dynamicSort(key: any) {
	return function (a: any, b: any) {
		let result = (a[key] < b[key]) ? -1 : (a[key] > b[key]) ? 1 : 0;
		return result;
	};
}
