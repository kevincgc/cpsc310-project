import InsightFacade from "../../src/controller/InsightFacade";
import {
	IInsightFacade,
	InsightDataset,
	InsightDatasetKind,
	InsightError,
	NotFoundError,
	ResultTooLargeError
} from "../../src/controller/IInsightFacade";
import {expect, use} from "chai";
import chaiAsPromised from "chai-as-promised";
import {clearDisk, getContentFromArchives} from "../resources/TestUtil";
import {testFolder} from "@ubccpsc310/folder-test";

type Input = any;
type Output = Promise<any[]>;
type Error = any;


use(chaiAsPromised);

describe("AddDataSet Tests", function() {
	this.timeout(10000);
	let rooms: string;
	let coursesTest: string;
	let facade: IInsightFacade = new InsightFacade();

	beforeEach(function () {
		rooms = getContentFromArchives("rooms.zip");
		facade = new InsightFacade();
		clearDisk();
	});

	it("should list one dataset", async function() {
		const result = await facade.addDataset("rooms", rooms, InsightDatasetKind.Rooms);
		expect(result).to.be.an.instanceof(Array);
		expect(result.length).to.equal(76);
	});

	it("should reject duplicate dataset", async function() {
		const result1 = await facade.addDataset("rooms", rooms, InsightDatasetKind.Rooms);
		const result2 = await facade.addDataset("rooms", rooms, InsightDatasetKind.Rooms);
		expect(result1).to.be.an.instanceof(Array);
		expect(result1.length).to.equal(76);

		expect(facade).to.deep.equal([{
			id: "rooms",
			kind: InsightDatasetKind.Rooms,
			numRows: 76,
		}]);
	});

	it("should add two datasest", async function() {
		const result1 = await facade.addDataset("rooms1", rooms, InsightDatasetKind.Rooms);
		const result2 = await facade.addDataset("rooms2", rooms, InsightDatasetKind.Rooms);
		expect(facade).to.deep.equal([{
			id: "rooms1",
			kind: InsightDatasetKind.Rooms,
			numRows: 76,
		},
		{
			id: "rooms2",
			kind: InsightDatasetKind.Rooms,
			numRows: 76,
		}
		]);
	});
});

describe("Validation tests", function() {
	this.timeout(10000);
	let rooms: string;
	let coursesTest: string;
	let facade: IInsightFacade = new InsightFacade();

	beforeEach(function () {
		rooms = getContentFromArchives("rooms.zip");
		facade = new InsightFacade();
		clearDisk();
	});
	it("should reject dataset no rooms/ directory", async function () {
		try {
			let data = getContentFromArchives("norooms.zip");
			await facade.addDataset("rooms", data, InsightDatasetKind.Rooms);
			expect.fail("Should have rejected!");
		} catch (err) {
			console.log(err);
			expect(err).to.be.instanceof(InsightError);
		}
	});

	it("should reject dataset not in html format", async function () {
		try {
			let data = getContentFromArchives("rooms.zip");
			await facade.addDataset("rooms", data, InsightDatasetKind.Rooms);
			expect.fail("Should have rejected!");
		} catch (err) {
			console.log(err);
			expect(err).to.be.instanceof(InsightError);
		}
	});
});
