import Server from "../../src/rest/Server";
import InsightFacade from "../../src/controller/InsightFacade";
import chai, {expect, use} from "chai";
import chaiHttp from "chai-http";
import {clearDisk, getContentFromArchives} from "../resources/TestUtil";
// import chai from "chai";
import Response = ChaiHttp.Response;
import {InsightDataset, InsightDatasetKind, InsightError} from "../../src/controller/IInsightFacade";

describe("Facade D3", function () {
	let facade: InsightFacade;
	let server: Server;
	let courses: string;
	let rooms: string;
	const SERVER_URL = "http://localhost:4321";

	use(chaiHttp);

	before(function () {
		rooms = getContentFromArchives("rooms.zip");
		courses = getContentFromArchives("courses.zip");
		clearDisk();
		facade = new InsightFacade();
		server = new Server(4321);
		try {
			return server.start();
		} catch (error) {
			console.log(error);
			expect.fail("Server could not start");
		}
	});

	after(async function () {
		try {
			await server.stop();
		} catch (error) {
			console.log(error);
			expect.fail("Server could not stop");
		}
	});

	beforeEach(function () {
		// might want to add some process logging here to keep track of what"s going on
	});

	afterEach(function () {
		// might want to add some process logging here to keep track of what"s going on
	});

	// Sample on how to format PUT requests
	it("PUT courses dataset", function () {
		this.timeout(5000);
		try {
			return chai.request(SERVER_URL)
				.put("/dataset/courses/courses")
				.send(courses)
				.set("Content-Type", "application/x-zip-compressed")
				.then(function (res: Response) {
					// some logging here please!
					expect(res.status).to.be.equal(200);
					console.log(res.status);
				})
				.catch(function (err: any) {
					console.log(err);
					expect.fail();
				});
		} catch (err) {
			console.log(err);
			// and some more logging here!
		}
	});

	it("PUT duplicate courses dataset", function () {
		this.timeout(5000);
		try {
			return chai.request(SERVER_URL)
				.put("/dataset/courses/courses")
				.send(courses)
				.set("Content-Type", "application/x-zip-compressed")
				.then(function (res: Response) {
					// some logging here please!
					expect(res.status).to.be.equal(400);
					console.log(res.status);
				})
				.catch(function (err: any) {
					console.log(err);
					expect.fail();
				});
		} catch (err) {
			console.log(err);
			// and some more logging here!
		}
	});

	it("PUT rooms dataset", function () {
		this.timeout(5000);
		try {
			return chai.request(SERVER_URL)
				.put("/dataset/rooms/rooms")
				.send(rooms)
				.set("Content-Type", "application/x-zip-compressed")
				.then(function (res: Response) {
					// some logging here please!
					expect(res.status).to.be.equal(200);
					console.log(res.status);
				})
				.catch(function (err: any) {
					console.log(err);
					expect.fail();
				});
		} catch (err) {
			console.log(err);
			// and some more logging here!
		}
	});

	it("PUT rooms1 dataset", function () {
		this.timeout(5000);
		try {
			return chai.request(SERVER_URL)
				.put("/dataset/rooms1/rooms")
				.send(rooms)
				.set("Content-Type", "application/x-zip-compressed")
				.then(function (res: Response) {
					// some logging here please!
					expect(res.status).to.be.equal(200);
					console.log(res.status);
				})
				.catch(function (err: any) {
					console.log(err);
					expect.fail();
				});
		} catch (err) {
			console.log(err);
			// and some more logging here!
		}
	});

	it("PUT courses1 dataset", function () {
		this.timeout(5000);
		try {
			return chai.request(SERVER_URL)
				.put("/dataset/courses1/courses")
				.send(courses)
				.set("Content-Type", "application/x-zip-compressed")
				.then(function (res: Response) {
					// some logging here please!
					expect(res.status).to.be.equal(200);
					console.log(res.status);
				})
				.catch(function (err: any) {
					console.log(err);
					expect.fail();
				});
		} catch (err) {
			console.log(err);
			// and some more logging here!
		}
	});

	it("GET list dataset", function () {
		this.timeout(5000);
		try {
			return chai.request(SERVER_URL)
				.get("/datasets")
				.then(function (res: Response) {
					// some logging here please!
					expect(res.status).to.be.equal(200);
					expect(res.body.result).to.be.an.instanceOf(Array);
					expect(res.body.result).to.have.length(4);
					const expectedDatasets: any = [
						{ id: "courses", kind: "courses", numRows: 64612 },
						{ id: "rooms", kind: "rooms", numRows: 364 },
						{ id: "rooms1", kind: "rooms", numRows: 364 },
						{ id: "courses1", kind: "courses", numRows: 64612 }
					];
					expect(res.body.result).to.have.deep.members(expectedDatasets);
					console.log(res.body.result);
				})
				.catch(function (err: any) {
					console.log(err);
					expect.fail();
				});
		} catch (err) {
			console.log(err);
			// and some more logging here!
		}
	});

	it("DEL rooms1 dataset", function () {
		this.timeout(5000);
		try {
			return chai.request(SERVER_URL)
				.del("/dataset/rooms1")
				.then(function (res: Response) {
					// some logging here please!
					expect(res.status).to.be.equal(200);
					console.log(res.status);
				})
				.catch(function (err: any) {
					console.log(err);
					expect.fail();
				});
		} catch (err) {
			console.log(err);
			// and some more logging here!
		}
	});

	it("GET list dataset", function () {
		this.timeout(5000);
		try {
			return chai.request(SERVER_URL)
				.get("/datasets")
				.then(function (res: Response) {
					// some logging here please!
					expect(res.status).to.be.equal(200);
					expect(res.body.result).to.be.an.instanceOf(Array);
					expect(res.body.result).to.have.length(3);
					const expectedDatasets: any = [
						{ id: "courses", kind: "courses", numRows: 64612 },
						{ id: "rooms", kind: "rooms", numRows: 364 },
						{ id: "courses1", kind: "courses", numRows: 64612 }
					];
					expect(res.body.result).to.have.deep.members(expectedDatasets);
					console.log(res.body.result);
				})
				.catch(function (err: any) {
					console.log(err);
					expect.fail();
				});
		} catch (err) {
			console.log(err);
			// and some more logging here!
		}
	});

	it("DEL dataset not found", function () {
		this.timeout(5000);
		try {
			return chai.request(SERVER_URL)
				.del("/dataset/coursez")
				.then(function (res: Response) {
					// some logging here please!
					expect(res.status).to.be.equal(404);
					console.log(res.status);
				})
				.catch(function (err: any) {
					console.log(err);
					expect.fail();
				});
		} catch (err) {
			console.log(err);
			// and some more logging here!
		}
	});

	it("PUT invalid dataset id", function () {
		this.timeout(5000);
		try {
			return chai.request(SERVER_URL)
				.put("/dataset/      /courses")
				.send(courses)
				.set("Content-Type", "application/x-zip-compressed")
				.then(function (res: Response) {
					// some logging here please!
					expect(res.status).to.be.equal(400);
					console.log(res.status);
				})
				.catch(function (err: any) {
					console.log(err);
					expect.fail();
				});
		} catch (err) {
			console.log(err);
			// and some more logging here!
		}
	});

	it("PUT invalid dataset kind", function () {
		this.timeout(5000);
		try {
			return chai.request(SERVER_URL)
				.put("/dataset/courses2/course")
				.send(courses)
				.set("Content-Type", "application/x-zip-compressed")
				.then(function (res: Response) {
					// some logging here please!
					expect(res.status).to.be.equal(400);
					console.log(res.status);
				})
				.catch(function (err: any) {
					console.log(err);
					expect.fail();
				});
		} catch (err) {
			console.log(err);
			// and some more logging here!
		}
	});

	it("POST courses query", function () {
		let q = {
			WHERE: {
				OR: [
					{
						AND: [
							{
								GT: {
									courses_avg: 91
								}
							},
							{
								IS: {
									courses_dept: "cpsc"
								}
							}
						]
					},
					{
						EQ: {
							courses_avg: 99
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
				ORDER: "courses_id"
			}
		};
		let expected = [
			{
				courses_dept: "cpsc",
				courses_id: "445",
				courses_avg: 91.25
			},
			{
				courses_dept: "cpsc",
				courses_id: "445",
				courses_avg: 91.25
			},
			{
				courses_dept: "cpsc",
				courses_id: "449",
				courses_avg: 92.63
			},
			{
				courses_dept: "cpsc",
				courses_id: "449",
				courses_avg: 92.63
			},
			{
				courses_dept: "cpsc",
				courses_id: "449",
				courses_avg: 93.38
			},
			{
				courses_dept: "cpsc",
				courses_id: "449",
				courses_avg: 93.38
			},
			{
				courses_dept: "cpsc",
				courses_id: "449",
				courses_avg: 93.5
			},
			{
				courses_dept: "cpsc",
				courses_id: "449",
				courses_avg: 93.5
			},
			{
				courses_dept: "cpsc",
				courses_id: "449",
				courses_avg: 92.5
			},
			{
				courses_dept: "cpsc",
				courses_id: "449",
				courses_avg: 92.5
			},
			{
				courses_dept: "cpsc",
				courses_id: "490",
				courses_avg: 92.4
			},
			{
				courses_dept: "cpsc",
				courses_id: "490",
				courses_avg: 92.4
			},
			{
				courses_dept: "cpsc",
				courses_id: "490",
				courses_avg: 92
			},
			{
				courses_dept: "cpsc",
				courses_id: "490",
				courses_avg: 92
			},
			{
				courses_dept: "cpsc",
				courses_id: "501",
				courses_avg: 92.43
			},
			{
				courses_dept: "cpsc",
				courses_id: "501",
				courses_avg: 92.43
			},
			{
				courses_dept: "cpsc",
				courses_id: "501",
				courses_avg: 92.75
			},
			{
				courses_dept: "cpsc",
				courses_id: "501",
				courses_avg: 92.75
			},
			{
				courses_dept: "cpsc",
				courses_id: "501",
				courses_avg: 94
			},
			{
				courses_dept: "cpsc",
				courses_id: "501",
				courses_avg: 94
			},
			{
				courses_dept: "cpsc",
				courses_id: "503",
				courses_avg: 94.5
			},
			{
				courses_dept: "cpsc",
				courses_id: "503",
				courses_avg: 94.5
			},
			{
				courses_dept: "cpsc",
				courses_id: "507",
				courses_avg: 91.79
			},
			{
				courses_dept: "cpsc",
				courses_id: "507",
				courses_avg: 91.79
			},
			{
				courses_dept: "cpsc",
				courses_id: "527",
				courses_avg: 91.22
			},
			{
				courses_dept: "cpsc",
				courses_id: "527",
				courses_avg: 91.22
			},
			{
				courses_dept: "cpsc",
				courses_id: "540",
				courses_avg: 91.22
			},
			{
				courses_dept: "cpsc",
				courses_id: "540",
				courses_avg: 91.22
			},
			{
				courses_dept: "cpsc",
				courses_id: "589",
				courses_avg: 95
			},
			{
				courses_dept: "cpsc",
				courses_id: "589",
				courses_avg: 95
			}
		];
		this.timeout(5000);
		try {
			return chai.request(SERVER_URL)
				.post("/query")
				.send(q)
				.then(function (res: Response) {
					// some logging here please!
					expect(res.status).to.be.equal(200);
					expect(res.body.result).to.be.an.instanceOf(Array);
					expect(res.body.result).to.have.length(30);
					expect(res.body.result).to.have.deep.members(expected);
				})
				.catch(function (err: any) {
					console.log(err);
					expect.fail();
				});
		} catch (err) {
			console.log(err);
			// and some more logging here!
		}
	});

	it("POST rooms query", function () {
		let q = {
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
					"courses_year",
					"cpass"
				],
				ORDER: {
					dir: "UP",
					keys: [
						"cpass"
					]
				}
			},
			TRANSFORMATIONS: {
				GROUP: [
					"courses_year"
				],
				APPLY: [
					{
						cpass: {
							SUM: "courses_pass"
						}
					}
				]
			}
		};
		let expected = [
			{
				courses_year: 2008,
				cpass: 162
			},
			{
				courses_year: 2007,
				cpass: 358
			},
			{
				courses_year: 2009,
				cpass: 408
			},
			{
				courses_year: 2016,
				cpass: 466
			},
			{
				courses_year: 2011,
				cpass: 706
			},
			{
				courses_year: 2010,
				cpass: 732
			},
			{
				courses_year: 2012,
				cpass: 1045
			},
			{
				courses_year: 2013,
				cpass: 1308
			},
			{
				courses_year: 2014,
				cpass: 1492
			},
			{
				courses_year: 2015,
				cpass: 1492
			},
			{
				courses_year: 1900,
				cpass: 6973
			}
		];
		this.timeout(5000);
		try {
			return chai.request(SERVER_URL)
				.post("/query")
				.send(q)
				.then(function (res: Response) {
					// some logging here please!
					expect(res.status).to.be.equal(200);
					expect(res.body.result).to.be.an.instanceOf(Array);
					expect(res.body.result).to.have.length(11);
					expect(res.body.result).to.have.deep.members(expected);
				})
				.catch(function (err: any) {
					console.log(err);
					expect.fail();
				});
		} catch (err) {
			console.log(err);
			// and some more logging here!
		}
	});

	it("POST complex query", function () {
		let q = {
			WHERE: {
				AND: [
					{
						IS: {
							rooms_furniture: "*Tables*"
						}
					},
					{
						GT: {
							rooms_seats: 300
						}
					}
				]
			},
			OPTIONS: {
				COLUMNS: [
					"rooms_shortname",
					"maxSeats"
				],
				ORDER: {
					dir: "DOWN",
					keys: [
						"maxSeats"
					]
				}
			},
			TRANSFORMATIONS: {
				GROUP: [
					"rooms_shortname"
				],
				APPLY: [
					{
						maxSeats: {
							MAX: "rooms_seats"
						}
					}
				]
			}
		};
		let expected = [
			{
				rooms_shortname: "OSBO",
				maxSeats: 442
			},
			{
				rooms_shortname: "HEBB",
				maxSeats: 375
			},
			{
				rooms_shortname: "LSC",
				maxSeats: 350
			}
		];
		this.timeout(5000);
		try {
			return chai.request(SERVER_URL)
				.post("/query")
				.send(q)
				.then(function (res: Response) {
					// some logging here please!
					expect(res.status).to.be.equal(200);
					expect(res.body.result).to.be.an.instanceOf(Array);
					expect(res.body.result).to.have.length(3);
					expect(res.body.result).to.have.deep.members(expected);
				})
				.catch(function (err: any) {
					console.log(err);
					expect.fail();
				});
		} catch (err) {
			console.log(err);
			// and some more logging here!
		}
	});

	it("POST invalid query", function () {
		let q = {
			WHERE: {
				OR: [
					{
						AND: [
							{
								GT: {
									courses1_avg: 91
								}
							},
							{
								IS: {
									courses_dept: "cpsc"
								}
							}
						]
					},
					{
						EQ: {
							courses_avg: 99
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
				ORDER: "courses_id"
			}
		};
		this.timeout(5000);
		try {
			return chai.request(SERVER_URL)
				.post("/query")
				.send(q)
				.then(function (res: Response) {
					// some logging here please!
					expect(res.status).to.be.equal(400);
					console.log(res.body);
				})
				.catch(function (err: any) {
					console.log(err);
					expect.fail();
				});
		} catch (err) {
			console.log(err);
			// and some more logging here!
		}
	});

	it("POST restart server query", async function () {
		await server.stop();
		server = new Server(4444);
		await server.start();
		let q = {
			WHERE: {
				AND: [
					{
						IS: {
							rooms_furniture: "*Tables*"
						}
					},
					{
						GT: {
							rooms_seats: 300
						}
					}
				]
			},
			OPTIONS: {
				COLUMNS: [
					"rooms_shortname",
					"maxSeats"
				],
				ORDER: {
					dir: "DOWN",
					keys: [
						"maxSeats"
					]
				}
			},
			TRANSFORMATIONS: {
				GROUP: [
					"rooms_shortname"
				],
				APPLY: [
					{
						maxSeats: {
							MAX: "rooms_seats"
						}
					}
				]
			}
		};
		let expected = [
			{
				rooms_shortname: "OSBO",
				maxSeats: 442
			},
			{
				rooms_shortname: "HEBB",
				maxSeats: 375
			},
			{
				rooms_shortname: "LSC",
				maxSeats: 350
			}
		];
		this.timeout(5000);
		try {
			return chai.request("http://localhost:4444")
				.post("/query")
				.send(q)
				.then(function (res: Response) {
					// some logging here please!
					expect(res.status).to.be.equal(200);
					expect(res.body.result).to.be.an.instanceOf(Array);
					expect(res.body.result).to.have.length(3);
					expect(res.body.result).to.have.deep.members(expected);
				})
				.catch(function (err: any) {
					console.log(err);
					expect.fail();
				});
		} catch (err) {
			console.log(err);
			// and some more logging here!
		}
	});

	it("should test datasetNotInQueriedFacade", async function() {
		this.timeout(10000);
		clearDisk();
		let insightFacade = new InsightFacade();
		let insightFacade2 = new InsightFacade();
		await insightFacade.addDataset("coursesx", courses, InsightDatasetKind.Courses);
		await insightFacade2.addDataset("roomsx", rooms, InsightDatasetKind.Rooms);
		let datasetNotInQueriedFacade = {
			WHERE: {
				GT: {
					coursesx_avg: 97
				}
			},
			OPTIONS: {
				COLUMNS: [
					"coursesx_dept",
					"coursesx_avg"
				],
				ORDER: "coursesx_avg"
			}
		};
		let returnedQuery;
		try {
			returnedQuery = await insightFacade2.performQuery(datasetNotInQueriedFacade);
			expect.fail("Should have rejected!");
		} catch (err) {
			console.log(err);
			expect(err).to.be.instanceof(InsightError);
		}
	});

	// it("POST init", function () {
	// 	this.timeout(10000);
	// 	clearDisk();
	// 	try {
	// 		return chai.request(SERVER_URL)
	// 			.post("/init")
	// 			.then(function (res: Response) {
	// 				// some logging here please!
	// 				expect(res.status).to.be.equal(200);
	// 				console.log(res.body);
	// 			})
	// 			.catch(function (err: any) {
	// 				console.log(err);
	// 				expect.fail();
	// 			});
	// 	} catch (err) {
	// 		console.log(err);
	// 		// and some more logging here!
	// 	}
	// });
});

