import JSZip from "jszip";
import {InsightError} from "./IInsightFacade";
import {
	filterNodes, getChildNodes, getNode, getNodeClass, getNodeHref,	getBuildingTbodyNode, getIndexTbodyNode
} from "./addDatasetNodeFunctions";
import {getLatLong} from "./addDatasetCoursesHelpers";
import path from "path";
const p5 = require("parse5");

export const NOTHING_CLASS = "views-field views-field-nothing";
export const SHORT_NAME_CLASS = "views-field views-field-field-building-code";
export const ADDRESS_CLASS = "views-field views-field-field-building-address";
export const LONG_NAME_CLASS = "views-field views-field-title";
export const IMAGE_CLASS = "views-field views-field-field-building-image";
export const ROOM_NUMBER_CLASS = "views-field views-field-field-room-number";
export const ROOM_CAPACITY_CLASS = "views-field views-field-field-room-capacity";
export const ROOM_FURNITURE_CLASS = "views-field views-field-field-room-furniture";
export const ROOM_TYPE_CLASS = "views-field views-field-field-room-type";

export function getRoomFileObjects(fileObjects: any) {
	let filesData = [];
	for (let file of fileObjects) {
		filesData.push(file.data);
	}
	return Promise.all(filesData).then(() => {
		return fileObjects;
	});
}

export function getRoomsFilesAsObjects(content: any): Promise<any[]> {
	return new Promise<string[]>((resolve, reject) => {
		const jsZip = new JSZip();
		jsZip.loadAsync(content, {base64: true}).then((zip: JSZip) => {
			let fileObjects: any[] = [];
			zip.forEach((relativePath, file) => {
				if (relativePath.slice(-1) !== "/") {
					fileObjects.push({path: relativePath, data: file.async("text")});
				}
			});
			resolve(fileObjects);
		}).catch((e) => {
			reject(new InsightError("addDataset Not A Valid Zip File"));
		});
	});
}

export async function getDataFromPromise(input: any) {
	return input.data;
}


export function parseIndex(indexHTML: any): any[] {
	let buildingInfoArray: any[] = [];
	let indexParsed = p5.parse(indexHTML);
	let tbodyNode: any = getIndexTbodyNode(indexParsed);
	let trNodes = filterNodes(getChildNodes(tbodyNode), "tr");
	for (let node of trNodes) {
		let buildingInfo: any = {};
		let link = getBuildingLink(node).toString();
		buildingInfo["path"] = link.replace("./", "rooms/");
		// get long name
		let longNameNode = getNode(node, "td", LONG_NAME_CLASS);
		let aNode = getNode(longNameNode, "a", "", false);
		buildingInfo["fullname"] = getNode(aNode, "#text", "", false).value.trim();
		// get address
		let addressNode = getNode(node, "td", ADDRESS_CLASS);
		buildingInfo["address"] = getNode(addressNode, "#text", "", false).value.trim();
		buildingInfoArray.push(buildingInfo);

	}
	return buildingInfoArray;
}

export function getBuildingLink(trNode: any): string {
	let tdNodes = filterNodes(getChildNodes(trNode), "td");
	for (let node of tdNodes) {
		switch (getNodeClass(node)) {
			case NOTHING_CLASS: {
				let aNode = getNode(node, "a");
				return getNodeHref(aNode);
			}
		}
	}
	return "";
}

export function parseClassrooms(buildingFile: any): any {
	let buildingParsed = p5.parse(buildingFile);
	let tbodyNode: any = getBuildingTbodyNode(buildingParsed);
	if (!tbodyNode) {
		return [];
	}
	let trNodes = filterNodes(getChildNodes(tbodyNode), "tr");
	let roomsArray: any[] = [];
	for (let trNode of trNodes) {
		let tdNodes = filterNodes(getChildNodes(trNode), "td");
		roomsArray.push(parseClassroom(tdNodes));
	}
	return roomsArray;
}

function parseClassroom(tdNodes: any) {
	let room: any = {};
	for (let node of tdNodes) {
		switch (getNodeClass(node)) {
			case ROOM_NUMBER_CLASS: {
				let aNode = getNode(node, "a", "", false);
				if (!aNode) {
					continue;
				}
				let textNode = getNode(aNode, "#text", "", false);
				if (!textNode) {
					continue;
				}
				room.number = textNode.value.trim();
				break;
			}
			case ROOM_CAPACITY_CLASS: {
				let aNode = getNode(node, "#text", "", false);
				if (!aNode) {
					continue;
				}
				room.seats = Number(aNode.value.trim());
				break;
			}
			case ROOM_FURNITURE_CLASS: {
				let aNode = getNode(node, "#text", "", false);
				if (!aNode) {
					continue;
				}
				room.furniture = aNode.value.trim();
				break;
			}
			case ROOM_TYPE_CLASS: {
				let aNode = getNode(node, "#text", "", false);
				if (!aNode) {
					continue;
				}
				room.type = aNode.value.trim();
				break;
			}
		}
	}
	return room;
}

export async function findThenParseIndexFile(fileObjects: any) {
	let buildingInfoArray = [];
	for (let file of fileObjects) {
		if (file.path === "rooms/index.htm") {
			let indexFile = await getDataFromPromise(file);
			buildingInfoArray = parseIndex(indexFile);
			break;
		}
	}
	return buildingInfoArray;
}

export async function getValidClassrooms(fileObjects: any[], buildingInfoArray: any[]) {
	let validClassrooms: any[] = [];
	for (let file of fileObjects) {
		for (let info of buildingInfoArray){
			if (info.path === file.path){
				let buildingFile = await getDataFromPromise(file);
				let classrooms = parseClassrooms(buildingFile);
				if (classrooms.length === 0) {
					continue;
				}
				let latLong = await getLatLong(info.address.trim());
				if (latLong.err) {
					continue;
				}
				for (let classroom of classrooms) {
					classroom.shortname = path.basename(file.path);
					classroom.href = "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/"
						+ classroom.shortname + "-" + classroom.number;
					classroom.name = classroom.shortname + "_" + classroom.number;
					classroom.lat = latLong.lat;
					classroom.lon = latLong.lon;
					classroom.fullname = info.fullname;
					classroom.address = info.address;
				}
				validClassrooms = validClassrooms.concat(classrooms);
			}
		}
	}
	return validClassrooms;
}
