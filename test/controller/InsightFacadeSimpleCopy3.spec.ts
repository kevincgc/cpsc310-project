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
		it("should RDS pass add then remove", async function () {
			this.timeout(10000);
			// await facade.addDataset("courses", courses, InsightDatasetKind.Courses);
			// let f = facade as InsightFacade;
			await facade.addDataset("courses", rooms, InsightDatasetKind.Rooms);

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

