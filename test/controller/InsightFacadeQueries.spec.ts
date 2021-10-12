import {IInsightFacade, InsightDataset, InsightDatasetKind, InsightError,
	NotFoundError, ResultTooLargeError} from "../../src/controller/IInsightFacade";
import InsightFacade from "../../src/controller/InsightFacade";

import * as fs from "fs-extra";
import {clearDisk, getContentFromArchives } from "../resources/TestUtil";
import {testFolder} from "@ubccpsc310/folder-test";
import {expect} from "chai";
import {isValidQuery} from "../../src/controller/ValidateQuery";

type PQErrorKind = "ResultTooLargeError" | "InsightError";

describe("kevincgc c0 tests", function() {
	this.timeout(15000);
	// From the tutorial recording
	// https://ubc.zoom.us/rec/share/HFvuZ0YgHZOQyGTD3I_fmnIhu-Lii890c4qotR6z0jmFSamZ
	// _T51uHAdFVxQQF1h.BS6IZmx4ydr4nG2_?startTime=1631826093000
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
	describe("Normal Queries", function () {
		let insightFacade: InsightFacade;
		before(async function () {
			clearDisk();
			insightFacade = new InsightFacade();
			await insightFacade.addDataset("courses", courses, InsightDatasetKind.Courses);
		});

		testFolder<any, any[], PQErrorKind>(
			"Normal Queries",
			(input): Promise<any[]> => insightFacade.performQuery(input),
			"./test/resources/kevincgc_queries",
			{
				assertOnResult(expected, actual) {
					expect(actual).to.be.an.instanceOf(Array);
					expect(actual).to.have.deep.members(expected);
					expect(actual).to.have.length(expected.length);
				},
				errorValidator: (error): error is PQErrorKind =>
					error === "ResultTooLargeError" || error === "InsightError",
				assertOnError(expected, actual) {
					if (expected === "ResultTooLargeError") {
						expect(actual).to.be.instanceof(ResultTooLargeError);
					} else {
						expect(actual).to.be.instanceof(InsightError);
					}
				},
			}
		);
	});

	describe("Special Queries", function () {
		let insightFacade: InsightFacade;
		before(async function () {
			clearDisk();
			insightFacade = new InsightFacade();
			await insightFacade.addDataset("courses a", courses, InsightDatasetKind.Courses);
			await insightFacade.addDataset("courses b", courses8, InsightDatasetKind.Courses);
		});

		testFolder<any, any[], PQErrorKind>(
			"Special Queries",
			(input): Promise<any[]> => insightFacade.performQuery(input),
			"./test/resources/kevincgc_special_queries",
			{
				assertOnResult(expected, actual) {
					expect(actual).to.be.an.instanceOf(Array);
					expect(actual).to.have.deep.members(expected);
					expect(actual).to.have.length(expected.length);
				},
				errorValidator: (error): error is PQErrorKind =>
					error === "ResultTooLargeError" || error === "InsightError",
				assertOnError(expected, actual) {
					if (expected === "ResultTooLargeError") {
						expect(actual).to.be.instanceof(ResultTooLargeError);
					} else {
						expect(actual).to.be.instanceof(InsightError);
					}
				},
			}
		);
	});
	describe("Special Queries", function () {
		let insightFacade: InsightFacade;
		let insightFacade2: InsightFacade;
		before(async function () {
			clearDisk();
			insightFacade = new InsightFacade();
			insightFacade2 = new InsightFacade();

			await insightFacade.addDataset("courses a", courses16, InsightDatasetKind.Courses);
			await insightFacade.addDataset("courses b", courses8, InsightDatasetKind.Courses);
			await insightFacade2.addDataset("courses", courses, InsightDatasetKind.Courses);
		});
		let datasetNotInQueriedFacade = {
			WHERE: {
				GT: {
					courses_avg: 97
				}
			},
			OPTIONS: {
				COLUMNS: [
					"courses_dept",
					"courses_avg"
				],
				ORDER: "courses_avg"
			}
		};
		it("should test datasetNotInQueriedFacade", async function() {
			let returnedQuery;
			try {
				returnedQuery = await insightFacade.performQuery(datasetNotInQueriedFacade);
				expect.fail("Should have rejected!");
			} catch (err) {
				expect(err).to.be.instanceof(InsightError);
			}
		});
	});
});

