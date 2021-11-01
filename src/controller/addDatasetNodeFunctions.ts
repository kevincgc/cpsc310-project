import {InsightError} from "./IInsightFacade";
import {NOTHING_CLASS, ADDRESS_CLASS, IMAGE_CLASS, LONG_NAME_CLASS, SHORT_NAME_CLASS, ROOM_CAPACITY_CLASS,
	ROOM_FURNITURE_CLASS, ROOM_NUMBER_CLASS, ROOM_TYPE_CLASS} from "./addDatasetRoomsHelpers";

export function getChildNodes(node: any) {
	if (node.childNodes) {
		return node.childNodes;
	}
	return [];
}

export function filterNodes(nodeArray: any[], nodeName: string, className: string = "") {
	let nodes = [];
	for (let node of nodeArray) {
		if (node.nodeName === nodeName && (className === "" ? true : getNodeClass(node) === className)) {
			nodes.push(node);
		}
	}
	return nodes;
}

export function getNode(rootNode: any, nodeName: string, className: string = "", isThrowError: boolean = true): any {
	let nodes: any[] = getChildNodes(rootNode);
	while (nodes.length > 0) {
		let currentNode = nodes.pop();
		if (currentNode.nodeName === nodeName && (className === "" ? true : getNodeClass(currentNode) === className)) {
			return currentNode;
		}
		nodes = nodes.concat(getChildNodes(currentNode));
	}
	if (isThrowError) {
		throw new InsightError("node: ", nodeName, " not found in file: ", rootNode.nodeName);
	} else {
		return null;
	}
}

export function getNodeClass(node: any) {
	return getNodeAttributeValue(node, "class");
}
export function getNodeID(node: any) {
	return getNodeAttributeValue(node, "id");
}
export function getNodeText(node: any) {
	return getNodeAttributeValue(node, "#text");
}
export function getNodeHref(node: any) {
	return getNodeAttributeValue(node, "href");
}

export function getNodeAttributeValue(node: any, attribute: string) {
	for (let attr of node.attrs) {
		if (attr.name === attribute) {
			return attr.value;
		}
	}
	return -1;
}

// rootNode = parsedIndex
export function getIndexTbodyNode(rootNode: any): any {
	let nodes: any[] = getChildNodes(rootNode);
	while (nodes.length > 0) {
		let currentNode = nodes.pop();
		if (currentNode.nodeName === "tbody") {
			let trNode = getNode(currentNode, "tr", "", false);
			if (trNode === null) {
				continue;
			} else {
				if (isValidIndexTrNode(trNode)) {
					return currentNode;
				} else {
					continue;
				}
			}
		}
		nodes = nodes.concat(getChildNodes(currentNode));
	}
	throw new InsightError("addDataset Valid 'tbody' Node Not Found In rooms/index.html");
}

function isValidIndexTrNode(trNode: any) {
	let childNodes = getChildNodes(trNode);
	let num = 0;
	for (let node of childNodes) {
		if (node.nodeName === "td") {
			switch(getNodeClass(node)) {
				case NOTHING_CLASS:
					num += 1;
					break;
				case LONG_NAME_CLASS:
					num += 10;
					break;
				case SHORT_NAME_CLASS:
					num += 100;
					break;
				case ADDRESS_CLASS:
					num += 1000;
					break;
				case IMAGE_CLASS:
					num += 10000;
					break;
				default:
					num = -1;
			}
		}
	}
	return num === 11111;
}

// rootNode = parsedIndex
export function getBuildingTbodyNode(rootNode: any): any {
	let nodes: any[] = getChildNodes(rootNode);
	while (nodes.length > 0) {
		let currentNode = nodes.pop();
		if (currentNode.nodeName === "tbody") {
			let trNode = getNode(currentNode, "tr", "", false);
			if (trNode === null) {
				continue;
			} else {
				if (isValidBuildingTrNode(trNode)) {
					return currentNode;
				} else {
					continue;
				}
			}
		}
		nodes = nodes.concat(getChildNodes(currentNode));
	}
	return null;
}

function isValidBuildingTrNode(trNode: any) {
	let childNodes = getChildNodes(trNode);
	let num = 0;
	for (let node of childNodes) {
		if (node.nodeName === "td") {
			switch(getNodeClass(node)) {
				case NOTHING_CLASS:
					num += 1;
					break;
				case ROOM_FURNITURE_CLASS:
					num += 10;
					break;
				case ROOM_TYPE_CLASS:
					num += 100;
					break;
				case ROOM_NUMBER_CLASS:
					num += 1000;
					break;
				case ROOM_CAPACITY_CLASS:
					num += 10000;
					break;
				default:
					num = -1;
			}
		}
	}
	return num === 11111;
}
