import {IInsightFacade, InsightDatasetKind} from "../../src/controller/IInsightFacade";
import InsightFacade from "../../src/controller/InsightFacade";
import {getContentFromArchives} from "../resources/TestUtil";
import * as fs from "fs-extra";
import {isValidApply, isValidQuery} from "../../src/controller/ValidateQuery";

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
							courses_avg: 68
						}
					}
					,
					{
						EQ: {
							courses_avg: 63
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
						courses_avg: 68
					}
				}
				,
				{
					EQ: {
						courses_avg: 63
					}
				}
			]
		};
		let q3 = {
			WHERE: {
				AND: [
					{
						GT: {
							courses_avg: 93
						}
					}
				]
			},
			OPTIONS: {
				COLUMNS: [
					"coursesMax",
					"courses_dept",
					"courses_year",
					"coursesMin",
					"coursesSum"
				],
				ORDER: {
					dir: "DOWN",
					keys: [
						"coursesMax",
						"courses_dept",
						"courses_year",
						"coursesMin",
						"coursesSum"
					]
				}
			},
			TRANSFORMATIONS: {
				GROUP: [
					"courses_dept",
					"courses_year"

				],
				APPLY: [
					"courses_uuid"
				]
			}
		};
		let q4 = {
			WHERE: {
				AND: [
					{
						GT: {
							courses_avg: 93
						}
					}
				]
			},
			OPTIONS: {
				COLUMNS: [
					"coursesMax",
					"courses_dept",
					"courses_year",
					"coursesMin",
					"coursesSum"
				],
				ORDER: {
					dir: "DOWN",
					keys: [
						"coursesMax",
						"courses_dept",
						"courses_year",
						"coursesMin",
						"coursesSum"
					]
				}
			},
			TRANSFORMATIONS: {
				GROUP: [
					"courses_dept",
					"courses_year",
					"courses_uuid"
				],
				APPLY: [
					{
						coursesMax: {
							MAX: "courses_avg"
						}
					},
					{
						coursesMin: {
							MIN: "courses_avg"
						}
					},
					{
						coursesSum: {
							SUM: "courses_avg"
						}
					}
				]
			}
		};
		let q5= {
			"WHERE": {
				"AND": [
					{
						"OR": [
							{
								"GT": {
									"courses_avg": 88.75
								}
							},
							{
								"EQ": {
									"courses_avg": 88.1
								}
							},
							{
								"EQ": {
									"courses_avg": 88.13
								}
							},
							{
								"EQ": {
									"courses_avg": 88.12
								}
							},
							{
								"EQ": {
									"courses_avg": 88.11
								}
							},
							{
								"EQ": {
									"courses_avg": 88.44
								}
							}
						]
					},
					{
						"NOT": {
							"IS": {
								"courses_uuid": "22087"
							}
						}
					}
				]
			},
			"OPTIONS": {
				"COLUMNS": [
					"courses_dept",
					"courses_id",
					"courses_uuid",
					"courses_avg"
				],
				"ORDER": "courses_avg"
			}
		};
		beforeEach(function () {
			fs.removeSync("data");
			facade = new InsightFacade();
		});
		it("should RDS pass add then remove", async function () {
			this.timeout(10000);
			// await facade.addDataset("courses", courses, InsightDatasetKind.Courses);
			// let f = facade as InsightFacade;
			console.log(isValidQuery(q5));

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

