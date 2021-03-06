import {IInsightFacade, InsightDatasetKind} from "../../src/controller/IInsightFacade";
import InsightFacade from "../../src/controller/InsightFacade";
import {getContentFromArchives} from "../resources/TestUtil";
import * as fs from "fs-extra";
import {isValidApply, isValidQuery} from "../../src/controller/ValidateQuery";
import {group, sortByKeys} from "../../src/controller/performQuery Helpers";
import {expect} from "chai";

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
			fs.removeSync("data");
			facade = new InsightFacade();
		});
		it("should RDS pass add then remove", async function () {
			this.timeout(10000);
			facade = new InsightFacade();
			await facade.addDataset("courses", courses, InsightDatasetKind.Courses);
			let simpleQuery = {
				"WHERE": {
					"AND": [
						{
							"GT": {
								"courses_avg": 93
							}
						}
					]
				},
				"OPTIONS": {
					"COLUMNS": [
						"coursesMax",
						"courses_dept",
						"courses_year",
						"coursesMin",
						"coursesSum"
					],
					"ORDER": {
						"dir": "DOWN",
						"keys": [
							"coursesMax",
							"courses_dept",
							"courses_year",
							"coursesMin",
							"coursesSum"
						]
					}
				},
				"TRANSFORMATIONS": {
					"GROUP": [
						"courses_dept",
						"courses_year",
						"courses_uuid"
					],
					"APPLY": [
						{
							"coursesMax": {
								"MAX": "courses_avg"
							}
						},
						{
							"coursesMin": {
								"MIN": "courses_avg"
							}
						},
						{
							"coursesSum": {
								"SUM": "courses_avg"
							}
						}
					]
				}
			};
			let returnedQuery = await facade.performQuery(simpleQuery);
			let expectedQuery = [
				{
					"coursesMax": 99.78,
					"courses_dept": "math",
					"courses_year": 2009,
					"coursesMin": 99.78,
					"coursesSum": 99.78
				},
				{
					"coursesMax": 99.78,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 99.78,
					"coursesSum": 99.78
				},
				{
					"coursesMax": 99.19,
					"courses_dept": "cnps",
					"courses_year": 2012,
					"coursesMin": 99.19,
					"coursesSum": 99.19
				},
				{
					"coursesMax": 98.98,
					"courses_dept": "spph",
					"courses_year": 2015,
					"coursesMin": 98.98,
					"coursesSum": 98.98
				},
				{
					"coursesMax": 98.98,
					"courses_dept": "spph",
					"courses_year": 1900,
					"coursesMin": 98.98,
					"coursesSum": 98.98
				},
				{
					"coursesMax": 98.8,
					"courses_dept": "epse",
					"courses_year": 2014,
					"coursesMin": 98.8,
					"coursesSum": 98.8
				},
				{
					"coursesMax": 98.76,
					"courses_dept": "epse",
					"courses_year": 2012,
					"coursesMin": 98.76,
					"coursesSum": 98.76
				},
				{
					"coursesMax": 98.76,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 98.76,
					"coursesSum": 98.76
				},
				{
					"coursesMax": 98.75,
					"courses_dept": "eece",
					"courses_year": 2009,
					"coursesMin": 98.75,
					"coursesSum": 98.75
				},
				{
					"coursesMax": 98.75,
					"courses_dept": "eece",
					"courses_year": 1900,
					"coursesMin": 98.75,
					"coursesSum": 98.75
				},
				{
					"coursesMax": 98.71,
					"courses_dept": "nurs",
					"courses_year": 2011,
					"coursesMin": 98.71,
					"coursesSum": 98.71
				},
				{
					"coursesMax": 98.71,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 98.71,
					"coursesSum": 98.71
				},
				{
					"coursesMax": 98.7,
					"courses_dept": "epse",
					"courses_year": 2009,
					"coursesMin": 98.7,
					"coursesSum": 98.7
				},
				{
					"coursesMax": 98.58,
					"courses_dept": "nurs",
					"courses_year": 2010,
					"coursesMin": 98.58,
					"coursesSum": 98.58
				},
				{
					"coursesMax": 98.58,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 98.58,
					"coursesSum": 98.58
				},
				{
					"coursesMax": 98.58,
					"courses_dept": "epse",
					"courses_year": 2012,
					"coursesMin": 98.58,
					"coursesSum": 98.58
				},
				{
					"coursesMax": 98.58,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 98.58,
					"coursesSum": 98.58
				},
				{
					"coursesMax": 98.5,
					"courses_dept": "nurs",
					"courses_year": 2013,
					"coursesMin": 98.5,
					"coursesSum": 98.5
				},
				{
					"coursesMax": 98.5,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 98.5,
					"coursesSum": 98.5
				},
				{
					"coursesMax": 98.45,
					"courses_dept": "epse",
					"courses_year": 2011,
					"coursesMin": 98.45,
					"coursesSum": 98.45
				},
				{
					"coursesMax": 98.45,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 98.45,
					"coursesSum": 98.45
				},
				{
					"coursesMax": 98.36,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 98.36,
					"coursesSum": 98.36
				},
				{
					"coursesMax": 98.21,
					"courses_dept": "nurs",
					"courses_year": 2015,
					"coursesMin": 98.21,
					"coursesSum": 98.21
				},
				{
					"coursesMax": 98.21,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 98.21,
					"coursesSum": 98.21
				},
				{
					"coursesMax": 98.08,
					"courses_dept": "epse",
					"courses_year": 2009,
					"coursesMin": 98.08,
					"coursesSum": 98.08
				},
				{
					"coursesMax": 98,
					"courses_dept": "crwr",
					"courses_year": 2013,
					"coursesMin": 98,
					"coursesSum": 98
				},
				{
					"coursesMax": 98,
					"courses_dept": "crwr",
					"courses_year": 2013,
					"coursesMin": 98,
					"coursesSum": 98
				},
				{
					"coursesMax": 97.78,
					"courses_dept": "epse",
					"courses_year": 2009,
					"coursesMin": 97.78,
					"coursesSum": 97.78
				},
				{
					"coursesMax": 97.69,
					"courses_dept": "epse",
					"courses_year": 2013,
					"coursesMin": 97.69,
					"coursesSum": 97.69
				},
				{
					"coursesMax": 97.67,
					"courses_dept": "epse",
					"courses_year": 2007,
					"coursesMin": 97.67,
					"coursesSum": 97.67
				},
				{
					"coursesMax": 97.53,
					"courses_dept": "nurs",
					"courses_year": 2015,
					"coursesMin": 97.53,
					"coursesSum": 97.53
				},
				{
					"coursesMax": 97.53,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 97.53,
					"coursesSum": 97.53
				},
				{
					"coursesMax": 97.5,
					"courses_dept": "educ",
					"courses_year": 2015,
					"coursesMin": 97.5,
					"coursesSum": 97.5
				},
				{
					"coursesMax": 97.48,
					"courses_dept": "math",
					"courses_year": 2010,
					"coursesMin": 97.48,
					"coursesSum": 97.48
				},
				{
					"coursesMax": 97.48,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 97.48,
					"coursesSum": 97.48
				},
				{
					"coursesMax": 97.47,
					"courses_dept": "cnps",
					"courses_year": 2009,
					"coursesMin": 97.47,
					"coursesSum": 97.47
				},
				{
					"coursesMax": 97.47,
					"courses_dept": "cnps",
					"courses_year": 1900,
					"coursesMin": 97.47,
					"coursesSum": 97.47
				},
				{
					"coursesMax": 97.41,
					"courses_dept": "epse",
					"courses_year": 2011,
					"coursesMin": 97.41,
					"coursesSum": 97.41
				},
				{
					"coursesMax": 97.41,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 97.41,
					"coursesSum": 97.41
				},
				{
					"coursesMax": 97.33,
					"courses_dept": "nurs",
					"courses_year": 2010,
					"coursesMin": 97.33,
					"coursesSum": 97.33
				},
				{
					"coursesMax": 97.33,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 97.33,
					"coursesSum": 97.33
				},
				{
					"coursesMax": 97.29,
					"courses_dept": "epse",
					"courses_year": 2010,
					"coursesMin": 97.29,
					"coursesSum": 97.29
				},
				{
					"coursesMax": 97.29,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 97.29,
					"coursesSum": 97.29
				},
				{
					"coursesMax": 97.25,
					"courses_dept": "math",
					"courses_year": 2016,
					"coursesMin": 97.25,
					"coursesSum": 97.25
				},
				{
					"coursesMax": 97.25,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 97.25,
					"coursesSum": 97.25
				},
				{
					"coursesMax": 97.09,
					"courses_dept": "math",
					"courses_year": 2010,
					"coursesMin": 97.09,
					"coursesSum": 97.09
				},
				{
					"coursesMax": 97.09,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 97.09,
					"coursesSum": 97.09
				},
				{
					"coursesMax": 97.09,
					"courses_dept": "epse",
					"courses_year": 2007,
					"coursesMin": 97.09,
					"coursesSum": 97.09
				},
				{
					"coursesMax": 97.09,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 97.09,
					"coursesSum": 97.09
				},
				{
					"coursesMax": 97,
					"courses_dept": "psyc",
					"courses_year": 2012,
					"coursesMin": 97,
					"coursesSum": 97
				},
				{
					"coursesMax": 97,
					"courses_dept": "epse",
					"courses_year": 2009,
					"coursesMin": 97,
					"coursesSum": 97
				},
				{
					"coursesMax": 97,
					"courses_dept": "crwr",
					"courses_year": 2014,
					"coursesMin": 97,
					"coursesSum": 97
				},
				{
					"coursesMax": 96.96,
					"courses_dept": "spph",
					"courses_year": 2015,
					"coursesMin": 96.96,
					"coursesSum": 96.96
				},
				{
					"coursesMax": 96.94,
					"courses_dept": "arst",
					"courses_year": 2008,
					"coursesMin": 96.94,
					"coursesSum": 96.94
				},
				{
					"coursesMax": 96.94,
					"courses_dept": "arst",
					"courses_year": 1900,
					"coursesMin": 96.94,
					"coursesSum": 96.94
				},
				{
					"coursesMax": 96.9,
					"courses_dept": "epse",
					"courses_year": 2014,
					"coursesMin": 96.9,
					"coursesSum": 96.9
				},
				{
					"coursesMax": 96.9,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 96.9,
					"coursesSum": 96.9
				},
				{
					"coursesMax": 96.9,
					"courses_dept": "audi",
					"courses_year": 2012,
					"coursesMin": 96.9,
					"coursesSum": 96.9
				},
				{
					"coursesMax": 96.9,
					"courses_dept": "audi",
					"courses_year": 1900,
					"coursesMin": 96.9,
					"coursesSum": 96.9
				},
				{
					"coursesMax": 96.83,
					"courses_dept": "math",
					"courses_year": 2011,
					"coursesMin": 96.83,
					"coursesSum": 96.83
				},
				{
					"coursesMax": 96.83,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 96.83,
					"coursesSum": 96.83
				},
				{
					"coursesMax": 96.8,
					"courses_dept": "spph",
					"courses_year": 2010,
					"coursesMin": 96.8,
					"coursesSum": 96.8
				},
				{
					"coursesMax": 96.8,
					"courses_dept": "spph",
					"courses_year": 1900,
					"coursesMin": 96.8,
					"coursesSum": 96.8
				},
				{
					"coursesMax": 96.73,
					"courses_dept": "nurs",
					"courses_year": 2016,
					"coursesMin": 96.73,
					"coursesSum": 96.73
				},
				{
					"coursesMax": 96.73,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 96.73,
					"coursesSum": 96.73
				},
				{
					"coursesMax": 96.64,
					"courses_dept": "nurs",
					"courses_year": 2012,
					"coursesMin": 96.64,
					"coursesSum": 96.64
				},
				{
					"coursesMax": 96.64,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 96.64,
					"coursesSum": 96.64
				},
				{
					"coursesMax": 96.59,
					"courses_dept": "mine",
					"courses_year": 2012,
					"coursesMin": 96.59,
					"coursesSum": 96.59
				},
				{
					"coursesMax": 96.5,
					"courses_dept": "musc",
					"courses_year": 2012,
					"coursesMin": 96.5,
					"coursesSum": 96.5
				},
				{
					"coursesMax": 96.5,
					"courses_dept": "musc",
					"courses_year": 1900,
					"coursesMin": 96.5,
					"coursesSum": 96.5
				},
				{
					"coursesMax": 96.5,
					"courses_dept": "midw",
					"courses_year": 2012,
					"coursesMin": 96.5,
					"coursesSum": 96.5
				},
				{
					"coursesMax": 96.5,
					"courses_dept": "midw",
					"courses_year": 1900,
					"coursesMin": 96.5,
					"coursesSum": 96.5
				},
				{
					"coursesMax": 96.47,
					"courses_dept": "plan",
					"courses_year": 2011,
					"coursesMin": 96.47,
					"coursesSum": 96.47
				},
				{
					"coursesMax": 96.47,
					"courses_dept": "plan",
					"courses_year": 1900,
					"coursesMin": 96.47,
					"coursesSum": 96.47
				},
				{
					"coursesMax": 96.47,
					"courses_dept": "etec",
					"courses_year": 2012,
					"coursesMin": 96.47,
					"coursesSum": 96.47
				},
				{
					"coursesMax": 96.47,
					"courses_dept": "etec",
					"courses_year": 1900,
					"coursesMin": 96.47,
					"coursesSum": 96.47
				},
				{
					"coursesMax": 96.46,
					"courses_dept": "edst",
					"courses_year": 2013,
					"coursesMin": 96.46,
					"coursesSum": 96.46
				},
				{
					"coursesMax": 96.46,
					"courses_dept": "edst",
					"courses_year": 1900,
					"coursesMin": 96.46,
					"coursesSum": 96.46
				},
				{
					"coursesMax": 96.44,
					"courses_dept": "math",
					"courses_year": 2009,
					"coursesMin": 96.44,
					"coursesSum": 96.44
				},
				{
					"coursesMax": 96.44,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 96.44,
					"coursesSum": 96.44
				},
				{
					"coursesMax": 96.4,
					"courses_dept": "fipr",
					"courses_year": 2015,
					"coursesMin": 96.4,
					"coursesSum": 96.4
				},
				{
					"coursesMax": 96.4,
					"courses_dept": "fipr",
					"courses_year": 1900,
					"coursesMin": 96.4,
					"coursesSum": 96.4
				},
				{
					"coursesMax": 96.36,
					"courses_dept": "frst",
					"courses_year": 2015,
					"coursesMin": 96.36,
					"coursesSum": 96.36
				},
				{
					"coursesMax": 96.36,
					"courses_dept": "frst",
					"courses_year": 1900,
					"coursesMin": 96.36,
					"coursesSum": 96.36
				},
				{
					"coursesMax": 96.33,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 96.33,
					"coursesSum": 96.33
				},
				{
					"coursesMax": 96.33,
					"courses_dept": "epse",
					"courses_year": 2014,
					"coursesMin": 96.33,
					"coursesSum": 96.33
				},
				{
					"coursesMax": 96.33,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 96.33,
					"coursesSum": 96.33
				},
				{
					"coursesMax": 96.33,
					"courses_dept": "cnps",
					"courses_year": 2013,
					"coursesMin": 96.33,
					"coursesSum": 96.33
				},
				{
					"coursesMax": 96.27,
					"courses_dept": "civl",
					"courses_year": 2012,
					"coursesMin": 96.27,
					"coursesSum": 96.27
				},
				{
					"coursesMax": 96.27,
					"courses_dept": "civl",
					"courses_year": 1900,
					"coursesMin": 96.27,
					"coursesSum": 96.27
				},
				{
					"coursesMax": 96.25,
					"courses_dept": "mtrl",
					"courses_year": 2011,
					"coursesMin": 96.25,
					"coursesSum": 96.25
				},
				{
					"coursesMax": 96.25,
					"courses_dept": "mtrl",
					"courses_year": 1900,
					"coursesMin": 96.25,
					"coursesSum": 96.25
				},
				{
					"coursesMax": 96.25,
					"courses_dept": "math",
					"courses_year": 2015,
					"coursesMin": 96.25,
					"coursesSum": 96.25
				},
				{
					"coursesMax": 96.25,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 96.25,
					"coursesSum": 96.25
				},
				{
					"coursesMax": 96.24,
					"courses_dept": "epse",
					"courses_year": 2013,
					"coursesMin": 96.24,
					"coursesSum": 96.24
				},
				{
					"coursesMax": 96.23,
					"courses_dept": "epse",
					"courses_year": 2009,
					"coursesMin": 96.23,
					"coursesSum": 96.23
				},
				{
					"coursesMax": 96.21,
					"courses_dept": "epse",
					"courses_year": 2015,
					"coursesMin": 96.21,
					"coursesSum": 96.21
				},
				{
					"coursesMax": 96.21,
					"courses_dept": "epse",
					"courses_year": 2009,
					"coursesMin": 96.21,
					"coursesSum": 96.21
				},
				{
					"coursesMax": 96.21,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 96.21,
					"coursesSum": 96.21
				},
				{
					"coursesMax": 96.16,
					"courses_dept": "cnps",
					"courses_year": 1900,
					"coursesMin": 96.16,
					"coursesSum": 96.16
				},
				{
					"coursesMax": 96.15,
					"courses_dept": "sowk",
					"courses_year": 2012,
					"coursesMin": 96.15,
					"coursesSum": 96.15
				},
				{
					"coursesMax": 96.15,
					"courses_dept": "sowk",
					"courses_year": 1900,
					"coursesMin": 96.15,
					"coursesSum": 96.15
				},
				{
					"coursesMax": 96.11,
					"courses_dept": "adhe",
					"courses_year": 2015,
					"coursesMin": 96.11,
					"coursesSum": 96.11
				},
				{
					"coursesMax": 96.1,
					"courses_dept": "libr",
					"courses_year": 2015,
					"coursesMin": 96.1,
					"coursesSum": 96.1
				},
				{
					"coursesMax": 96.1,
					"courses_dept": "libr",
					"courses_year": 1900,
					"coursesMin": 96.1,
					"coursesSum": 96.1
				},
				{
					"coursesMax": 96.09,
					"courses_dept": "sowk",
					"courses_year": 2014,
					"coursesMin": 96.09,
					"coursesSum": 96.09
				},
				{
					"coursesMax": 96.06,
					"courses_dept": "kin",
					"courses_year": 2013,
					"coursesMin": 96.06,
					"coursesSum": 96.06
				},
				{
					"coursesMax": 96.06,
					"courses_dept": "kin",
					"courses_year": 1900,
					"coursesMin": 96.06,
					"coursesSum": 96.06
				},
				{
					"coursesMax": 96.03,
					"courses_dept": "epse",
					"courses_year": 2013,
					"coursesMin": 96.03,
					"coursesSum": 96.03
				},
				{
					"coursesMax": 96.03,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 96.03,
					"coursesSum": 96.03
				},
				{
					"coursesMax": 96,
					"courses_dept": "psyc",
					"courses_year": 2015,
					"coursesMin": 96,
					"coursesSum": 96
				},
				{
					"coursesMax": 96,
					"courses_dept": "psyc",
					"courses_year": 1900,
					"coursesMin": 96,
					"coursesSum": 96
				},
				{
					"coursesMax": 96,
					"courses_dept": "psyc",
					"courses_year": 1900,
					"coursesMin": 96,
					"coursesSum": 96
				},
				{
					"coursesMax": 96,
					"courses_dept": "phil",
					"courses_year": 2010,
					"coursesMin": 96,
					"coursesSum": 96
				},
				{
					"coursesMax": 96,
					"courses_dept": "pcth",
					"courses_year": 1900,
					"coursesMin": 96,
					"coursesSum": 96
				},
				{
					"coursesMax": 96,
					"courses_dept": "kin",
					"courses_year": 2013,
					"coursesMin": 96,
					"coursesSum": 96
				},
				{
					"coursesMax": 96,
					"courses_dept": "epse",
					"courses_year": 2012,
					"coursesMin": 96,
					"coursesSum": 96
				},
				{
					"coursesMax": 96,
					"courses_dept": "epse",
					"courses_year": 2009,
					"coursesMin": 96,
					"coursesSum": 96
				},
				{
					"coursesMax": 96,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 96,
					"coursesSum": 96
				},
				{
					"coursesMax": 96,
					"courses_dept": "crwr",
					"courses_year": 2014,
					"coursesMin": 96,
					"coursesSum": 96
				},
				{
					"coursesMax": 96,
					"courses_dept": "crwr",
					"courses_year": 2014,
					"coursesMin": 96,
					"coursesSum": 96
				},
				{
					"coursesMax": 96,
					"courses_dept": "crwr",
					"courses_year": 2014,
					"coursesMin": 96,
					"coursesSum": 96
				},
				{
					"coursesMax": 96,
					"courses_dept": "crwr",
					"courses_year": 2013,
					"coursesMin": 96,
					"coursesSum": 96
				},
				{
					"coursesMax": 96,
					"courses_dept": "crwr",
					"courses_year": 2012,
					"coursesMin": 96,
					"coursesSum": 96
				},
				{
					"coursesMax": 96,
					"courses_dept": "cnps",
					"courses_year": 2013,
					"coursesMin": 96,
					"coursesSum": 96
				},
				{
					"coursesMax": 96,
					"courses_dept": "apsc",
					"courses_year": 2010,
					"coursesMin": 96,
					"coursesSum": 96
				},
				{
					"coursesMax": 95.96,
					"courses_dept": "etec",
					"courses_year": 2014,
					"coursesMin": 95.96,
					"coursesSum": 95.96
				},
				{
					"coursesMax": 95.96,
					"courses_dept": "etec",
					"courses_year": 1900,
					"coursesMin": 95.96,
					"coursesSum": 95.96
				},
				{
					"coursesMax": 95.95,
					"courses_dept": "apsc",
					"courses_year": 2009,
					"coursesMin": 95.95,
					"coursesSum": 95.95
				},
				{
					"coursesMax": 95.94,
					"courses_dept": "apsc",
					"courses_year": 2007,
					"coursesMin": 95.94,
					"coursesSum": 95.94
				},
				{
					"coursesMax": 95.93,
					"courses_dept": "sowk",
					"courses_year": 2014,
					"coursesMin": 95.93,
					"coursesSum": 95.93
				},
				{
					"coursesMax": 95.93,
					"courses_dept": "sowk",
					"courses_year": 1900,
					"coursesMin": 95.93,
					"coursesSum": 95.93
				},
				{
					"coursesMax": 95.9,
					"courses_dept": "epse",
					"courses_year": 2016,
					"coursesMin": 95.9,
					"coursesSum": 95.9
				},
				{
					"coursesMax": 95.86,
					"courses_dept": "epse",
					"courses_year": 2011,
					"coursesMin": 95.86,
					"coursesSum": 95.86
				},
				{
					"coursesMax": 95.86,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 95.86,
					"coursesSum": 95.86
				},
				{
					"coursesMax": 95.83,
					"courses_dept": "epse",
					"courses_year": 2008,
					"coursesMin": 95.83,
					"coursesSum": 95.83
				},
				{
					"coursesMax": 95.83,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 95.83,
					"coursesSum": 95.83
				},
				{
					"coursesMax": 95.78,
					"courses_dept": "edst",
					"courses_year": 2010,
					"coursesMin": 95.78,
					"coursesSum": 95.78
				},
				{
					"coursesMax": 95.78,
					"courses_dept": "edst",
					"courses_year": 1900,
					"coursesMin": 95.78,
					"coursesSum": 95.78
				},
				{
					"coursesMax": 95.78,
					"courses_dept": "cnps",
					"courses_year": 2015,
					"coursesMin": 95.78,
					"coursesSum": 95.78
				},
				{
					"coursesMax": 95.78,
					"courses_dept": "cnps",
					"courses_year": 1900,
					"coursesMin": 95.78,
					"coursesSum": 95.78
				},
				{
					"coursesMax": 95.76,
					"courses_dept": "spph",
					"courses_year": 1900,
					"coursesMin": 95.76,
					"coursesSum": 95.76
				},
				{
					"coursesMax": 95.75,
					"courses_dept": "spph",
					"courses_year": 2013,
					"coursesMin": 95.75,
					"coursesSum": 95.75
				},
				{
					"coursesMax": 95.75,
					"courses_dept": "spph",
					"courses_year": 1900,
					"coursesMin": 95.75,
					"coursesSum": 95.75
				},
				{
					"coursesMax": 95.75,
					"courses_dept": "psyc",
					"courses_year": 2015,
					"coursesMin": 95.75,
					"coursesSum": 95.75
				},
				{
					"coursesMax": 95.75,
					"courses_dept": "psyc",
					"courses_year": 1900,
					"coursesMin": 95.75,
					"coursesSum": 95.75
				},
				{
					"coursesMax": 95.72,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 95.72,
					"coursesSum": 95.72
				},
				{
					"coursesMax": 95.7,
					"courses_dept": "crwr",
					"courses_year": 2012,
					"coursesMin": 95.7,
					"coursesSum": 95.7
				},
				{
					"coursesMax": 95.7,
					"courses_dept": "crwr",
					"courses_year": 1900,
					"coursesMin": 95.7,
					"coursesSum": 95.7
				},
				{
					"coursesMax": 95.67,
					"courses_dept": "musc",
					"courses_year": 1900,
					"coursesMin": 95.67,
					"coursesSum": 95.67
				},
				{
					"coursesMax": 95.67,
					"courses_dept": "math",
					"courses_year": 2015,
					"coursesMin": 95.67,
					"coursesSum": 95.67
				},
				{
					"coursesMax": 95.67,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 95.67,
					"coursesSum": 95.67
				},
				{
					"coursesMax": 95.67,
					"courses_dept": "epse",
					"courses_year": 2015,
					"coursesMin": 95.67,
					"coursesSum": 95.67
				},
				{
					"coursesMax": 95.67,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 95.67,
					"coursesSum": 95.67
				},
				{
					"coursesMax": 95.63,
					"courses_dept": "etec",
					"courses_year": 2013,
					"coursesMin": 95.63,
					"coursesSum": 95.63
				},
				{
					"coursesMax": 95.6,
					"courses_dept": "mine",
					"courses_year": 2009,
					"coursesMin": 95.6,
					"coursesSum": 95.6
				},
				{
					"coursesMax": 95.58,
					"courses_dept": "edcp",
					"courses_year": 2012,
					"coursesMin": 95.58,
					"coursesSum": 95.58
				},
				{
					"coursesMax": 95.58,
					"courses_dept": "edcp",
					"courses_year": 1900,
					"coursesMin": 95.58,
					"coursesSum": 95.58
				},
				{
					"coursesMax": 95.56,
					"courses_dept": "math",
					"courses_year": 2007,
					"coursesMin": 95.56,
					"coursesSum": 95.56
				},
				{
					"coursesMax": 95.56,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 95.56,
					"coursesSum": 95.56
				},
				{
					"coursesMax": 95.54,
					"courses_dept": "chbe",
					"courses_year": 2013,
					"coursesMin": 95.54,
					"coursesSum": 95.54
				},
				{
					"coursesMax": 95.54,
					"courses_dept": "chbe",
					"courses_year": 1900,
					"coursesMin": 95.54,
					"coursesSum": 95.54
				},
				{
					"coursesMax": 95.5,
					"courses_dept": "epse",
					"courses_year": 2015,
					"coursesMin": 95.5,
					"coursesSum": 95.5
				},
				{
					"coursesMax": 95.5,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 95.5,
					"coursesSum": 95.5
				},
				{
					"coursesMax": 95.47,
					"courses_dept": "epse",
					"courses_year": 2014,
					"coursesMin": 95.47,
					"coursesSum": 95.47
				},
				{
					"coursesMax": 95.47,
					"courses_dept": "epse",
					"courses_year": 2013,
					"coursesMin": 95.47,
					"coursesSum": 95.47
				},
				{
					"coursesMax": 95.47,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 95.47,
					"coursesSum": 95.47
				},
				{
					"coursesMax": 95.44,
					"courses_dept": "mine",
					"courses_year": 2013,
					"coursesMin": 95.44,
					"coursesSum": 95.44
				},
				{
					"coursesMax": 95.44,
					"courses_dept": "epse",
					"courses_year": 2014,
					"coursesMin": 95.44,
					"coursesSum": 95.44
				},
				{
					"coursesMax": 95.43,
					"courses_dept": "phys",
					"courses_year": 2015,
					"coursesMin": 95.43,
					"coursesSum": 95.43
				},
				{
					"coursesMax": 95.43,
					"courses_dept": "phys",
					"courses_year": 1900,
					"coursesMin": 95.43,
					"coursesSum": 95.43
				},
				{
					"coursesMax": 95.43,
					"courses_dept": "nurs",
					"courses_year": 2010,
					"coursesMin": 95.43,
					"coursesSum": 95.43
				},
				{
					"coursesMax": 95.43,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 95.43,
					"coursesSum": 95.43
				},
				{
					"coursesMax": 95.43,
					"courses_dept": "mine",
					"courses_year": 1900,
					"coursesMin": 95.43,
					"coursesSum": 95.43
				},
				{
					"coursesMax": 95.41,
					"courses_dept": "epse",
					"courses_year": 2010,
					"coursesMin": 95.41,
					"coursesSum": 95.41
				},
				{
					"coursesMax": 95.38,
					"courses_dept": "musc",
					"courses_year": 2015,
					"coursesMin": 95.38,
					"coursesSum": 95.38
				},
				{
					"coursesMax": 95.37,
					"courses_dept": "phth",
					"courses_year": 2013,
					"coursesMin": 95.37,
					"coursesSum": 95.37
				},
				{
					"coursesMax": 95.37,
					"courses_dept": "phth",
					"courses_year": 1900,
					"coursesMin": 95.37,
					"coursesSum": 95.37
				},
				{
					"coursesMax": 95.36,
					"courses_dept": "kin",
					"courses_year": 2014,
					"coursesMin": 95.36,
					"coursesSum": 95.36
				},
				{
					"coursesMax": 95.36,
					"courses_dept": "kin",
					"courses_year": 1900,
					"coursesMin": 95.36,
					"coursesSum": 95.36
				},
				{
					"coursesMax": 95.36,
					"courses_dept": "cnps",
					"courses_year": 2012,
					"coursesMin": 95.36,
					"coursesSum": 95.36
				},
				{
					"coursesMax": 95.36,
					"courses_dept": "cnps",
					"courses_year": 2011,
					"coursesMin": 95.36,
					"coursesSum": 95.36
				},
				{
					"coursesMax": 95.36,
					"courses_dept": "cnps",
					"courses_year": 1900,
					"coursesMin": 95.36,
					"coursesSum": 95.36
				},
				{
					"coursesMax": 95.33,
					"courses_dept": "etec",
					"courses_year": 2013,
					"coursesMin": 95.33,
					"coursesSum": 95.33
				},
				{
					"coursesMax": 95.33,
					"courses_dept": "epse",
					"courses_year": 2013,
					"coursesMin": 95.33,
					"coursesSum": 95.33
				},
				{
					"coursesMax": 95.32,
					"courses_dept": "etec",
					"courses_year": 2016,
					"coursesMin": 95.32,
					"coursesSum": 95.32
				},
				{
					"coursesMax": 95.32,
					"courses_dept": "etec",
					"courses_year": 1900,
					"coursesMin": 95.32,
					"coursesSum": 95.32
				},
				{
					"coursesMax": 95.31,
					"courses_dept": "epse",
					"courses_year": 2010,
					"coursesMin": 95.31,
					"coursesSum": 95.31
				},
				{
					"coursesMax": 95.31,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 95.31,
					"coursesSum": 95.31
				},
				{
					"coursesMax": 95.31,
					"courses_dept": "chbe",
					"courses_year": 2015,
					"coursesMin": 95.31,
					"coursesSum": 95.31
				},
				{
					"coursesMax": 95.31,
					"courses_dept": "chbe",
					"courses_year": 1900,
					"coursesMin": 95.31,
					"coursesSum": 95.31
				},
				{
					"coursesMax": 95.3,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 95.3,
					"coursesSum": 95.3
				},
				{
					"coursesMax": 95.29,
					"courses_dept": "nurs",
					"courses_year": 2013,
					"coursesMin": 95.29,
					"coursesSum": 95.29
				},
				{
					"coursesMax": 95.29,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 95.29,
					"coursesSum": 95.29
				},
				{
					"coursesMax": 95.29,
					"courses_dept": "hgse",
					"courses_year": 2014,
					"coursesMin": 95.29,
					"coursesSum": 95.29
				},
				{
					"coursesMax": 95.29,
					"courses_dept": "hgse",
					"courses_year": 1900,
					"coursesMin": 95.29,
					"coursesSum": 95.29
				},
				{
					"coursesMax": 95.27,
					"courses_dept": "epse",
					"courses_year": 2008,
					"coursesMin": 95.27,
					"coursesSum": 95.27
				},
				{
					"coursesMax": 95.27,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 95.27,
					"coursesSum": 95.27
				},
				{
					"coursesMax": 95.26,
					"courses_dept": "hgse",
					"courses_year": 2016,
					"coursesMin": 95.26,
					"coursesSum": 95.26
				},
				{
					"coursesMax": 95.26,
					"courses_dept": "hgse",
					"courses_year": 1900,
					"coursesMin": 95.26,
					"coursesSum": 95.26
				},
				{
					"coursesMax": 95.25,
					"courses_dept": "psyc",
					"courses_year": 2007,
					"coursesMin": 95.25,
					"coursesSum": 95.25
				},
				{
					"coursesMax": 95.25,
					"courses_dept": "psyc",
					"courses_year": 1900,
					"coursesMin": 95.25,
					"coursesSum": 95.25
				},
				{
					"coursesMax": 95.22,
					"courses_dept": "epse",
					"courses_year": 2009,
					"coursesMin": 95.22,
					"coursesSum": 95.22
				},
				{
					"coursesMax": 95.22,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 95.22,
					"coursesSum": 95.22
				},
				{
					"coursesMax": 95.2,
					"courses_dept": "thtr",
					"courses_year": 2011,
					"coursesMin": 95.2,
					"coursesSum": 95.2
				},
				{
					"coursesMax": 95.2,
					"courses_dept": "thtr",
					"courses_year": 1900,
					"coursesMin": 95.2,
					"coursesSum": 95.2
				},
				{
					"coursesMax": 95.19,
					"courses_dept": "etec",
					"courses_year": 2013,
					"coursesMin": 95.19,
					"coursesSum": 95.19
				},
				{
					"coursesMax": 95.19,
					"courses_dept": "etec",
					"courses_year": 1900,
					"coursesMin": 95.19,
					"coursesSum": 95.19
				},
				{
					"coursesMax": 95.18,
					"courses_dept": "mine",
					"courses_year": 1900,
					"coursesMin": 95.18,
					"coursesSum": 95.18
				},
				{
					"coursesMax": 95.17,
					"courses_dept": "epse",
					"courses_year": 2013,
					"coursesMin": 95.17,
					"coursesSum": 95.17
				},
				{
					"coursesMax": 95.17,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 95.17,
					"coursesSum": 95.17
				},
				{
					"coursesMax": 95.16,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 95.16,
					"coursesSum": 95.16
				},
				{
					"coursesMax": 95.16,
					"courses_dept": "educ",
					"courses_year": 2013,
					"coursesMin": 95.16,
					"coursesSum": 95.16
				},
				{
					"coursesMax": 95.15,
					"courses_dept": "epse",
					"courses_year": 2011,
					"coursesMin": 95.15,
					"coursesSum": 95.15
				},
				{
					"coursesMax": 95.15,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 95.15,
					"coursesSum": 95.15
				},
				{
					"coursesMax": 95.15,
					"courses_dept": "bmeg",
					"courses_year": 2012,
					"coursesMin": 95.15,
					"coursesSum": 95.15
				},
				{
					"coursesMax": 95.15,
					"courses_dept": "bmeg",
					"courses_year": 1900,
					"coursesMin": 95.15,
					"coursesSum": 95.15
				},
				{
					"coursesMax": 95.14,
					"courses_dept": "epse",
					"courses_year": 2011,
					"coursesMin": 95.14,
					"coursesSum": 95.14
				},
				{
					"coursesMax": 95.13,
					"courses_dept": "nurs",
					"courses_year": 2014,
					"coursesMin": 95.13,
					"coursesSum": 95.13
				},
				{
					"coursesMax": 95.13,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 95.13,
					"coursesSum": 95.13
				},
				{
					"coursesMax": 95.13,
					"courses_dept": "epse",
					"courses_year": 2012,
					"coursesMin": 95.13,
					"coursesSum": 95.13
				},
				{
					"coursesMax": 95.13,
					"courses_dept": "epse",
					"courses_year": 2010,
					"coursesMin": 95.13,
					"coursesSum": 95.13
				},
				{
					"coursesMax": 95.13,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 95.13,
					"coursesSum": 95.13
				},
				{
					"coursesMax": 95.11,
					"courses_dept": "spph",
					"courses_year": 2009,
					"coursesMin": 95.11,
					"coursesSum": 95.11
				},
				{
					"coursesMax": 95.11,
					"courses_dept": "epse",
					"courses_year": 2007,
					"coursesMin": 95.11,
					"coursesSum": 95.11
				},
				{
					"coursesMax": 95.1,
					"courses_dept": "etec",
					"courses_year": 2011,
					"coursesMin": 95.1,
					"coursesSum": 95.1
				},
				{
					"coursesMax": 95.1,
					"courses_dept": "etec",
					"courses_year": 1900,
					"coursesMin": 95.1,
					"coursesSum": 95.1
				},
				{
					"coursesMax": 95.09,
					"courses_dept": "spph",
					"courses_year": 2009,
					"coursesMin": 95.09,
					"coursesSum": 95.09
				},
				{
					"coursesMax": 95.09,
					"courses_dept": "spph",
					"courses_year": 1900,
					"coursesMin": 95.09,
					"coursesSum": 95.09
				},
				{
					"coursesMax": 95.07,
					"courses_dept": "phar",
					"courses_year": 2014,
					"coursesMin": 95.07,
					"coursesSum": 95.07
				},
				{
					"coursesMax": 95.05,
					"courses_dept": "apsc",
					"courses_year": 2010,
					"coursesMin": 95.05,
					"coursesSum": 95.05
				},
				{
					"coursesMax": 95,
					"courses_dept": "sowk",
					"courses_year": 2015,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "rhsc",
					"courses_year": 2009,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "psyc",
					"courses_year": 2010,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "psyc",
					"courses_year": 1900,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "obst",
					"courses_year": 1900,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "nurs",
					"courses_year": 2010,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "musc",
					"courses_year": 2013,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "musc",
					"courses_year": 2011,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "musc",
					"courses_year": 2010,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "musc",
					"courses_year": 1900,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "musc",
					"courses_year": 1900,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "musc",
					"courses_year": 1900,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "mtrl",
					"courses_year": 2011,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "mtrl",
					"courses_year": 2010,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "mtrl",
					"courses_year": 1900,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "math",
					"courses_year": 2008,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "kin",
					"courses_year": 2015,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "kin",
					"courses_year": 2014,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "kin",
					"courses_year": 2013,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "epse",
					"courses_year": 2009,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "epse",
					"courses_year": 2007,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "edcp",
					"courses_year": 2013,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "edcp",
					"courses_year": 1900,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "econ",
					"courses_year": 2016,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "econ",
					"courses_year": 1900,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "crwr",
					"courses_year": 2015,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "crwr",
					"courses_year": 2014,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "crwr",
					"courses_year": 2014,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "crwr",
					"courses_year": 2013,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "crwr",
					"courses_year": 2013,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "crwr",
					"courses_year": 2012,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "crwr",
					"courses_year": 1900,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "cpsc",
					"courses_year": 2014,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "cpsc",
					"courses_year": 1900,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "cnps",
					"courses_year": 2016,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "cnps",
					"courses_year": 1900,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "bmeg",
					"courses_year": 2014,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 95,
					"courses_dept": "bmeg",
					"courses_year": 1900,
					"coursesMin": 95,
					"coursesSum": 95
				},
				{
					"coursesMax": 94.94,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.94,
					"coursesSum": 94.94
				},
				{
					"coursesMax": 94.94,
					"courses_dept": "apsc",
					"courses_year": 2007,
					"coursesMin": 94.94,
					"coursesSum": 94.94
				},
				{
					"coursesMax": 94.93,
					"courses_dept": "edst",
					"courses_year": 2015,
					"coursesMin": 94.93,
					"coursesSum": 94.93
				},
				{
					"coursesMax": 94.93,
					"courses_dept": "edst",
					"courses_year": 1900,
					"coursesMin": 94.93,
					"coursesSum": 94.93
				},
				{
					"coursesMax": 94.92,
					"courses_dept": "nurs",
					"courses_year": 2014,
					"coursesMin": 94.92,
					"coursesSum": 94.92
				},
				{
					"coursesMax": 94.92,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 94.92,
					"coursesSum": 94.92
				},
				{
					"coursesMax": 94.92,
					"courses_dept": "kin",
					"courses_year": 2015,
					"coursesMin": 94.92,
					"coursesSum": 94.92
				},
				{
					"coursesMax": 94.91,
					"courses_dept": "epse",
					"courses_year": 2012,
					"coursesMin": 94.91,
					"coursesSum": 94.91
				},
				{
					"coursesMax": 94.91,
					"courses_dept": "epse",
					"courses_year": 2011,
					"coursesMin": 94.91,
					"coursesSum": 94.91
				},
				{
					"coursesMax": 94.91,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.91,
					"coursesSum": 94.91
				},
				{
					"coursesMax": 94.91,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.91,
					"coursesSum": 94.91
				},
				{
					"coursesMax": 94.89,
					"courses_dept": "cnps",
					"courses_year": 2013,
					"coursesMin": 94.89,
					"coursesSum": 94.89
				},
				{
					"coursesMax": 94.88,
					"courses_dept": "etec",
					"courses_year": 2014,
					"coursesMin": 94.88,
					"coursesSum": 94.88
				},
				{
					"coursesMax": 94.88,
					"courses_dept": "epse",
					"courses_year": 2014,
					"coursesMin": 94.88,
					"coursesSum": 94.88
				},
				{
					"coursesMax": 94.88,
					"courses_dept": "epse",
					"courses_year": 2010,
					"coursesMin": 94.88,
					"coursesSum": 94.88
				},
				{
					"coursesMax": 94.88,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.88,
					"coursesSum": 94.88
				},
				{
					"coursesMax": 94.88,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.88,
					"coursesSum": 94.88
				},
				{
					"coursesMax": 94.87,
					"courses_dept": "phar",
					"courses_year": 1900,
					"coursesMin": 94.87,
					"coursesSum": 94.87
				},
				{
					"coursesMax": 94.87,
					"courses_dept": "educ",
					"courses_year": 2014,
					"coursesMin": 94.87,
					"coursesSum": 94.87
				},
				{
					"coursesMax": 94.86,
					"courses_dept": "epse",
					"courses_year": 2012,
					"coursesMin": 94.86,
					"coursesSum": 94.86
				},
				{
					"coursesMax": 94.86,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.86,
					"coursesSum": 94.86
				},
				{
					"coursesMax": 94.86,
					"courses_dept": "edcp",
					"courses_year": 2013,
					"coursesMin": 94.86,
					"coursesSum": 94.86
				},
				{
					"coursesMax": 94.86,
					"courses_dept": "edcp",
					"courses_year": 1900,
					"coursesMin": 94.86,
					"coursesSum": 94.86
				},
				{
					"coursesMax": 94.86,
					"courses_dept": "crwr",
					"courses_year": 2014,
					"coursesMin": 94.86,
					"coursesSum": 94.86
				},
				{
					"coursesMax": 94.85,
					"courses_dept": "epse",
					"courses_year": 2015,
					"coursesMin": 94.85,
					"coursesSum": 94.85
				},
				{
					"coursesMax": 94.84,
					"courses_dept": "epse",
					"courses_year": 2013,
					"coursesMin": 94.84,
					"coursesSum": 94.84
				},
				{
					"coursesMax": 94.84,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.84,
					"coursesSum": 94.84
				},
				{
					"coursesMax": 94.8,
					"courses_dept": "epse",
					"courses_year": 2010,
					"coursesMin": 94.8,
					"coursesSum": 94.8
				},
				{
					"coursesMax": 94.79,
					"courses_dept": "epse",
					"courses_year": 2012,
					"coursesMin": 94.79,
					"coursesSum": 94.79
				},
				{
					"coursesMax": 94.75,
					"courses_dept": "psyc",
					"courses_year": 2007,
					"coursesMin": 94.75,
					"coursesSum": 94.75
				},
				{
					"coursesMax": 94.75,
					"courses_dept": "psyc",
					"courses_year": 1900,
					"coursesMin": 94.75,
					"coursesSum": 94.75
				},
				{
					"coursesMax": 94.75,
					"courses_dept": "epse",
					"courses_year": 2014,
					"coursesMin": 94.75,
					"coursesSum": 94.75
				},
				{
					"coursesMax": 94.75,
					"courses_dept": "epse",
					"courses_year": 2010,
					"coursesMin": 94.75,
					"coursesSum": 94.75
				},
				{
					"coursesMax": 94.75,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.75,
					"coursesSum": 94.75
				},
				{
					"coursesMax": 94.75,
					"courses_dept": "educ",
					"courses_year": 2016,
					"coursesMin": 94.75,
					"coursesSum": 94.75
				},
				{
					"coursesMax": 94.75,
					"courses_dept": "comm",
					"courses_year": 2007,
					"coursesMin": 94.75,
					"coursesSum": 94.75
				},
				{
					"coursesMax": 94.75,
					"courses_dept": "comm",
					"courses_year": 1900,
					"coursesMin": 94.75,
					"coursesSum": 94.75
				},
				{
					"coursesMax": 94.75,
					"courses_dept": "chbe",
					"courses_year": 2015,
					"coursesMin": 94.75,
					"coursesSum": 94.75
				},
				{
					"coursesMax": 94.75,
					"courses_dept": "chbe",
					"courses_year": 1900,
					"coursesMin": 94.75,
					"coursesSum": 94.75
				},
				{
					"coursesMax": 94.72,
					"courses_dept": "epse",
					"courses_year": 2011,
					"coursesMin": 94.72,
					"coursesSum": 94.72
				},
				{
					"coursesMax": 94.71,
					"courses_dept": "eece",
					"courses_year": 2015,
					"coursesMin": 94.71,
					"coursesSum": 94.71
				},
				{
					"coursesMax": 94.71,
					"courses_dept": "eece",
					"courses_year": 1900,
					"coursesMin": 94.71,
					"coursesSum": 94.71
				},
				{
					"coursesMax": 94.7,
					"courses_dept": "stat",
					"courses_year": 2014,
					"coursesMin": 94.7,
					"coursesSum": 94.7
				},
				{
					"coursesMax": 94.7,
					"courses_dept": "stat",
					"courses_year": 1900,
					"coursesMin": 94.7,
					"coursesSum": 94.7
				},
				{
					"coursesMax": 94.7,
					"courses_dept": "phys",
					"courses_year": 2010,
					"coursesMin": 94.7,
					"coursesSum": 94.7
				},
				{
					"coursesMax": 94.7,
					"courses_dept": "phys",
					"courses_year": 1900,
					"coursesMin": 94.7,
					"coursesSum": 94.7
				},
				{
					"coursesMax": 94.7,
					"courses_dept": "medg",
					"courses_year": 2007,
					"coursesMin": 94.7,
					"coursesSum": 94.7
				},
				{
					"coursesMax": 94.7,
					"courses_dept": "medg",
					"courses_year": 1900,
					"coursesMin": 94.7,
					"coursesSum": 94.7
				},
				{
					"coursesMax": 94.69,
					"courses_dept": "epse",
					"courses_year": 2013,
					"coursesMin": 94.69,
					"coursesSum": 94.69
				},
				{
					"coursesMax": 94.69,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.69,
					"coursesSum": 94.69
				},
				{
					"coursesMax": 94.67,
					"courses_dept": "math",
					"courses_year": 2011,
					"coursesMin": 94.67,
					"coursesSum": 94.67
				},
				{
					"coursesMax": 94.67,
					"courses_dept": "math",
					"courses_year": 2010,
					"coursesMin": 94.67,
					"coursesSum": 94.67
				},
				{
					"coursesMax": 94.67,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 94.67,
					"coursesSum": 94.67
				},
				{
					"coursesMax": 94.67,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 94.67,
					"coursesSum": 94.67
				},
				{
					"coursesMax": 94.67,
					"courses_dept": "epse",
					"courses_year": 2015,
					"coursesMin": 94.67,
					"coursesSum": 94.67
				},
				{
					"coursesMax": 94.67,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.67,
					"coursesSum": 94.67
				},
				{
					"coursesMax": 94.67,
					"courses_dept": "crwr",
					"courses_year": 2013,
					"coursesMin": 94.67,
					"coursesSum": 94.67
				},
				{
					"coursesMax": 94.62,
					"courses_dept": "cnps",
					"courses_year": 1900,
					"coursesMin": 94.62,
					"coursesSum": 94.62
				},
				{
					"coursesMax": 94.58,
					"courses_dept": "plan",
					"courses_year": 2010,
					"coursesMin": 94.58,
					"coursesSum": 94.58
				},
				{
					"coursesMax": 94.58,
					"courses_dept": "plan",
					"courses_year": 1900,
					"coursesMin": 94.58,
					"coursesSum": 94.58
				},
				{
					"coursesMax": 94.56,
					"courses_dept": "sowk",
					"courses_year": 2009,
					"coursesMin": 94.56,
					"coursesSum": 94.56
				},
				{
					"coursesMax": 94.56,
					"courses_dept": "kin",
					"courses_year": 2012,
					"coursesMin": 94.56,
					"coursesSum": 94.56
				},
				{
					"coursesMax": 94.56,
					"courses_dept": "kin",
					"courses_year": 1900,
					"coursesMin": 94.56,
					"coursesSum": 94.56
				},
				{
					"coursesMax": 94.56,
					"courses_dept": "epse",
					"courses_year": 2011,
					"coursesMin": 94.56,
					"coursesSum": 94.56
				},
				{
					"coursesMax": 94.56,
					"courses_dept": "epse",
					"courses_year": 2007,
					"coursesMin": 94.56,
					"coursesSum": 94.56
				},
				{
					"coursesMax": 94.56,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.56,
					"coursesSum": 94.56
				},
				{
					"coursesMax": 94.56,
					"courses_dept": "comm",
					"courses_year": 2010,
					"coursesMin": 94.56,
					"coursesSum": 94.56
				},
				{
					"coursesMax": 94.56,
					"courses_dept": "comm",
					"courses_year": 1900,
					"coursesMin": 94.56,
					"coursesSum": 94.56
				},
				{
					"coursesMax": 94.56,
					"courses_dept": "cnps",
					"courses_year": 2014,
					"coursesMin": 94.56,
					"coursesSum": 94.56
				},
				{
					"coursesMax": 94.56,
					"courses_dept": "cnps",
					"courses_year": 1900,
					"coursesMin": 94.56,
					"coursesSum": 94.56
				},
				{
					"coursesMax": 94.54,
					"courses_dept": "phar",
					"courses_year": 2014,
					"coursesMin": 94.54,
					"coursesSum": 94.54
				},
				{
					"coursesMax": 94.5,
					"courses_dept": "spph",
					"courses_year": 2012,
					"coursesMin": 94.5,
					"coursesSum": 94.5
				},
				{
					"coursesMax": 94.5,
					"courses_dept": "phys",
					"courses_year": 2010,
					"coursesMin": 94.5,
					"coursesSum": 94.5
				},
				{
					"coursesMax": 94.5,
					"courses_dept": "phys",
					"courses_year": 1900,
					"coursesMin": 94.5,
					"coursesSum": 94.5
				},
				{
					"coursesMax": 94.5,
					"courses_dept": "musc",
					"courses_year": 2014,
					"coursesMin": 94.5,
					"coursesSum": 94.5
				},
				{
					"coursesMax": 94.5,
					"courses_dept": "musc",
					"courses_year": 1900,
					"coursesMin": 94.5,
					"coursesSum": 94.5
				},
				{
					"coursesMax": 94.5,
					"courses_dept": "mine",
					"courses_year": 2013,
					"coursesMin": 94.5,
					"coursesSum": 94.5
				},
				{
					"coursesMax": 94.5,
					"courses_dept": "kin",
					"courses_year": 2012,
					"coursesMin": 94.5,
					"coursesSum": 94.5
				},
				{
					"coursesMax": 94.5,
					"courses_dept": "hgse",
					"courses_year": 2013,
					"coursesMin": 94.5,
					"coursesSum": 94.5
				},
				{
					"coursesMax": 94.5,
					"courses_dept": "hgse",
					"courses_year": 1900,
					"coursesMin": 94.5,
					"coursesSum": 94.5
				},
				{
					"coursesMax": 94.5,
					"courses_dept": "epse",
					"courses_year": 2007,
					"coursesMin": 94.5,
					"coursesSum": 94.5
				},
				{
					"coursesMax": 94.5,
					"courses_dept": "epse",
					"courses_year": 2007,
					"coursesMin": 94.5,
					"coursesSum": 94.5
				},
				{
					"coursesMax": 94.5,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.5,
					"coursesSum": 94.5
				},
				{
					"coursesMax": 94.5,
					"courses_dept": "crwr",
					"courses_year": 2014,
					"coursesMin": 94.5,
					"coursesSum": 94.5
				},
				{
					"coursesMax": 94.5,
					"courses_dept": "crwr",
					"courses_year": 2013,
					"coursesMin": 94.5,
					"coursesSum": 94.5
				},
				{
					"coursesMax": 94.5,
					"courses_dept": "crwr",
					"courses_year": 1900,
					"coursesMin": 94.5,
					"coursesSum": 94.5
				},
				{
					"coursesMax": 94.5,
					"courses_dept": "cpsc",
					"courses_year": 2007,
					"coursesMin": 94.5,
					"coursesSum": 94.5
				},
				{
					"coursesMax": 94.5,
					"courses_dept": "cpsc",
					"courses_year": 1900,
					"coursesMin": 94.5,
					"coursesSum": 94.5
				},
				{
					"coursesMax": 94.5,
					"courses_dept": "comm",
					"courses_year": 2012,
					"coursesMin": 94.5,
					"coursesSum": 94.5
				},
				{
					"coursesMax": 94.5,
					"courses_dept": "comm",
					"courses_year": 1900,
					"coursesMin": 94.5,
					"coursesSum": 94.5
				},
				{
					"coursesMax": 94.48,
					"courses_dept": "epse",
					"courses_year": 2015,
					"coursesMin": 94.48,
					"coursesSum": 94.48
				},
				{
					"coursesMax": 94.47,
					"courses_dept": "nurs",
					"courses_year": 2011,
					"coursesMin": 94.47,
					"coursesSum": 94.47
				},
				{
					"coursesMax": 94.47,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 94.47,
					"coursesSum": 94.47
				},
				{
					"coursesMax": 94.47,
					"courses_dept": "epse",
					"courses_year": 2015,
					"coursesMin": 94.47,
					"coursesSum": 94.47
				},
				{
					"coursesMax": 94.47,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.47,
					"coursesSum": 94.47
				},
				{
					"coursesMax": 94.44,
					"courses_dept": "epse",
					"courses_year": 2011,
					"coursesMin": 94.44,
					"coursesSum": 94.44
				},
				{
					"coursesMax": 94.44,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.44,
					"coursesSum": 94.44
				},
				{
					"coursesMax": 94.44,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.44,
					"coursesSum": 94.44
				},
				{
					"coursesMax": 94.44,
					"courses_dept": "audi",
					"courses_year": 2008,
					"coursesMin": 94.44,
					"coursesSum": 94.44
				},
				{
					"coursesMax": 94.44,
					"courses_dept": "audi",
					"courses_year": 1900,
					"coursesMin": 94.44,
					"coursesSum": 94.44
				},
				{
					"coursesMax": 94.44,
					"courses_dept": "aanb",
					"courses_year": 2015,
					"coursesMin": 94.44,
					"coursesSum": 94.44
				},
				{
					"coursesMax": 94.44,
					"courses_dept": "aanb",
					"courses_year": 1900,
					"coursesMin": 94.44,
					"coursesSum": 94.44
				},
				{
					"coursesMax": 94.42,
					"courses_dept": "kin",
					"courses_year": 2012,
					"coursesMin": 94.42,
					"coursesSum": 94.42
				},
				{
					"coursesMax": 94.42,
					"courses_dept": "kin",
					"courses_year": 1900,
					"coursesMin": 94.42,
					"coursesSum": 94.42
				},
				{
					"coursesMax": 94.42,
					"courses_dept": "etec",
					"courses_year": 2012,
					"coursesMin": 94.42,
					"coursesSum": 94.42
				},
				{
					"coursesMax": 94.4,
					"courses_dept": "epse",
					"courses_year": 2013,
					"coursesMin": 94.4,
					"coursesSum": 94.4
				},
				{
					"coursesMax": 94.4,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.4,
					"coursesSum": 94.4
				},
				{
					"coursesMax": 94.4,
					"courses_dept": "cell",
					"courses_year": 2010,
					"coursesMin": 94.4,
					"coursesSum": 94.4
				},
				{
					"coursesMax": 94.4,
					"courses_dept": "cell",
					"courses_year": 1900,
					"coursesMin": 94.4,
					"coursesSum": 94.4
				},
				{
					"coursesMax": 94.38,
					"courses_dept": "spph",
					"courses_year": 2011,
					"coursesMin": 94.38,
					"coursesSum": 94.38
				},
				{
					"coursesMax": 94.36,
					"courses_dept": "spph",
					"courses_year": 2015,
					"coursesMin": 94.36,
					"coursesSum": 94.36
				},
				{
					"coursesMax": 94.36,
					"courses_dept": "spph",
					"courses_year": 1900,
					"coursesMin": 94.36,
					"coursesSum": 94.36
				},
				{
					"coursesMax": 94.34,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.34,
					"coursesSum": 94.34
				},
				{
					"coursesMax": 94.33,
					"courses_dept": "sowk",
					"courses_year": 2010,
					"coursesMin": 94.33,
					"coursesSum": 94.33
				},
				{
					"coursesMax": 94.33,
					"courses_dept": "math",
					"courses_year": 2015,
					"coursesMin": 94.33,
					"coursesSum": 94.33
				},
				{
					"coursesMax": 94.33,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 94.33,
					"coursesSum": 94.33
				},
				{
					"coursesMax": 94.33,
					"courses_dept": "epse",
					"courses_year": 2012,
					"coursesMin": 94.33,
					"coursesSum": 94.33
				},
				{
					"coursesMax": 94.33,
					"courses_dept": "epse",
					"courses_year": 2010,
					"coursesMin": 94.33,
					"coursesSum": 94.33
				},
				{
					"coursesMax": 94.33,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.33,
					"coursesSum": 94.33
				},
				{
					"coursesMax": 94.33,
					"courses_dept": "dent",
					"courses_year": 2012,
					"coursesMin": 94.33,
					"coursesSum": 94.33
				},
				{
					"coursesMax": 94.33,
					"courses_dept": "dent",
					"courses_year": 1900,
					"coursesMin": 94.33,
					"coursesSum": 94.33
				},
				{
					"coursesMax": 94.33,
					"courses_dept": "crwr",
					"courses_year": 2013,
					"coursesMin": 94.33,
					"coursesSum": 94.33
				},
				{
					"coursesMax": 94.33,
					"courses_dept": "biol",
					"courses_year": 2015,
					"coursesMin": 94.33,
					"coursesSum": 94.33
				},
				{
					"coursesMax": 94.33,
					"courses_dept": "biol",
					"courses_year": 1900,
					"coursesMin": 94.33,
					"coursesSum": 94.33
				},
				{
					"coursesMax": 94.32,
					"courses_dept": "phth",
					"courses_year": 2014,
					"coursesMin": 94.32,
					"coursesSum": 94.32
				},
				{
					"coursesMax": 94.32,
					"courses_dept": "phth",
					"courses_year": 1900,
					"coursesMin": 94.32,
					"coursesSum": 94.32
				},
				{
					"coursesMax": 94.29,
					"courses_dept": "nurs",
					"courses_year": 2015,
					"coursesMin": 94.29,
					"coursesSum": 94.29
				},
				{
					"coursesMax": 94.29,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 94.29,
					"coursesSum": 94.29
				},
				{
					"coursesMax": 94.29,
					"courses_dept": "kin",
					"courses_year": 2015,
					"coursesMin": 94.29,
					"coursesSum": 94.29
				},
				{
					"coursesMax": 94.29,
					"courses_dept": "kin",
					"courses_year": 1900,
					"coursesMin": 94.29,
					"coursesSum": 94.29
				},
				{
					"coursesMax": 94.29,
					"courses_dept": "etec",
					"courses_year": 2011,
					"coursesMin": 94.29,
					"coursesSum": 94.29
				},
				{
					"coursesMax": 94.29,
					"courses_dept": "epse",
					"courses_year": 2016,
					"coursesMin": 94.29,
					"coursesSum": 94.29
				},
				{
					"coursesMax": 94.27,
					"courses_dept": "kin",
					"courses_year": 1900,
					"coursesMin": 94.27,
					"coursesSum": 94.27
				},
				{
					"coursesMax": 94.27,
					"courses_dept": "epse",
					"courses_year": 2009,
					"coursesMin": 94.27,
					"coursesSum": 94.27
				},
				{
					"coursesMax": 94.27,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.27,
					"coursesSum": 94.27
				},
				{
					"coursesMax": 94.27,
					"courses_dept": "ceen",
					"courses_year": 2013,
					"coursesMin": 94.27,
					"coursesSum": 94.27
				},
				{
					"coursesMax": 94.26,
					"courses_dept": "cnps",
					"courses_year": 2012,
					"coursesMin": 94.26,
					"coursesSum": 94.26
				},
				{
					"coursesMax": 94.26,
					"courses_dept": "cnps",
					"courses_year": 1900,
					"coursesMin": 94.26,
					"coursesSum": 94.26
				},
				{
					"coursesMax": 94.25,
					"courses_dept": "surg",
					"courses_year": 2011,
					"coursesMin": 94.25,
					"coursesSum": 94.25
				},
				{
					"coursesMax": 94.25,
					"courses_dept": "surg",
					"courses_year": 1900,
					"coursesMin": 94.25,
					"coursesSum": 94.25
				},
				{
					"coursesMax": 94.25,
					"courses_dept": "musc",
					"courses_year": 2009,
					"coursesMin": 94.25,
					"coursesSum": 94.25
				},
				{
					"coursesMax": 94.25,
					"courses_dept": "epse",
					"courses_year": 2013,
					"coursesMin": 94.25,
					"coursesSum": 94.25
				},
				{
					"coursesMax": 94.25,
					"courses_dept": "epse",
					"courses_year": 2013,
					"coursesMin": 94.25,
					"coursesSum": 94.25
				},
				{
					"coursesMax": 94.25,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.25,
					"coursesSum": 94.25
				},
				{
					"coursesMax": 94.25,
					"courses_dept": "edst",
					"courses_year": 2011,
					"coursesMin": 94.25,
					"coursesSum": 94.25
				},
				{
					"coursesMax": 94.25,
					"courses_dept": "edst",
					"courses_year": 1900,
					"coursesMin": 94.25,
					"coursesSum": 94.25
				},
				{
					"coursesMax": 94.24,
					"courses_dept": "epse",
					"courses_year": 2015,
					"coursesMin": 94.24,
					"coursesSum": 94.24
				},
				{
					"coursesMax": 94.24,
					"courses_dept": "epse",
					"courses_year": 2015,
					"coursesMin": 94.24,
					"coursesSum": 94.24
				},
				{
					"coursesMax": 94.24,
					"courses_dept": "epse",
					"courses_year": 2014,
					"coursesMin": 94.24,
					"coursesSum": 94.24
				},
				{
					"coursesMax": 94.23,
					"courses_dept": "phrm",
					"courses_year": 2015,
					"coursesMin": 94.23,
					"coursesSum": 94.23
				},
				{
					"coursesMax": 94.23,
					"courses_dept": "phrm",
					"courses_year": 1900,
					"coursesMin": 94.23,
					"coursesSum": 94.23
				},
				{
					"coursesMax": 94.23,
					"courses_dept": "epse",
					"courses_year": 2012,
					"coursesMin": 94.23,
					"coursesSum": 94.23
				},
				{
					"coursesMax": 94.23,
					"courses_dept": "cnps",
					"courses_year": 1900,
					"coursesMin": 94.23,
					"coursesSum": 94.23
				},
				{
					"coursesMax": 94.21,
					"courses_dept": "nurs",
					"courses_year": 2011,
					"coursesMin": 94.21,
					"coursesSum": 94.21
				},
				{
					"coursesMax": 94.21,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 94.21,
					"coursesSum": 94.21
				},
				{
					"coursesMax": 94.2,
					"courses_dept": "psyc",
					"courses_year": 2008,
					"coursesMin": 94.2,
					"coursesSum": 94.2
				},
				{
					"coursesMax": 94.2,
					"courses_dept": "psyc",
					"courses_year": 1900,
					"coursesMin": 94.2,
					"coursesSum": 94.2
				},
				{
					"coursesMax": 94.2,
					"courses_dept": "epse",
					"courses_year": 2010,
					"coursesMin": 94.2,
					"coursesSum": 94.2
				},
				{
					"coursesMax": 94.2,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.2,
					"coursesSum": 94.2
				},
				{
					"coursesMax": 94.2,
					"courses_dept": "crwr",
					"courses_year": 1900,
					"coursesMin": 94.2,
					"coursesSum": 94.2
				},
				{
					"coursesMax": 94.2,
					"courses_dept": "cnps",
					"courses_year": 2014,
					"coursesMin": 94.2,
					"coursesSum": 94.2
				},
				{
					"coursesMax": 94.2,
					"courses_dept": "cnps",
					"courses_year": 1900,
					"coursesMin": 94.2,
					"coursesSum": 94.2
				},
				{
					"coursesMax": 94.19,
					"courses_dept": "nurs",
					"courses_year": 2013,
					"coursesMin": 94.19,
					"coursesSum": 94.19
				},
				{
					"coursesMax": 94.19,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 94.19,
					"coursesSum": 94.19
				},
				{
					"coursesMax": 94.18,
					"courses_dept": "epse",
					"courses_year": 2015,
					"coursesMin": 94.18,
					"coursesSum": 94.18
				},
				{
					"coursesMax": 94.18,
					"courses_dept": "cnps",
					"courses_year": 2013,
					"coursesMin": 94.18,
					"coursesSum": 94.18
				},
				{
					"coursesMax": 94.17,
					"courses_dept": "micb",
					"courses_year": 2015,
					"coursesMin": 94.17,
					"coursesSum": 94.17
				},
				{
					"coursesMax": 94.17,
					"courses_dept": "micb",
					"courses_year": 1900,
					"coursesMin": 94.17,
					"coursesSum": 94.17
				},
				{
					"coursesMax": 94.17,
					"courses_dept": "math",
					"courses_year": 2013,
					"coursesMin": 94.17,
					"coursesSum": 94.17
				},
				{
					"coursesMax": 94.17,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 94.17,
					"coursesSum": 94.17
				},
				{
					"coursesMax": 94.17,
					"courses_dept": "edcp",
					"courses_year": 2011,
					"coursesMin": 94.17,
					"coursesSum": 94.17
				},
				{
					"coursesMax": 94.17,
					"courses_dept": "edcp",
					"courses_year": 1900,
					"coursesMin": 94.17,
					"coursesSum": 94.17
				},
				{
					"coursesMax": 94.17,
					"courses_dept": "apsc",
					"courses_year": 2007,
					"coursesMin": 94.17,
					"coursesSum": 94.17
				},
				{
					"coursesMax": 94.16,
					"courses_dept": "cnps",
					"courses_year": 1900,
					"coursesMin": 94.16,
					"coursesSum": 94.16
				},
				{
					"coursesMax": 94.15,
					"courses_dept": "nurs",
					"courses_year": 2014,
					"coursesMin": 94.15,
					"coursesSum": 94.15
				},
				{
					"coursesMax": 94.15,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 94.15,
					"coursesSum": 94.15
				},
				{
					"coursesMax": 94.15,
					"courses_dept": "midw",
					"courses_year": 2013,
					"coursesMin": 94.15,
					"coursesSum": 94.15
				},
				{
					"coursesMax": 94.15,
					"courses_dept": "midw",
					"courses_year": 1900,
					"coursesMin": 94.15,
					"coursesSum": 94.15
				},
				{
					"coursesMax": 94.14,
					"courses_dept": "epse",
					"courses_year": 2015,
					"coursesMin": 94.14,
					"coursesSum": 94.14
				},
				{
					"coursesMax": 94.14,
					"courses_dept": "epse",
					"courses_year": 2013,
					"coursesMin": 94.14,
					"coursesSum": 94.14
				},
				{
					"coursesMax": 94.14,
					"courses_dept": "epse",
					"courses_year": 2007,
					"coursesMin": 94.14,
					"coursesSum": 94.14
				},
				{
					"coursesMax": 94.14,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.14,
					"coursesSum": 94.14
				},
				{
					"coursesMax": 94.13,
					"courses_dept": "etec",
					"courses_year": 1900,
					"coursesMin": 94.13,
					"coursesSum": 94.13
				},
				{
					"coursesMax": 94.13,
					"courses_dept": "epse",
					"courses_year": 2015,
					"coursesMin": 94.13,
					"coursesSum": 94.13
				},
				{
					"coursesMax": 94.13,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.13,
					"coursesSum": 94.13
				},
				{
					"coursesMax": 94.12,
					"courses_dept": "etec",
					"courses_year": 2014,
					"coursesMin": 94.12,
					"coursesSum": 94.12
				},
				{
					"coursesMax": 94.12,
					"courses_dept": "epse",
					"courses_year": 2014,
					"coursesMin": 94.12,
					"coursesSum": 94.12
				},
				{
					"coursesMax": 94.12,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.12,
					"coursesSum": 94.12
				},
				{
					"coursesMax": 94.11,
					"courses_dept": "epse",
					"courses_year": 2013,
					"coursesMin": 94.11,
					"coursesSum": 94.11
				},
				{
					"coursesMax": 94.11,
					"courses_dept": "crwr",
					"courses_year": 1900,
					"coursesMin": 94.11,
					"coursesSum": 94.11
				},
				{
					"coursesMax": 94.1,
					"courses_dept": "spph",
					"courses_year": 2014,
					"coursesMin": 94.1,
					"coursesSum": 94.1
				},
				{
					"coursesMax": 94.1,
					"courses_dept": "spph",
					"courses_year": 1900,
					"coursesMin": 94.1,
					"coursesSum": 94.1
				},
				{
					"coursesMax": 94.1,
					"courses_dept": "epse",
					"courses_year": 2011,
					"coursesMin": 94.1,
					"coursesSum": 94.1
				},
				{
					"coursesMax": 94.1,
					"courses_dept": "epse",
					"courses_year": 2010,
					"coursesMin": 94.1,
					"coursesSum": 94.1
				},
				{
					"coursesMax": 94.1,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.1,
					"coursesSum": 94.1
				},
				{
					"coursesMax": 94.1,
					"courses_dept": "apsc",
					"courses_year": 2009,
					"coursesMin": 94.1,
					"coursesSum": 94.1
				},
				{
					"coursesMax": 94.09,
					"courses_dept": "spph",
					"courses_year": 2012,
					"coursesMin": 94.09,
					"coursesSum": 94.09
				},
				{
					"coursesMax": 94.08,
					"courses_dept": "midw",
					"courses_year": 2011,
					"coursesMin": 94.08,
					"coursesSum": 94.08
				},
				{
					"coursesMax": 94.08,
					"courses_dept": "midw",
					"courses_year": 1900,
					"coursesMin": 94.08,
					"coursesSum": 94.08
				},
				{
					"coursesMax": 94.08,
					"courses_dept": "epse",
					"courses_year": 2015,
					"coursesMin": 94.08,
					"coursesSum": 94.08
				},
				{
					"coursesMax": 94.08,
					"courses_dept": "epse",
					"courses_year": 2014,
					"coursesMin": 94.08,
					"coursesSum": 94.08
				},
				{
					"coursesMax": 94.08,
					"courses_dept": "epse",
					"courses_year": 2012,
					"coursesMin": 94.08,
					"coursesSum": 94.08
				},
				{
					"coursesMax": 94.08,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.08,
					"coursesSum": 94.08
				},
				{
					"coursesMax": 94.08,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 94.08,
					"coursesSum": 94.08
				},
				{
					"coursesMax": 94.08,
					"courses_dept": "crwr",
					"courses_year": 2013,
					"coursesMin": 94.08,
					"coursesSum": 94.08
				},
				{
					"coursesMax": 94.08,
					"courses_dept": "crwr",
					"courses_year": 1900,
					"coursesMin": 94.08,
					"coursesSum": 94.08
				},
				{
					"coursesMax": 94.07,
					"courses_dept": "mine",
					"courses_year": 1900,
					"coursesMin": 94.07,
					"coursesSum": 94.07
				},
				{
					"coursesMax": 94.07,
					"courses_dept": "crwr",
					"courses_year": 1900,
					"coursesMin": 94.07,
					"coursesSum": 94.07
				},
				{
					"coursesMax": 94.06,
					"courses_dept": "epse",
					"courses_year": 2012,
					"coursesMin": 94.06,
					"coursesSum": 94.06
				},
				{
					"coursesMax": 94.06,
					"courses_dept": "edst",
					"courses_year": 2015,
					"coursesMin": 94.06,
					"coursesSum": 94.06
				},
				{
					"coursesMax": 94.06,
					"courses_dept": "edst",
					"courses_year": 1900,
					"coursesMin": 94.06,
					"coursesSum": 94.06
				},
				{
					"coursesMax": 94.05,
					"courses_dept": "etec",
					"courses_year": 2013,
					"coursesMin": 94.05,
					"coursesSum": 94.05
				},
				{
					"coursesMax": 94.05,
					"courses_dept": "epse",
					"courses_year": 2011,
					"coursesMin": 94.05,
					"coursesSum": 94.05
				},
				{
					"coursesMax": 94.05,
					"courses_dept": "cnps",
					"courses_year": 2015,
					"coursesMin": 94.05,
					"coursesSum": 94.05
				},
				{
					"coursesMax": 94,
					"courses_dept": "rhsc",
					"courses_year": 2008,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "nurs",
					"courses_year": 2015,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "nurs",
					"courses_year": 2010,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "nurs",
					"courses_year": 2007,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "musc",
					"courses_year": 2010,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "musc",
					"courses_year": 1900,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "fish",
					"courses_year": 2009,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "fish",
					"courses_year": 1900,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "etec",
					"courses_year": 2015,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "etec",
					"courses_year": 2014,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "etec",
					"courses_year": 1900,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "epse",
					"courses_year": 2009,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "educ",
					"courses_year": 2012,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "edst",
					"courses_year": 2014,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "crwr",
					"courses_year": 2015,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "crwr",
					"courses_year": 2014,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "crwr",
					"courses_year": 2012,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "cpsc",
					"courses_year": 2007,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "cpsc",
					"courses_year": 1900,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "cnps",
					"courses_year": 2011,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "cnps",
					"courses_year": 2011,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "cnps",
					"courses_year": 1900,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "audi",
					"courses_year": 2013,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "audi",
					"courses_year": 2013,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "audi",
					"courses_year": 1900,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "audi",
					"courses_year": 1900,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "arst",
					"courses_year": 2012,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 94,
					"courses_dept": "arst",
					"courses_year": 1900,
					"coursesMin": 94,
					"coursesSum": 94
				},
				{
					"coursesMax": 93.97,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.97,
					"coursesSum": 93.97
				},
				{
					"coursesMax": 93.95,
					"courses_dept": "etec",
					"courses_year": 2015,
					"coursesMin": 93.95,
					"coursesSum": 93.95
				},
				{
					"coursesMax": 93.95,
					"courses_dept": "etec",
					"courses_year": 1900,
					"coursesMin": 93.95,
					"coursesSum": 93.95
				},
				{
					"coursesMax": 93.95,
					"courses_dept": "epse",
					"courses_year": 2011,
					"coursesMin": 93.95,
					"coursesSum": 93.95
				},
				{
					"coursesMax": 93.94,
					"courses_dept": "spph",
					"courses_year": 2013,
					"coursesMin": 93.94,
					"coursesSum": 93.94
				},
				{
					"coursesMax": 93.94,
					"courses_dept": "plan",
					"courses_year": 2008,
					"coursesMin": 93.94,
					"coursesSum": 93.94
				},
				{
					"coursesMax": 93.94,
					"courses_dept": "plan",
					"courses_year": 1900,
					"coursesMin": 93.94,
					"coursesSum": 93.94
				},
				{
					"coursesMax": 93.94,
					"courses_dept": "epse",
					"courses_year": 2011,
					"coursesMin": 93.94,
					"coursesSum": 93.94
				},
				{
					"coursesMax": 93.93,
					"courses_dept": "elec",
					"courses_year": 2015,
					"coursesMin": 93.93,
					"coursesSum": 93.93
				},
				{
					"coursesMax": 93.92,
					"courses_dept": "spph",
					"courses_year": 2011,
					"coursesMin": 93.92,
					"coursesSum": 93.92
				},
				{
					"coursesMax": 93.91,
					"courses_dept": "epse",
					"courses_year": 2015,
					"coursesMin": 93.91,
					"coursesSum": 93.91
				},
				{
					"coursesMax": 93.91,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.91,
					"coursesSum": 93.91
				},
				{
					"coursesMax": 93.91,
					"courses_dept": "elec",
					"courses_year": 1900,
					"coursesMin": 93.91,
					"coursesSum": 93.91
				},
				{
					"coursesMax": 93.91,
					"courses_dept": "audi",
					"courses_year": 2007,
					"coursesMin": 93.91,
					"coursesSum": 93.91
				},
				{
					"coursesMax": 93.91,
					"courses_dept": "audi",
					"courses_year": 1900,
					"coursesMin": 93.91,
					"coursesSum": 93.91
				},
				{
					"coursesMax": 93.9,
					"courses_dept": "epse",
					"courses_year": 2016,
					"coursesMin": 93.9,
					"coursesSum": 93.9
				},
				{
					"coursesMax": 93.9,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.9,
					"coursesSum": 93.9
				},
				{
					"coursesMax": 93.89,
					"courses_dept": "spph",
					"courses_year": 2015,
					"coursesMin": 93.89,
					"coursesSum": 93.89
				},
				{
					"coursesMax": 93.89,
					"courses_dept": "etec",
					"courses_year": 2011,
					"coursesMin": 93.89,
					"coursesSum": 93.89
				},
				{
					"coursesMax": 93.89,
					"courses_dept": "etec",
					"courses_year": 1900,
					"coursesMin": 93.89,
					"coursesSum": 93.89
				},
				{
					"coursesMax": 93.89,
					"courses_dept": "audi",
					"courses_year": 1900,
					"coursesMin": 93.89,
					"coursesSum": 93.89
				},
				{
					"coursesMax": 93.88,
					"courses_dept": "epse",
					"courses_year": 2012,
					"coursesMin": 93.88,
					"coursesSum": 93.88
				},
				{
					"coursesMax": 93.88,
					"courses_dept": "epse",
					"courses_year": 2009,
					"coursesMin": 93.88,
					"coursesSum": 93.88
				},
				{
					"coursesMax": 93.88,
					"courses_dept": "elec",
					"courses_year": 2015,
					"coursesMin": 93.88,
					"coursesSum": 93.88
				},
				{
					"coursesMax": 93.87,
					"courses_dept": "epse",
					"courses_year": 2014,
					"coursesMin": 93.87,
					"coursesSum": 93.87
				},
				{
					"coursesMax": 93.87,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.87,
					"coursesSum": 93.87
				},
				{
					"coursesMax": 93.86,
					"courses_dept": "nurs",
					"courses_year": 2011,
					"coursesMin": 93.86,
					"coursesSum": 93.86
				},
				{
					"coursesMax": 93.86,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 93.86,
					"coursesSum": 93.86
				},
				{
					"coursesMax": 93.86,
					"courses_dept": "epse",
					"courses_year": 2013,
					"coursesMin": 93.86,
					"coursesSum": 93.86
				},
				{
					"coursesMax": 93.86,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.86,
					"coursesSum": 93.86
				},
				{
					"coursesMax": 93.85,
					"courses_dept": "epse",
					"courses_year": 2012,
					"coursesMin": 93.85,
					"coursesSum": 93.85
				},
				{
					"coursesMax": 93.85,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.85,
					"coursesSum": 93.85
				},
				{
					"coursesMax": 93.85,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.85,
					"coursesSum": 93.85
				},
				{
					"coursesMax": 93.83,
					"courses_dept": "epse",
					"courses_year": 2011,
					"coursesMin": 93.83,
					"coursesSum": 93.83
				},
				{
					"coursesMax": 93.82,
					"courses_dept": "sowk",
					"courses_year": 2013,
					"coursesMin": 93.82,
					"coursesSum": 93.82
				},
				{
					"coursesMax": 93.82,
					"courses_dept": "epse",
					"courses_year": 2009,
					"coursesMin": 93.82,
					"coursesSum": 93.82
				},
				{
					"coursesMax": 93.81,
					"courses_dept": "epse",
					"courses_year": 2014,
					"coursesMin": 93.81,
					"coursesSum": 93.81
				},
				{
					"coursesMax": 93.81,
					"courses_dept": "epse",
					"courses_year": 2008,
					"coursesMin": 93.81,
					"coursesSum": 93.81
				},
				{
					"coursesMax": 93.81,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.81,
					"coursesSum": 93.81
				},
				{
					"coursesMax": 93.81,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.81,
					"coursesSum": 93.81
				},
				{
					"coursesMax": 93.8,
					"courses_dept": "math",
					"courses_year": 2010,
					"coursesMin": 93.8,
					"coursesSum": 93.8
				},
				{
					"coursesMax": 93.8,
					"courses_dept": "math",
					"courses_year": 2007,
					"coursesMin": 93.8,
					"coursesSum": 93.8
				},
				{
					"coursesMax": 93.8,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 93.8,
					"coursesSum": 93.8
				},
				{
					"coursesMax": 93.8,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 93.8,
					"coursesSum": 93.8
				},
				{
					"coursesMax": 93.8,
					"courses_dept": "eece",
					"courses_year": 2013,
					"coursesMin": 93.8,
					"coursesSum": 93.8
				},
				{
					"coursesMax": 93.8,
					"courses_dept": "eece",
					"courses_year": 1900,
					"coursesMin": 93.8,
					"coursesSum": 93.8
				},
				{
					"coursesMax": 93.8,
					"courses_dept": "cell",
					"courses_year": 2011,
					"coursesMin": 93.8,
					"coursesSum": 93.8
				},
				{
					"coursesMax": 93.8,
					"courses_dept": "cell",
					"courses_year": 1900,
					"coursesMin": 93.8,
					"coursesSum": 93.8
				},
				{
					"coursesMax": 93.79,
					"courses_dept": "epse",
					"courses_year": 2012,
					"coursesMin": 93.79,
					"coursesSum": 93.79
				},
				{
					"coursesMax": 93.79,
					"courses_dept": "audi",
					"courses_year": 2010,
					"coursesMin": 93.79,
					"coursesSum": 93.79
				},
				{
					"coursesMax": 93.79,
					"courses_dept": "audi",
					"courses_year": 1900,
					"coursesMin": 93.79,
					"coursesSum": 93.79
				},
				{
					"coursesMax": 93.78,
					"courses_dept": "math",
					"courses_year": 2012,
					"coursesMin": 93.78,
					"coursesSum": 93.78
				},
				{
					"coursesMax": 93.78,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 93.78,
					"coursesSum": 93.78
				},
				{
					"coursesMax": 93.78,
					"courses_dept": "epse",
					"courses_year": 2012,
					"coursesMin": 93.78,
					"coursesSum": 93.78
				},
				{
					"coursesMax": 93.78,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.78,
					"coursesSum": 93.78
				},
				{
					"coursesMax": 93.78,
					"courses_dept": "educ",
					"courses_year": 2011,
					"coursesMin": 93.78,
					"coursesSum": 93.78
				},
				{
					"coursesMax": 93.78,
					"courses_dept": "edst",
					"courses_year": 2007,
					"coursesMin": 93.78,
					"coursesSum": 93.78
				},
				{
					"coursesMax": 93.78,
					"courses_dept": "edst",
					"courses_year": 1900,
					"coursesMin": 93.78,
					"coursesSum": 93.78
				},
				{
					"coursesMax": 93.75,
					"courses_dept": "psyc",
					"courses_year": 2014,
					"coursesMin": 93.75,
					"coursesSum": 93.75
				},
				{
					"coursesMax": 93.75,
					"courses_dept": "psyc",
					"courses_year": 1900,
					"coursesMin": 93.75,
					"coursesSum": 93.75
				},
				{
					"coursesMax": 93.75,
					"courses_dept": "musc",
					"courses_year": 2009,
					"coursesMin": 93.75,
					"coursesSum": 93.75
				},
				{
					"coursesMax": 93.75,
					"courses_dept": "musc",
					"courses_year": 1900,
					"coursesMin": 93.75,
					"coursesSum": 93.75
				},
				{
					"coursesMax": 93.75,
					"courses_dept": "midw",
					"courses_year": 2015,
					"coursesMin": 93.75,
					"coursesSum": 93.75
				},
				{
					"coursesMax": 93.75,
					"courses_dept": "midw",
					"courses_year": 1900,
					"coursesMin": 93.75,
					"coursesSum": 93.75
				},
				{
					"coursesMax": 93.75,
					"courses_dept": "math",
					"courses_year": 2012,
					"coursesMin": 93.75,
					"coursesSum": 93.75
				},
				{
					"coursesMax": 93.75,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 93.75,
					"coursesSum": 93.75
				},
				{
					"coursesMax": 93.75,
					"courses_dept": "epse",
					"courses_year": 2009,
					"coursesMin": 93.75,
					"coursesSum": 93.75
				},
				{
					"coursesMax": 93.75,
					"courses_dept": "audi",
					"courses_year": 2014,
					"coursesMin": 93.75,
					"coursesSum": 93.75
				},
				{
					"coursesMax": 93.75,
					"courses_dept": "audi",
					"courses_year": 2009,
					"coursesMin": 93.75,
					"coursesSum": 93.75
				},
				{
					"coursesMax": 93.75,
					"courses_dept": "audi",
					"courses_year": 2009,
					"coursesMin": 93.75,
					"coursesSum": 93.75
				},
				{
					"coursesMax": 93.75,
					"courses_dept": "audi",
					"courses_year": 1900,
					"coursesMin": 93.75,
					"coursesSum": 93.75
				},
				{
					"coursesMax": 93.75,
					"courses_dept": "audi",
					"courses_year": 1900,
					"coursesMin": 93.75,
					"coursesSum": 93.75
				},
				{
					"coursesMax": 93.74,
					"courses_dept": "epse",
					"courses_year": 2012,
					"coursesMin": 93.74,
					"coursesSum": 93.74
				},
				{
					"coursesMax": 93.73,
					"courses_dept": "spph",
					"courses_year": 2015,
					"coursesMin": 93.73,
					"coursesSum": 93.73
				},
				{
					"coursesMax": 93.73,
					"courses_dept": "spph",
					"courses_year": 1900,
					"coursesMin": 93.73,
					"coursesSum": 93.73
				},
				{
					"coursesMax": 93.73,
					"courses_dept": "epse",
					"courses_year": 2013,
					"coursesMin": 93.73,
					"coursesSum": 93.73
				},
				{
					"coursesMax": 93.73,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.73,
					"coursesSum": 93.73
				},
				{
					"coursesMax": 93.72,
					"courses_dept": "epse",
					"courses_year": 2011,
					"coursesMin": 93.72,
					"coursesSum": 93.72
				},
				{
					"coursesMax": 93.72,
					"courses_dept": "eced",
					"courses_year": 2014,
					"coursesMin": 93.72,
					"coursesSum": 93.72
				},
				{
					"coursesMax": 93.72,
					"courses_dept": "eced",
					"courses_year": 1900,
					"coursesMin": 93.72,
					"coursesSum": 93.72
				},
				{
					"coursesMax": 93.72,
					"courses_dept": "dhyg",
					"courses_year": 2012,
					"coursesMin": 93.72,
					"coursesSum": 93.72
				},
				{
					"coursesMax": 93.71,
					"courses_dept": "epse",
					"courses_year": 2014,
					"coursesMin": 93.71,
					"coursesSum": 93.71
				},
				{
					"coursesMax": 93.71,
					"courses_dept": "epse",
					"courses_year": 2012,
					"coursesMin": 93.71,
					"coursesSum": 93.71
				},
				{
					"coursesMax": 93.71,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.71,
					"coursesSum": 93.71
				},
				{
					"coursesMax": 93.71,
					"courses_dept": "eced",
					"courses_year": 2012,
					"coursesMin": 93.71,
					"coursesSum": 93.71
				},
				{
					"coursesMax": 93.7,
					"courses_dept": "educ",
					"courses_year": 2013,
					"coursesMin": 93.7,
					"coursesSum": 93.7
				},
				{
					"coursesMax": 93.7,
					"courses_dept": "cnps",
					"courses_year": 2012,
					"coursesMin": 93.7,
					"coursesSum": 93.7
				},
				{
					"coursesMax": 93.7,
					"courses_dept": "cnps",
					"courses_year": 1900,
					"coursesMin": 93.7,
					"coursesSum": 93.7
				},
				{
					"coursesMax": 93.69,
					"courses_dept": "epse",
					"courses_year": 2014,
					"coursesMin": 93.69,
					"coursesSum": 93.69
				},
				{
					"coursesMax": 93.69,
					"courses_dept": "epse",
					"courses_year": 2014,
					"coursesMin": 93.69,
					"coursesSum": 93.69
				},
				{
					"coursesMax": 93.68,
					"courses_dept": "epse",
					"courses_year": 2014,
					"coursesMin": 93.68,
					"coursesSum": 93.68
				},
				{
					"coursesMax": 93.67,
					"courses_dept": "epse",
					"courses_year": 2010,
					"coursesMin": 93.67,
					"coursesSum": 93.67
				},
				{
					"coursesMax": 93.67,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.67,
					"coursesSum": 93.67
				},
				{
					"coursesMax": 93.67,
					"courses_dept": "crwr",
					"courses_year": 2014,
					"coursesMin": 93.67,
					"coursesSum": 93.67
				},
				{
					"coursesMax": 93.67,
					"courses_dept": "cnps",
					"courses_year": 2014,
					"coursesMin": 93.67,
					"coursesSum": 93.67
				},
				{
					"coursesMax": 93.67,
					"courses_dept": "cnps",
					"courses_year": 1900,
					"coursesMin": 93.67,
					"coursesSum": 93.67
				},
				{
					"coursesMax": 93.67,
					"courses_dept": "ccst",
					"courses_year": 2010,
					"coursesMin": 93.67,
					"coursesSum": 93.67
				},
				{
					"coursesMax": 93.67,
					"courses_dept": "ccst",
					"courses_year": 1900,
					"coursesMin": 93.67,
					"coursesSum": 93.67
				},
				{
					"coursesMax": 93.66,
					"courses_dept": "crwr",
					"courses_year": 1900,
					"coursesMin": 93.66,
					"coursesSum": 93.66
				},
				{
					"coursesMax": 93.65,
					"courses_dept": "epse",
					"courses_year": 2016,
					"coursesMin": 93.65,
					"coursesSum": 93.65
				},
				{
					"coursesMax": 93.64,
					"courses_dept": "etec",
					"courses_year": 2011,
					"coursesMin": 93.64,
					"coursesSum": 93.64
				},
				{
					"coursesMax": 93.64,
					"courses_dept": "etec",
					"courses_year": 1900,
					"coursesMin": 93.64,
					"coursesSum": 93.64
				},
				{
					"coursesMax": 93.64,
					"courses_dept": "epse",
					"courses_year": 2014,
					"coursesMin": 93.64,
					"coursesSum": 93.64
				},
				{
					"coursesMax": 93.64,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.64,
					"coursesSum": 93.64
				},
				{
					"coursesMax": 93.64,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.64,
					"coursesSum": 93.64
				},
				{
					"coursesMax": 93.63,
					"courses_dept": "spph",
					"courses_year": 2014,
					"coursesMin": 93.63,
					"coursesSum": 93.63
				},
				{
					"coursesMax": 93.63,
					"courses_dept": "spph",
					"courses_year": 1900,
					"coursesMin": 93.63,
					"coursesSum": 93.63
				},
				{
					"coursesMax": 93.6,
					"courses_dept": "micb",
					"courses_year": 2013,
					"coursesMin": 93.6,
					"coursesSum": 93.6
				},
				{
					"coursesMax": 93.6,
					"courses_dept": "micb",
					"courses_year": 1900,
					"coursesMin": 93.6,
					"coursesSum": 93.6
				},
				{
					"coursesMax": 93.6,
					"courses_dept": "math",
					"courses_year": 2009,
					"coursesMin": 93.6,
					"coursesSum": 93.6
				},
				{
					"coursesMax": 93.6,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 93.6,
					"coursesSum": 93.6
				},
				{
					"coursesMax": 93.6,
					"courses_dept": "educ",
					"courses_year": 2014,
					"coursesMin": 93.6,
					"coursesSum": 93.6
				},
				{
					"coursesMax": 93.6,
					"courses_dept": "educ",
					"courses_year": 2011,
					"coursesMin": 93.6,
					"coursesSum": 93.6
				},
				{
					"coursesMax": 93.6,
					"courses_dept": "educ",
					"courses_year": 1900,
					"coursesMin": 93.6,
					"coursesSum": 93.6
				},
				{
					"coursesMax": 93.59,
					"courses_dept": "epse",
					"courses_year": 2012,
					"coursesMin": 93.59,
					"coursesSum": 93.59
				},
				{
					"coursesMax": 93.59,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.59,
					"coursesSum": 93.59
				},
				{
					"coursesMax": 93.58,
					"courses_dept": "spph",
					"courses_year": 2015,
					"coursesMin": 93.58,
					"coursesSum": 93.58
				},
				{
					"coursesMax": 93.58,
					"courses_dept": "spph",
					"courses_year": 1900,
					"coursesMin": 93.58,
					"coursesSum": 93.58
				},
				{
					"coursesMax": 93.58,
					"courses_dept": "spph",
					"courses_year": 1900,
					"coursesMin": 93.58,
					"coursesSum": 93.58
				},
				{
					"coursesMax": 93.58,
					"courses_dept": "eece",
					"courses_year": 2007,
					"coursesMin": 93.58,
					"coursesSum": 93.58
				},
				{
					"coursesMax": 93.58,
					"courses_dept": "eece",
					"courses_year": 1900,
					"coursesMin": 93.58,
					"coursesSum": 93.58
				},
				{
					"coursesMax": 93.58,
					"courses_dept": "dhyg",
					"courses_year": 2013,
					"coursesMin": 93.58,
					"coursesSum": 93.58
				},
				{
					"coursesMax": 93.57,
					"courses_dept": "hgse",
					"courses_year": 2015,
					"coursesMin": 93.57,
					"coursesSum": 93.57
				},
				{
					"coursesMax": 93.57,
					"courses_dept": "hgse",
					"courses_year": 1900,
					"coursesMin": 93.57,
					"coursesSum": 93.57
				},
				{
					"coursesMax": 93.56,
					"courses_dept": "epse",
					"courses_year": 2015,
					"coursesMin": 93.56,
					"coursesSum": 93.56
				},
				{
					"coursesMax": 93.56,
					"courses_dept": "epse",
					"courses_year": 2014,
					"coursesMin": 93.56,
					"coursesSum": 93.56
				},
				{
					"coursesMax": 93.56,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.56,
					"coursesSum": 93.56
				},
				{
					"coursesMax": 93.56,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.56,
					"coursesSum": 93.56
				},
				{
					"coursesMax": 93.56,
					"courses_dept": "eece",
					"courses_year": 2008,
					"coursesMin": 93.56,
					"coursesSum": 93.56
				},
				{
					"coursesMax": 93.56,
					"courses_dept": "eece",
					"courses_year": 1900,
					"coursesMin": 93.56,
					"coursesSum": 93.56
				},
				{
					"coursesMax": 93.56,
					"courses_dept": "edcp",
					"courses_year": 2015,
					"coursesMin": 93.56,
					"coursesSum": 93.56
				},
				{
					"coursesMax": 93.55,
					"courses_dept": "spph",
					"courses_year": 1900,
					"coursesMin": 93.55,
					"coursesSum": 93.55
				},
				{
					"coursesMax": 93.55,
					"courses_dept": "epse",
					"courses_year": 2011,
					"coursesMin": 93.55,
					"coursesSum": 93.55
				},
				{
					"coursesMax": 93.55,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.55,
					"coursesSum": 93.55
				},
				{
					"coursesMax": 93.54,
					"courses_dept": "epse",
					"courses_year": 2012,
					"coursesMin": 93.54,
					"coursesSum": 93.54
				},
				{
					"coursesMax": 93.54,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.54,
					"coursesSum": 93.54
				},
				{
					"coursesMax": 93.54,
					"courses_dept": "audi",
					"courses_year": 2014,
					"coursesMin": 93.54,
					"coursesSum": 93.54
				},
				{
					"coursesMax": 93.54,
					"courses_dept": "audi",
					"courses_year": 1900,
					"coursesMin": 93.54,
					"coursesSum": 93.54
				},
				{
					"coursesMax": 93.53,
					"courses_dept": "educ",
					"courses_year": 2011,
					"coursesMin": 93.53,
					"coursesSum": 93.53
				},
				{
					"coursesMax": 93.52,
					"courses_dept": "econ",
					"courses_year": 2010,
					"coursesMin": 93.52,
					"coursesSum": 93.52
				},
				{
					"coursesMax": 93.52,
					"courses_dept": "econ",
					"courses_year": 1900,
					"coursesMin": 93.52,
					"coursesSum": 93.52
				},
				{
					"coursesMax": 93.51,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.51,
					"coursesSum": 93.51
				},
				{
					"coursesMax": 93.5,
					"courses_dept": "surg",
					"courses_year": 2013,
					"coursesMin": 93.5,
					"coursesSum": 93.5
				},
				{
					"coursesMax": 93.5,
					"courses_dept": "surg",
					"courses_year": 1900,
					"coursesMin": 93.5,
					"coursesSum": 93.5
				},
				{
					"coursesMax": 93.5,
					"courses_dept": "psyc",
					"courses_year": 2013,
					"coursesMin": 93.5,
					"coursesSum": 93.5
				},
				{
					"coursesMax": 93.5,
					"courses_dept": "psyc",
					"courses_year": 1900,
					"coursesMin": 93.5,
					"coursesSum": 93.5
				},
				{
					"coursesMax": 93.5,
					"courses_dept": "path",
					"courses_year": 2008,
					"coursesMin": 93.5,
					"coursesSum": 93.5
				},
				{
					"coursesMax": 93.5,
					"courses_dept": "nurs",
					"courses_year": 2013,
					"coursesMin": 93.5,
					"coursesSum": 93.5
				},
				{
					"coursesMax": 93.5,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 93.5,
					"coursesSum": 93.5
				},
				{
					"coursesMax": 93.5,
					"courses_dept": "medi",
					"courses_year": 2014,
					"coursesMin": 93.5,
					"coursesSum": 93.5
				},
				{
					"coursesMax": 93.5,
					"courses_dept": "mech",
					"courses_year": 2011,
					"coursesMin": 93.5,
					"coursesSum": 93.5
				},
				{
					"coursesMax": 93.5,
					"courses_dept": "mech",
					"courses_year": 1900,
					"coursesMin": 93.5,
					"coursesSum": 93.5
				},
				{
					"coursesMax": 93.5,
					"courses_dept": "math",
					"courses_year": 2015,
					"coursesMin": 93.5,
					"coursesSum": 93.5
				},
				{
					"coursesMax": 93.5,
					"courses_dept": "math",
					"courses_year": 2013,
					"coursesMin": 93.5,
					"coursesSum": 93.5
				},
				{
					"coursesMax": 93.5,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 93.5,
					"coursesSum": 93.5
				},
				{
					"coursesMax": 93.5,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 93.5,
					"coursesSum": 93.5
				},
				{
					"coursesMax": 93.5,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 93.5,
					"coursesSum": 93.5
				},
				{
					"coursesMax": 93.5,
					"courses_dept": "epse",
					"courses_year": 2007,
					"coursesMin": 93.5,
					"coursesSum": 93.5
				},
				{
					"coursesMax": 93.5,
					"courses_dept": "crwr",
					"courses_year": 2012,
					"coursesMin": 93.5,
					"coursesSum": 93.5
				},
				{
					"coursesMax": 93.5,
					"courses_dept": "cpsc",
					"courses_year": 2011,
					"coursesMin": 93.5,
					"coursesSum": 93.5
				},
				{
					"coursesMax": 93.5,
					"courses_dept": "cpsc",
					"courses_year": 1900,
					"coursesMin": 93.5,
					"coursesSum": 93.5
				},
				{
					"coursesMax": 93.5,
					"courses_dept": "cnps",
					"courses_year": 2012,
					"coursesMin": 93.5,
					"coursesSum": 93.5
				},
				{
					"coursesMax": 93.5,
					"courses_dept": "cnps",
					"courses_year": 1900,
					"coursesMin": 93.5,
					"coursesSum": 93.5
				},
				{
					"coursesMax": 93.5,
					"courses_dept": "audi",
					"courses_year": 2010,
					"coursesMin": 93.5,
					"coursesSum": 93.5
				},
				{
					"coursesMax": 93.5,
					"courses_dept": "audi",
					"courses_year": 1900,
					"coursesMin": 93.5,
					"coursesSum": 93.5
				},
				{
					"coursesMax": 93.48,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.48,
					"coursesSum": 93.48
				},
				{
					"coursesMax": 93.47,
					"courses_dept": "midw",
					"courses_year": 2014,
					"coursesMin": 93.47,
					"coursesSum": 93.47
				},
				{
					"coursesMax": 93.47,
					"courses_dept": "midw",
					"courses_year": 1900,
					"coursesMin": 93.47,
					"coursesSum": 93.47
				},
				{
					"coursesMax": 93.47,
					"courses_dept": "kin",
					"courses_year": 2013,
					"coursesMin": 93.47,
					"coursesSum": 93.47
				},
				{
					"coursesMax": 93.47,
					"courses_dept": "kin",
					"courses_year": 1900,
					"coursesMin": 93.47,
					"coursesSum": 93.47
				},
				{
					"coursesMax": 93.47,
					"courses_dept": "eosc",
					"courses_year": 2014,
					"coursesMin": 93.47,
					"coursesSum": 93.47
				},
				{
					"coursesMax": 93.47,
					"courses_dept": "eosc",
					"courses_year": 1900,
					"coursesMin": 93.47,
					"coursesSum": 93.47
				},
				{
					"coursesMax": 93.47,
					"courses_dept": "educ",
					"courses_year": 2015,
					"coursesMin": 93.47,
					"coursesSum": 93.47
				},
				{
					"coursesMax": 93.47,
					"courses_dept": "econ",
					"courses_year": 2007,
					"coursesMin": 93.47,
					"coursesSum": 93.47
				},
				{
					"coursesMax": 93.47,
					"courses_dept": "econ",
					"courses_year": 1900,
					"coursesMin": 93.47,
					"coursesSum": 93.47
				},
				{
					"coursesMax": 93.45,
					"courses_dept": "spph",
					"courses_year": 1900,
					"coursesMin": 93.45,
					"coursesSum": 93.45
				},
				{
					"coursesMax": 93.45,
					"courses_dept": "musc",
					"courses_year": 2016,
					"coursesMin": 93.45,
					"coursesSum": 93.45
				},
				{
					"coursesMax": 93.45,
					"courses_dept": "musc",
					"courses_year": 1900,
					"coursesMin": 93.45,
					"coursesSum": 93.45
				},
				{
					"coursesMax": 93.45,
					"courses_dept": "biof",
					"courses_year": 2013,
					"coursesMin": 93.45,
					"coursesSum": 93.45
				},
				{
					"coursesMax": 93.45,
					"courses_dept": "biof",
					"courses_year": 1900,
					"coursesMin": 93.45,
					"coursesSum": 93.45
				},
				{
					"coursesMax": 93.44,
					"courses_dept": "edst",
					"courses_year": 2014,
					"coursesMin": 93.44,
					"coursesSum": 93.44
				},
				{
					"coursesMax": 93.44,
					"courses_dept": "edst",
					"courses_year": 1900,
					"coursesMin": 93.44,
					"coursesSum": 93.44
				},
				{
					"coursesMax": 93.42,
					"courses_dept": "epse",
					"courses_year": 2012,
					"coursesMin": 93.42,
					"coursesSum": 93.42
				},
				{
					"coursesMax": 93.42,
					"courses_dept": "epse",
					"courses_year": 2010,
					"coursesMin": 93.42,
					"coursesSum": 93.42
				},
				{
					"coursesMax": 93.42,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.42,
					"coursesSum": 93.42
				},
				{
					"coursesMax": 93.41,
					"courses_dept": "nurs",
					"courses_year": 2010,
					"coursesMin": 93.41,
					"coursesSum": 93.41
				},
				{
					"coursesMax": 93.41,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 93.41,
					"coursesSum": 93.41
				},
				{
					"coursesMax": 93.41,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.41,
					"coursesSum": 93.41
				},
				{
					"coursesMax": 93.4,
					"courses_dept": "sowk",
					"courses_year": 2010,
					"coursesMin": 93.4,
					"coursesSum": 93.4
				},
				{
					"coursesMax": 93.4,
					"courses_dept": "sowk",
					"courses_year": 1900,
					"coursesMin": 93.4,
					"coursesSum": 93.4
				},
				{
					"coursesMax": 93.4,
					"courses_dept": "nurs",
					"courses_year": 2016,
					"coursesMin": 93.4,
					"coursesSum": 93.4
				},
				{
					"coursesMax": 93.4,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 93.4,
					"coursesSum": 93.4
				},
				{
					"coursesMax": 93.4,
					"courses_dept": "edst",
					"courses_year": 2014,
					"coursesMin": 93.4,
					"coursesSum": 93.4
				},
				{
					"coursesMax": 93.4,
					"courses_dept": "edst",
					"courses_year": 2014,
					"coursesMin": 93.4,
					"coursesSum": 93.4
				},
				{
					"coursesMax": 93.4,
					"courses_dept": "edst",
					"courses_year": 1900,
					"coursesMin": 93.4,
					"coursesSum": 93.4
				},
				{
					"coursesMax": 93.4,
					"courses_dept": "edst",
					"courses_year": 1900,
					"coursesMin": 93.4,
					"coursesSum": 93.4
				},
				{
					"coursesMax": 93.4,
					"courses_dept": "cnps",
					"courses_year": 2011,
					"coursesMin": 93.4,
					"coursesSum": 93.4
				},
				{
					"coursesMax": 93.4,
					"courses_dept": "cnps",
					"courses_year": 1900,
					"coursesMin": 93.4,
					"coursesSum": 93.4
				},
				{
					"coursesMax": 93.38,
					"courses_dept": "cpsc",
					"courses_year": 2013,
					"coursesMin": 93.38,
					"coursesSum": 93.38
				},
				{
					"coursesMax": 93.38,
					"courses_dept": "cpsc",
					"courses_year": 1900,
					"coursesMin": 93.38,
					"coursesSum": 93.38
				},
				{
					"coursesMax": 93.37,
					"courses_dept": "kin",
					"courses_year": 2014,
					"coursesMin": 93.37,
					"coursesSum": 93.37
				},
				{
					"coursesMax": 93.37,
					"courses_dept": "kin",
					"courses_year": 1900,
					"coursesMin": 93.37,
					"coursesSum": 93.37
				},
				{
					"coursesMax": 93.36,
					"courses_dept": "nurs",
					"courses_year": 2013,
					"coursesMin": 93.36,
					"coursesSum": 93.36
				},
				{
					"coursesMax": 93.36,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 93.36,
					"coursesSum": 93.36
				},
				{
					"coursesMax": 93.35,
					"courses_dept": "musc",
					"courses_year": 2015,
					"coursesMin": 93.35,
					"coursesSum": 93.35
				},
				{
					"coursesMax": 93.35,
					"courses_dept": "musc",
					"courses_year": 1900,
					"coursesMin": 93.35,
					"coursesSum": 93.35
				},
				{
					"coursesMax": 93.35,
					"courses_dept": "epse",
					"courses_year": 2010,
					"coursesMin": 93.35,
					"coursesSum": 93.35
				},
				{
					"coursesMax": 93.34,
					"courses_dept": "etec",
					"courses_year": 1900,
					"coursesMin": 93.34,
					"coursesSum": 93.34
				},
				{
					"coursesMax": 93.33,
					"courses_dept": "spph",
					"courses_year": 2010,
					"coursesMin": 93.33,
					"coursesSum": 93.33
				},
				{
					"coursesMax": 93.33,
					"courses_dept": "spph",
					"courses_year": 1900,
					"coursesMin": 93.33,
					"coursesSum": 93.33
				},
				{
					"coursesMax": 93.33,
					"courses_dept": "musc",
					"courses_year": 2011,
					"coursesMin": 93.33,
					"coursesSum": 93.33
				},
				{
					"coursesMax": 93.33,
					"courses_dept": "musc",
					"courses_year": 1900,
					"coursesMin": 93.33,
					"coursesSum": 93.33
				},
				{
					"coursesMax": 93.33,
					"courses_dept": "epse",
					"courses_year": 2015,
					"coursesMin": 93.33,
					"coursesSum": 93.33
				},
				{
					"coursesMax": 93.33,
					"courses_dept": "epse",
					"courses_year": 2012,
					"coursesMin": 93.33,
					"coursesSum": 93.33
				},
				{
					"coursesMax": 93.33,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.33,
					"coursesSum": 93.33
				},
				{
					"coursesMax": 93.33,
					"courses_dept": "econ",
					"courses_year": 2014,
					"coursesMin": 93.33,
					"coursesSum": 93.33
				},
				{
					"coursesMax": 93.33,
					"courses_dept": "econ",
					"courses_year": 1900,
					"coursesMin": 93.33,
					"coursesSum": 93.33
				},
				{
					"coursesMax": 93.33,
					"courses_dept": "crwr",
					"courses_year": 2015,
					"coursesMin": 93.33,
					"coursesSum": 93.33
				},
				{
					"coursesMax": 93.33,
					"courses_dept": "crwr",
					"courses_year": 2013,
					"coursesMin": 93.33,
					"coursesSum": 93.33
				},
				{
					"coursesMax": 93.33,
					"courses_dept": "crwr",
					"courses_year": 2013,
					"coursesMin": 93.33,
					"coursesSum": 93.33
				},
				{
					"coursesMax": 93.33,
					"courses_dept": "adhe",
					"courses_year": 2016,
					"coursesMin": 93.33,
					"coursesSum": 93.33
				},
				{
					"coursesMax": 93.32,
					"courses_dept": "etec",
					"courses_year": 2015,
					"coursesMin": 93.32,
					"coursesSum": 93.32
				},
				{
					"coursesMax": 93.31,
					"courses_dept": "phys",
					"courses_year": 2015,
					"coursesMin": 93.31,
					"coursesSum": 93.31
				},
				{
					"coursesMax": 93.31,
					"courses_dept": "phys",
					"courses_year": 1900,
					"coursesMin": 93.31,
					"coursesSum": 93.31
				},
				{
					"coursesMax": 93.31,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.31,
					"coursesSum": 93.31
				},
				{
					"coursesMax": 93.3,
					"courses_dept": "epse",
					"courses_year": 2014,
					"coursesMin": 93.3,
					"coursesSum": 93.3
				},
				{
					"coursesMax": 93.3,
					"courses_dept": "edcp",
					"courses_year": 2010,
					"coursesMin": 93.3,
					"coursesSum": 93.3
				},
				{
					"coursesMax": 93.3,
					"courses_dept": "edcp",
					"courses_year": 1900,
					"coursesMin": 93.3,
					"coursesSum": 93.3
				},
				{
					"coursesMax": 93.29,
					"courses_dept": "medi",
					"courses_year": 2010,
					"coursesMin": 93.29,
					"coursesSum": 93.29
				},
				{
					"coursesMax": 93.29,
					"courses_dept": "medi",
					"courses_year": 1900,
					"coursesMin": 93.29,
					"coursesSum": 93.29
				},
				{
					"coursesMax": 93.29,
					"courses_dept": "kin",
					"courses_year": 2013,
					"coursesMin": 93.29,
					"coursesSum": 93.29
				},
				{
					"coursesMax": 93.29,
					"courses_dept": "epse",
					"courses_year": 2010,
					"coursesMin": 93.29,
					"coursesSum": 93.29
				},
				{
					"coursesMax": 93.29,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.29,
					"coursesSum": 93.29
				},
				{
					"coursesMax": 93.28,
					"courses_dept": "etec",
					"courses_year": 2012,
					"coursesMin": 93.28,
					"coursesSum": 93.28
				},
				{
					"coursesMax": 93.28,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.28,
					"coursesSum": 93.28
				},
				{
					"coursesMax": 93.27,
					"courses_dept": "epse",
					"courses_year": 2013,
					"coursesMin": 93.27,
					"coursesSum": 93.27
				},
				{
					"coursesMax": 93.27,
					"courses_dept": "educ",
					"courses_year": 2008,
					"coursesMin": 93.27,
					"coursesSum": 93.27
				},
				{
					"coursesMax": 93.26,
					"courses_dept": "etec",
					"courses_year": 1900,
					"coursesMin": 93.26,
					"coursesSum": 93.26
				},
				{
					"coursesMax": 93.25,
					"courses_dept": "span",
					"courses_year": 2008,
					"coursesMin": 93.25,
					"coursesSum": 93.25
				},
				{
					"coursesMax": 93.25,
					"courses_dept": "span",
					"courses_year": 1900,
					"coursesMin": 93.25,
					"coursesSum": 93.25
				},
				{
					"coursesMax": 93.25,
					"courses_dept": "psyc",
					"courses_year": 2015,
					"coursesMin": 93.25,
					"coursesSum": 93.25
				},
				{
					"coursesMax": 93.25,
					"courses_dept": "psyc",
					"courses_year": 1900,
					"coursesMin": 93.25,
					"coursesSum": 93.25
				},
				{
					"coursesMax": 93.25,
					"courses_dept": "medg",
					"courses_year": 2009,
					"coursesMin": 93.25,
					"coursesSum": 93.25
				},
				{
					"coursesMax": 93.25,
					"courses_dept": "medg",
					"courses_year": 1900,
					"coursesMin": 93.25,
					"coursesSum": 93.25
				},
				{
					"coursesMax": 93.25,
					"courses_dept": "epse",
					"courses_year": 2015,
					"coursesMin": 93.25,
					"coursesSum": 93.25
				},
				{
					"coursesMax": 93.25,
					"courses_dept": "epse",
					"courses_year": 2013,
					"coursesMin": 93.25,
					"coursesSum": 93.25
				},
				{
					"coursesMax": 93.25,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.25,
					"coursesSum": 93.25
				},
				{
					"coursesMax": 93.25,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.25,
					"coursesSum": 93.25
				},
				{
					"coursesMax": 93.25,
					"courses_dept": "edcp",
					"courses_year": 2015,
					"coursesMin": 93.25,
					"coursesSum": 93.25
				},
				{
					"coursesMax": 93.23,
					"courses_dept": "epse",
					"courses_year": 2015,
					"coursesMin": 93.23,
					"coursesSum": 93.23
				},
				{
					"coursesMax": 93.23,
					"courses_dept": "epse",
					"courses_year": 2014,
					"coursesMin": 93.23,
					"coursesSum": 93.23
				},
				{
					"coursesMax": 93.23,
					"courses_dept": "epse",
					"courses_year": 2009,
					"coursesMin": 93.23,
					"coursesSum": 93.23
				},
				{
					"coursesMax": 93.23,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.23,
					"coursesSum": 93.23
				},
				{
					"coursesMax": 93.23,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.23,
					"coursesSum": 93.23
				},
				{
					"coursesMax": 93.22,
					"courses_dept": "hinu",
					"courses_year": 2007,
					"coursesMin": 93.22,
					"coursesSum": 93.22
				},
				{
					"coursesMax": 93.22,
					"courses_dept": "hinu",
					"courses_year": 1900,
					"coursesMin": 93.22,
					"coursesSum": 93.22
				},
				{
					"coursesMax": 93.22,
					"courses_dept": "cnps",
					"courses_year": 2008,
					"coursesMin": 93.22,
					"coursesSum": 93.22
				},
				{
					"coursesMax": 93.22,
					"courses_dept": "cnps",
					"courses_year": 1900,
					"coursesMin": 93.22,
					"coursesSum": 93.22
				},
				{
					"coursesMax": 93.2,
					"courses_dept": "spph",
					"courses_year": 2015,
					"coursesMin": 93.2,
					"coursesSum": 93.2
				},
				{
					"coursesMax": 93.2,
					"courses_dept": "spph",
					"courses_year": 1900,
					"coursesMin": 93.2,
					"coursesSum": 93.2
				},
				{
					"coursesMax": 93.2,
					"courses_dept": "micb",
					"courses_year": 2009,
					"coursesMin": 93.2,
					"coursesSum": 93.2
				},
				{
					"coursesMax": 93.2,
					"courses_dept": "micb",
					"courses_year": 1900,
					"coursesMin": 93.2,
					"coursesSum": 93.2
				},
				{
					"coursesMax": 93.2,
					"courses_dept": "math",
					"courses_year": 2016,
					"coursesMin": 93.2,
					"coursesSum": 93.2
				},
				{
					"coursesMax": 93.2,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 93.2,
					"coursesSum": 93.2
				},
				{
					"coursesMax": 93.2,
					"courses_dept": "lled",
					"courses_year": 2016,
					"coursesMin": 93.2,
					"coursesSum": 93.2
				},
				{
					"coursesMax": 93.2,
					"courses_dept": "lled",
					"courses_year": 1900,
					"coursesMin": 93.2,
					"coursesSum": 93.2
				},
				{
					"coursesMax": 93.2,
					"courses_dept": "epse",
					"courses_year": 2012,
					"coursesMin": 93.2,
					"coursesSum": 93.2
				},
				{
					"coursesMax": 93.2,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.2,
					"coursesSum": 93.2
				},
				{
					"coursesMax": 93.2,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.2,
					"coursesSum": 93.2
				},
				{
					"coursesMax": 93.2,
					"courses_dept": "edcp",
					"courses_year": 2013,
					"coursesMin": 93.2,
					"coursesSum": 93.2
				},
				{
					"coursesMax": 93.2,
					"courses_dept": "edcp",
					"courses_year": 1900,
					"coursesMin": 93.2,
					"coursesSum": 93.2
				},
				{
					"coursesMax": 93.2,
					"courses_dept": "crwr",
					"courses_year": 1900,
					"coursesMin": 93.2,
					"coursesSum": 93.2
				},
				{
					"coursesMax": 93.2,
					"courses_dept": "audi",
					"courses_year": 2016,
					"coursesMin": 93.2,
					"coursesSum": 93.2
				},
				{
					"coursesMax": 93.2,
					"courses_dept": "audi",
					"courses_year": 1900,
					"coursesMin": 93.2,
					"coursesSum": 93.2
				},
				{
					"coursesMax": 93.19,
					"courses_dept": "etec",
					"courses_year": 1900,
					"coursesMin": 93.19,
					"coursesSum": 93.19
				},
				{
					"coursesMax": 93.17,
					"courses_dept": "frst",
					"courses_year": 2014,
					"coursesMin": 93.17,
					"coursesSum": 93.17
				},
				{
					"coursesMax": 93.15,
					"courses_dept": "epse",
					"courses_year": 2014,
					"coursesMin": 93.15,
					"coursesSum": 93.15
				},
				{
					"coursesMax": 93.15,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.15,
					"coursesSum": 93.15
				},
				{
					"coursesMax": 93.14,
					"courses_dept": "etec",
					"courses_year": 2013,
					"coursesMin": 93.14,
					"coursesSum": 93.14
				},
				{
					"coursesMax": 93.14,
					"courses_dept": "etec",
					"courses_year": 2008,
					"coursesMin": 93.14,
					"coursesSum": 93.14
				},
				{
					"coursesMax": 93.12,
					"courses_dept": "plan",
					"courses_year": 2010,
					"coursesMin": 93.12,
					"coursesSum": 93.12
				},
				{
					"coursesMax": 93.12,
					"courses_dept": "plan",
					"courses_year": 1900,
					"coursesMin": 93.12,
					"coursesSum": 93.12
				},
				{
					"coursesMax": 93.11,
					"courses_dept": "math",
					"courses_year": 2015,
					"coursesMin": 93.11,
					"coursesSum": 93.11
				},
				{
					"coursesMax": 93.11,
					"courses_dept": "math",
					"courses_year": 2015,
					"coursesMin": 93.11,
					"coursesSum": 93.11
				},
				{
					"coursesMax": 93.11,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 93.11,
					"coursesSum": 93.11
				},
				{
					"coursesMax": 93.11,
					"courses_dept": "math",
					"courses_year": 1900,
					"coursesMin": 93.11,
					"coursesSum": 93.11
				},
				{
					"coursesMax": 93.11,
					"courses_dept": "etec",
					"courses_year": 2010,
					"coursesMin": 93.11,
					"coursesSum": 93.11
				},
				{
					"coursesMax": 93.11,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.11,
					"coursesSum": 93.11
				},
				{
					"coursesMax": 93.1,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.1,
					"coursesSum": 93.1
				},
				{
					"coursesMax": 93.09,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.09,
					"coursesSum": 93.09
				},
				{
					"coursesMax": 93.09,
					"courses_dept": "audi",
					"courses_year": 2014,
					"coursesMin": 93.09,
					"coursesSum": 93.09
				},
				{
					"coursesMax": 93.09,
					"courses_dept": "audi",
					"courses_year": 1900,
					"coursesMin": 93.09,
					"coursesSum": 93.09
				},
				{
					"coursesMax": 93.08,
					"courses_dept": "medi",
					"courses_year": 2014,
					"coursesMin": 93.08,
					"coursesSum": 93.08
				},
				{
					"coursesMax": 93.08,
					"courses_dept": "medi",
					"courses_year": 1900,
					"coursesMin": 93.08,
					"coursesSum": 93.08
				},
				{
					"coursesMax": 93.08,
					"courses_dept": "etec",
					"courses_year": 2012,
					"coursesMin": 93.08,
					"coursesSum": 93.08
				},
				{
					"coursesMax": 93.08,
					"courses_dept": "epse",
					"courses_year": 2007,
					"coursesMin": 93.08,
					"coursesSum": 93.08
				},
				{
					"coursesMax": 93.08,
					"courses_dept": "epse",
					"courses_year": 1900,
					"coursesMin": 93.08,
					"coursesSum": 93.08
				},
				{
					"coursesMax": 93.08,
					"courses_dept": "cnps",
					"courses_year": 2008,
					"coursesMin": 93.08,
					"coursesSum": 93.08
				},
				{
					"coursesMax": 93.08,
					"courses_dept": "cnps",
					"courses_year": 1900,
					"coursesMin": 93.08,
					"coursesSum": 93.08
				},
				{
					"coursesMax": 93.07,
					"courses_dept": "onco",
					"courses_year": 2013,
					"coursesMin": 93.07,
					"coursesSum": 93.07
				},
				{
					"coursesMax": 93.07,
					"courses_dept": "onco",
					"courses_year": 1900,
					"coursesMin": 93.07,
					"coursesSum": 93.07
				},
				{
					"coursesMax": 93.07,
					"courses_dept": "nurs",
					"courses_year": 2007,
					"coursesMin": 93.07,
					"coursesSum": 93.07
				},
				{
					"coursesMax": 93.07,
					"courses_dept": "nurs",
					"courses_year": 1900,
					"coursesMin": 93.07,
					"coursesSum": 93.07
				},
				{
					"coursesMax": 93.07,
					"courses_dept": "hgse",
					"courses_year": 2013,
					"coursesMin": 93.07,
					"coursesSum": 93.07
				},
				{
					"coursesMax": 93.07,
					"courses_dept": "hgse",
					"courses_year": 1900,
					"coursesMin": 93.07,
					"coursesSum": 93.07
				},
				{
					"coursesMax": 93.06,
					"courses_dept": "musc",
					"courses_year": 2010,
					"coursesMin": 93.06,
					"coursesSum": 93.06
				},
				{
					"coursesMax": 93.06,
					"courses_dept": "musc",
					"courses_year": 1900,
					"coursesMin": 93.06,
					"coursesSum": 93.06
				},
				{
					"coursesMax": 93.06,
					"courses_dept": "epse",
					"courses_year": 2012,
					"coursesMin": 93.06,
					"coursesSum": 93.06
				},
				{
					"coursesMax": 93.05,
					"courses_dept": "thtr",
					"courses_year": 2014,
					"coursesMin": 93.05,
					"coursesSum": 93.05
				},
				{
					"coursesMax": 93.05,
					"courses_dept": "thtr",
					"courses_year": 1900,
					"coursesMin": 93.05,
					"coursesSum": 93.05
				},
				{
					"coursesMax": 93.05,
					"courses_dept": "fnh",
					"courses_year": 2015,
					"coursesMin": 93.05,
					"coursesSum": 93.05
				},
				{
					"coursesMax": 93.05,
					"courses_dept": "etec",
					"courses_year": 2015,
					"coursesMin": 93.05,
					"coursesSum": 93.05
				},
				{
					"coursesMax": 93.04,
					"courses_dept": "gpp",
					"courses_year": 2015,
					"coursesMin": 93.04,
					"coursesSum": 93.04
				},
				{
					"coursesMax": 93.04,
					"courses_dept": "gpp",
					"courses_year": 1900,
					"coursesMin": 93.04,
					"coursesSum": 93.04
				},
				{
					"coursesMax": 93.04,
					"courses_dept": "edcp",
					"courses_year": 2011,
					"coursesMin": 93.04,
					"coursesSum": 93.04
				}
			];
			expect(returnedQuery).to.deep.equal(expectedQuery);
			expect(returnedQuery).to.have.deep.ordered.members(expectedQuery);
			// let a = getArrayKeys(q["OPTIONS"]["COLUMNS"]);
			// // let b = f.executeFilter(q3, a);
			// console.log(a.length);
			// // console.log(b.length);
			// for (let x of a) {
			// 	console.log(x);
			// }
			// console.log(isValidQuery(q));
			// console.log(isValidQuery(q2));
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

