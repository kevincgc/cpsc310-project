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
		let q = {
			WHERE: {
				OR: [
					{
						AND: [
							{
								GT: {
									courses_avg: 80
								}
							},
							{
								IS: {
									courses_dept: "cpsc"
								}
							},
							{
								IS: {
									courses_id: "*"
								}
							},
							{
								GT: {
									courses_year: 2010
								}
							}

						]
					},
					{
						EQ: {
							courses_avg: 100
						}
					}
					,
					{
						EQ: {
							courses_avg: 123
						}
					}
				]
			},
			OPTIONS: {
				COLUMNS: [
					"courses_dept",
					"courses_id",
					"courses_avg"
				],
				ORDER: "courses_avg",
			}
		};
		let q2 = {
			OPTIONS: {
				COLUMNS: [
					"courses_dept",
					"courses_id",
					"courses_avg"
				],
				ORDER: "courses_avg"
			}
		};
		let q3 = {
			WHERE: {
				EQ: {
					courses_avg: 123
				}
			},
			OPTIONS: {
				COLUMNS: [
					"courses_dept",
					"courses_id",
					"courses_avg"
				],
				ORDER: "courses_avg",
			}
		};
		beforeEach(function () {
			fs.removeSync("data");
			facade = new InsightFacade();
		});
		it("should RDS pass add then remove", async function () {
			this.timeout(10000);
			// await facade.addDataset("courses", courses, InsightDatasetKind.Courses);
			console.log(isValidQuery(q));
			console.log(isValidQuery(q2));
			console.log(isValidQuery(q3));
		});
		// it("should list one datasets", function () {
		// 	return facade.addDataset("courses", courses8, InsightDatasetKind.Courses)
		// 		.then(() => {
		// 			return facade.listDatasets();
		// 		})
		// 		.then((insightDatasets) => {
		// 			expect(insightDatasets).to.deep.equal([{
		// 				id: "courses",
		// 				kind: InsightDatasetKind.Courses,
		// 				numRows: 64612,
		// 			}]);
		// 		});
		// });
		// it("should list one datasets", function () {
		// 	fs.removeSync("data");
		// });
		// after(function () {
		// 	fs.removeSync("data");
		// });
	});
	// after(function () {
	// 	fs.removeSync("data");
	// });
});

