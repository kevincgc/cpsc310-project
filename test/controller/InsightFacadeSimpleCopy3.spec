import {IInsightFacade, InsightDatasetKind} from "../../src/controller/IInsightFacade";
import InsightFacade from "../../src/controller/InsightFacade";
import {getContentFromArchives} from "../resources/TestUtil";
import * as fs from "fs-extra";
import {isValidApply, isValidQuery} from "../../src/controller/ValidateQuery";
import {getLatLong} from "../../src/controller/addDatasetCoursesHelpers";

describe("tests", function() {
	let courses: string;
	let rooms: string;
	let courses16: string;
	let courses10: string;
	let courses8: string;
	let coursesNotAllJson: string;
	let coursesJsonOutsideFolder: string;
	before(function () {
		courses = getContentFromArchives("courses.zip");
		rooms = getContentFromArchives("rooms.zip");
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
		});
		let q1 = {
			WHERE: {
				AND: [
					{
						IS: {
							rooms_fullname: "Woodward (Instructional Resources Centre-IRC)"
						}
					},
					{
						IS: {
							rooms_shortname: "WOOD"
						}
					},
					{
						IS: {
							rooms_number: "G66"
						}
					},
					{
						IS: {
							rooms_name: "WOOD_G66"
						}
					},
					{
						IS: {
							rooms_address: "2194 Health Sciences Mall"
						}
					},
					{
						EQ: {
							rooms_lat: 49.26478
						}
					},
					{
						EQ: {
							rooms_lon: -123.24673
						}
					},
					{
						EQ: {
							rooms_seats: 16
						}
					},
					{
						IS: {
							rooms_type: "Small Group"
						}
					},
					{
						IS: {
							rooms_furniture: "Classroom-Movable Tables & Chairs"
						}
					},
					{
						IS: {
							rooms_href: "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-G66"
						}
					}
				]
			},
			OPTIONS: {
				COLUMNS: [
					"rooms_fullname",
					"rooms_shortname",
					"rooms_number",
					"rooms_name",
					"rooms_address",
					"rooms_lat",
					"rooms_lon",
					"rooms_seats",
					"rooms_type",
					"rooms_furniture",
					"rooms_href"
				],
				ORDER: {
					dir: "DOWN",
					keys: [
						"rooms_fullname",
						"rooms_number"
					]
				}
			}
		};
		let q3 = {
			WHERE: {
				AND: [
					{
						IS: {
							rooms_fullname: "Woodward (Instructional Resources Centre-IRC)"
						}
					}
				]
			},
			OPTIONS: {
				COLUMNS: [
					"rooms_fullname",
					"rooms_shortname",
					"rooms_number",
					"rooms_name",
					"rooms_address",
					"rooms_lat",
					"rooms_lon",
					"rooms_seats",
					"rooms_type",
					"rooms_furniture",
					"rooms_href"
				],
				ORDER: {
					dir: "DOWN",
					keys: [
						"rooms_fullname",
						"rooms_number"
					]
				}
			}
		};
		it("should RDS pass add then remove", async function () {
			this.timeout(10000);
			// await facade.addDataset("courses", courses, InsightDatasetKind.Courses);
			// let f = facade as InsightFacade;
			await facade.addDataset("rooms", rooms, InsightDatasetKind.Rooms);
			console.log(facade.performQuery(q3));
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

