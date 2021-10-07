import {
	IInsightFacade,
	InsightDataset,
	InsightDatasetKind,
	InsightError,
	NotFoundError
} from "../../src/controller/IInsightFacade";
import InsightFacade from "../../src/controller/InsightFacade";
import {clearDisk, getContentFromArchives, persistDir} from "../resources/TestUtil";
import {expect} from "chai";
import * as fs from "fs-extra";

describe("tests", function() {
	describe("Tutorial add 0/1/multi DS", function () {
		fs.removeSync("data");
	});
});

