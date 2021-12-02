import {
	IInsightFacade,
	InsightDataset,
	InsightDatasetKind,
	InsightError,
	NotFoundError
} from "../../src/controller/IInsightFacade";
import InsightFacade from "../../src/controller/InsightFacade";
import {clearDisk, getContentFromArchives} from "../resources/TestUtil";
import {expect} from "chai";
import * as fs from "fs-extra";
import {isValidQuery} from "../../src/controller/ValidateQuery";

describe("tests", function() {
	let courses: string;
	let courses16: string;
	let courses10: string;
	let courses8: string;
	let coursesNotAllJson: string;
	let coursesJsonOutsideFolder: string;
	before(function () {
		courses = getContentFromArchives("courses.zip");
		courses16 = getContentFromArchives("courses_16.zip");
		courses10 = getContentFromArchives("courses_10.zip");
		courses8 = getContentFromArchives("courses_8.zip");
		coursesNotAllJson = getContentFromArchives("not_all_json.zip");
		coursesJsonOutsideFolder = getContentFromArchives("courses_only_64612_should_be_considered.zip");
	});
	describe("Tutorial add 0/1/multi DS", function () {
		let facade: IInsightFacade = new InsightFacade();
		beforeEach(function () {
			fs.removeSync("./data");
			facade = new InsightFacade();
		});
		it("should list no datasets", function () {
			return facade.listDatasets()
				.then((insightDatasets) => {
					// expect(insightDatasets).to.deep.equal([]);
					expect(insightDatasets).to.be.an.instanceOf(Array);
					expect(insightDatasets).to.have.length(0);
				});
		});
		it("should list one datasets", function () {
			this.timeout(100000);
			return facade.addDataset("courses", courses, InsightDatasetKind.Courses)
				.then(() => {
					return facade.listDatasets();
				})
				.then((insightDatasets) => {
					expect(insightDatasets).to.deep.equal([{
						id: "courses",
						kind: InsightDatasetKind.Courses,
						numRows: 64612,
					}]);
					// expect(insightDatasets).to.be.an.instanceOf(Array);
					// expect(insightDatasets).to.have.length(1);
					// const [insightDataset] = insightDatasets;
					// expect(insightDataset).to.have.property("id");
					// expect(insightDataset.id).to.equal("courses");
				});
		});

		it("should list multiple datasets", function () {
			this.timeout(10000);
			return facade.addDataset("courses", courses, InsightDatasetKind.Courses)
				.then(() => {
					return facade.addDataset("courses-has8courses", courses8, InsightDatasetKind.Courses);
				})
				.then(() => {
					return facade.listDatasets();
				})
				.then((insightDatasets) => {
					expect(insightDatasets).to.be.an.instanceOf(Array);
					expect(insightDatasets).to.have.length(2);
					const expectedDatasets: InsightDataset[] = [
						{
							id: "courses",
							kind: InsightDatasetKind.Courses,
							numRows: 64612,
						},
						{
							id: "courses-has8courses",
							kind: InsightDatasetKind.Courses,
							numRows: 106,
						}
					];
					expect(insightDatasets).to.have.deep.members(expectedDatasets);
					const insightDatasetCourses = insightDatasets.find((dataset) => dataset.id === "courses");
					expect(insightDatasetCourses).to.exist;
					expect(insightDatasetCourses).to.deep.equal({
						id: "courses",
						kind: InsightDatasetKind.Courses,
						numRows: 64612,
					});

				});
		});
	});
	describe("Add dataset exceptions", function () {
		let facade: IInsightFacade = new InsightFacade();
		beforeEach(function () {
			fs.removeSync("./data");
			facade = new InsightFacade();
		});
		it("should DS reject, not a zip", async function () {
			try {
				let data = getContentFromArchives("not_a_zip.txt");
				await facade.addDataset("courses", data, InsightDatasetKind.Courses);
				expect.fail("Should have rejected!");
			} catch (err) {
				expect(err).to.be.instanceof(InsightError);
			}
		});
		it("should DS reject, no course sections", async function () {
			try {
				let data = getContentFromArchives("no_course_sections.zip");
				await facade.addDataset("courses", data, InsightDatasetKind.Courses);
				expect.fail("Should have rejected!");
			} catch (err) {
				expect(err).to.be.instanceof(InsightError);
			}
		});
		it("should DS reject, no courses folder", async function () {
			try {
				let data = getContentFromArchives("no_courses_folder.zip");
				await facade.addDataset("courses", data, InsightDatasetKind.Courses);
				let f = facade as InsightFacade;
				expect.fail("Should have rejected!");
			} catch (err) {
				console.log(err);
				expect(err).to.be.instanceof(InsightError);
			}
		});
		it("should DS pass skip non-json files", async function () {
			await facade.addDataset("courses", coursesNotAllJson, InsightDatasetKind.Courses);
			const insightDatasets = await facade.listDatasets();
			expect(insightDatasets).to.have.length(1);
			expect(insightDatasets).to.deep.equal([{
				id: "courses",
				kind: InsightDatasetKind.Courses,
				numRows: 64612,
			}]);
		});
		it("should DS pass only consider files in courses folder", async function () {
			await facade.addDataset("courses", coursesJsonOutsideFolder, InsightDatasetKind.Courses);
			const insightDatasets = await facade.listDatasets();
			expect(insightDatasets).to.have.length(1);
			expect(insightDatasets).to.deep.equal([{
				id: "courses",
				kind: InsightDatasetKind.Courses,
				numRows: 64612,
			}]);
		});
		it("should DS reject files does not exist", async function () {
			let data: string = "";
			try {
				await facade.addDataset("courses", data, InsightDatasetKind.Courses);
				expect.fail("Should have rejected!");
			} catch (err) {
				expect(err).to.be.instanceof(InsightError);
			}
		});
		it("should DS reject name underscore", async function () {
			try {
				await facade.addDataset("courses_fail", courses, InsightDatasetKind.Courses);
				expect.fail("Should have rejected!");
			} catch (err) {
				expect(err).to.be.instanceof(InsightError);
			}
		});
		it("should DS reject name all spaces", async function () {
			try {
				await facade.addDataset("          ", courses, InsightDatasetKind.Courses);
				expect.fail("Should have rejected!");
			} catch (err) {
				expect(err).to.be.instanceof(InsightError);
			}
		});
		it("should DS reject rooms are invalid", async function () {
			try {
				await facade.addDataset("courses", courses, InsightDatasetKind.Rooms);
				expect.fail("Should have rejected!");
			} catch (err) {
				console.log(err);
				expect(err).to.be.instanceof(InsightError);
			}
		});
	});

	describe("List Datasets", function () {
		let facade: IInsightFacade;
		beforeEach(function () {
			clearDisk();
			facade = new InsightFacade();
		});

		it("should DS pass add dataset with same id only once", async function () {
			await facade.addDataset("courses", courses, InsightDatasetKind.Courses);
			try {
				await facade.addDataset("courses", courses, InsightDatasetKind.Courses);
				expect.fail("Should have rejected!");
			} catch (err) {
				expect(err).to.be.instanceof(InsightError);
			}
			const insightDatasets = await facade.listDatasets();
			expect(insightDatasets).to.have.length(1);
			expect(insightDatasets).to.deep.equal([{
				id: "courses",
				kind: InsightDatasetKind.Courses,
				numRows: 64612,
			}]);
		});
		it("should RDS pass add then remove", async function () {
			this.timeout(10000);
			await facade.addDataset("courses", courses, InsightDatasetKind.Courses);
			let removedID = await facade.removeDataset("courses");
			const insightDatasets = await facade.listDatasets();
			expect(insightDatasets).to.have.length(0);
			expect(removedID).to.equal("courses");
		});
		it("should RDS fail add remove twice", async function () {
			await facade.addDataset("courses", courses, InsightDatasetKind.Courses);
			await facade.removeDataset("courses");
			try {
				await facade.removeDataset("courses");
				expect.fail("Should have rejected!");
			} catch (err) {
				expect(err).to.be.instanceof(NotFoundError);
			}
			const insightDatasets = await facade.listDatasets();
			expect(insightDatasets).to.have.length(0);
		});
		it("should RDS fail id has underscore", async function () {
			await facade.addDataset("courses", courses, InsightDatasetKind.Courses);
			try {
				await facade.removeDataset("courses_fail");
				expect.fail("Should have rejected!");
			} catch (err) {
				expect(err).to.be.instanceof(InsightError);
			}
			const insightDatasets = await facade.listDatasets();
			expect(insightDatasets).to.have.length(1);
			expect(insightDatasets).to.deep.equal([{
				id: "courses",
				kind: InsightDatasetKind.Courses,
				numRows: 64612,
			}]);
		});
		it("should RDS fail id is all white spaces", async function () {
			await facade.addDataset("courses", courses, InsightDatasetKind.Courses);
			try {
				await facade.removeDataset("       ");
				expect.fail("Should have rejected!");
			} catch (err) {
				expect(err).to.be.instanceof(InsightError);
			}
			const insightDatasets = await facade.listDatasets();
			expect(insightDatasets).to.have.length(1);
			expect(insightDatasets).to.deep.equal([{
				id: "courses",
				kind: InsightDatasetKind.Courses,
				numRows: 64612,
			}]);
		});
		it("should RDS pass remove 1 of 3", async function () {
			await facade.addDataset("courses0", courses, InsightDatasetKind.Courses);
			await facade.addDataset("courses1", courses16, InsightDatasetKind.Courses);
			await facade.addDataset("courses2", courses10, InsightDatasetKind.Courses);
			await facade.removeDataset("courses1");
			const insightDatasets = await facade.listDatasets();
			const insightDatasetCourses = insightDatasets.find((dataset) => dataset.id === "courses0");
			expect(insightDatasetCourses).to.exist;
			const insightDatasetCourses1 = insightDatasets.find((dataset) => dataset.id === "courses2");
			expect(insightDatasetCourses1).to.exist;
			expect(insightDatasets).to.have.length(2);
			await facade.removeDataset("courses2");
			const insightDatasets3 = await facade.listDatasets();
			const insightDatasetCourses3 = insightDatasets3.find((dataset) => dataset.id === "courses0");
			expect(insightDatasetCourses3).to.exist;
			expect(insightDatasets3).to.have.length(1);
		});
		it("should LDS pass 5 datasets", async function () {
			this.timeout(10000);
			const names: string[] = [
				"asdfghsfdfytry09898987878d6fg???...........",
				"bgU&^nJ6e$V#i!qe",
				"[zv]GIcFYQfBxx?p5-=",
				"sad4636trtyd@#FSdFG",
			];
			let ads1: string[] = await facade.addDataset(names[0], courses, InsightDatasetKind.Courses);
			// const insightDatasets1 = await facade.listDatasets();
			let ads2: string[] = await facade.addDataset(names[1], courses, InsightDatasetKind.Courses);
			// const insightDatasets2 = await facade.listDatasets();
			let ads3: string[] = await facade.addDataset(names[2], courses, InsightDatasetKind.Courses);
			// const insightDatasets3 = await facade.listDatasets();
			let ads4: string[] = await facade.addDataset(names[3], courses, InsightDatasetKind.Courses);
			const insightDatasets4 = await facade.listDatasets();
			expect(ads1).to.deep.include.members([names[0]]);
			expect(ads2).to.deep.include.members([names[0], names[1]]);
			expect(ads3).to.deep.include.members([names[0], names[1], names[2]]);
			expect(ads4).to.deep.include.members([names[0], names[1], names[2], names[3]]);
			const insightDatasetCourses1 = insightDatasets4.find((dataset) => dataset.id === names[0]);
			const insightDatasetCourses2 = insightDatasets4.find((dataset) => dataset.id === names[1]);
			const insightDatasetCourses3 = insightDatasets4.find((dataset) => dataset.id === names[2]);
			const insightDatasetCourses4 = insightDatasets4.find((dataset) => dataset.id === names[3]);
			expect(insightDatasetCourses1).to.exist;
			expect(insightDatasetCourses2).to.exist;
			expect(insightDatasetCourses3).to.exist;
			expect(insightDatasetCourses4).to.exist;
		});
	});
});

