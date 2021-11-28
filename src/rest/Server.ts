import express, {Application, Request, Response} from "express";
import * as http from "http";
import cors from "cors";
import InsightFacade from "../controller/InsightFacade";
import {InsightDatasetKind, InsightError, NotFoundError} from "../controller/IInsightFacade";
import {clearDisk, getContentFromArchives} from "../../test/resources/TestUtil";

export default class Server {
	private readonly port: number;
	private express: Application;
	private server: http.Server | undefined;
	private static insightFacade: InsightFacade;

	constructor(port: number) {
		console.info(`Server::<init>( ${port} )`);
		this.port = port;
		this.express = express();

		this.registerMiddleware();
		this.registerRoutes();
		// NOTE: you can serve static frontend files in from your express server
		// by uncommenting the line below. This makes files in ./frontend/public
		// accessible at http://localhost:<port>/
		// this.express.use(express.static("./frontend/public"))
	}

	/**
	 * Starts the server. Returns a promise that resolves if success. Promises are used
	 * here because starting the server takes some time and we want to know when it
	 * is done (and if it worked).
	 *
	 * @returns {Promise<void>}
	 */
	public start(): Promise<void> {
		Server.insightFacade = new InsightFacade();
		return new Promise((resolve, reject) => {
			console.info("Server::start() - start");
			if (this.server !== undefined) {
				console.error("Server::start() - server already listening");
				reject();
			} else {
				this.server = this.express.listen(this.port, () => {
					console.info(`Server::start() - server listening on port: ${this.port}`);
					resolve();
				}).on("error", (err: Error) => {
					// catches errors in server start
					console.error(`Server::start() - server ERROR: ${err.message}`);
					reject(err);
				});
			}
		});
	}

	/**
	 * Stops the server. Again returns a promise so we know when the connections have
	 * actually been fully closed and the port has been released.
	 *
	 * @returns {Promise<void>}
	 */
	public stop(): Promise<void> {
		console.info("Server::stop()");
		return new Promise((resolve, reject) => {
			if (this.server === undefined) {
				console.error("Server::stop() - ERROR: server not started");
				reject();
			} else {
				this.server.close(() => {
					console.info("Server::stop() - server closed");
					resolve();
				});
			}
		});
	}

	// Registers middleware to parse request before passing them to request handlers
	private registerMiddleware() {
		// JSON parser must be place before raw parser because of wildcard matching done by raw parser below
		this.express.use(express.json());
		this.express.use(express.raw({type: "application/*", limit: "10mb"}));

		// enable cors in request headers to allow cross-origin HTTP requests
		this.express.use(cors());
	}

	// Registers all request handlers to routes
	private registerRoutes() {
		// This is an example endpoint this you can invoke by accessing this URL in your browser:
		// http://localhost:4321/echo/hello
		this.express.get("/echo/:msg", Server.echo);
		this.express.put("/dataset/:id/:kind", Server.addDataset);
		this.express.delete("/dataset/:id", Server.removeDataset);
		this.express.post("/query", Server.performQuery);
		this.express.get("/datasets", Server.listDatasets);
		this.express.post("/init", Server.init);
	}

	private static getKind(kind: string): InsightDatasetKind{
		if (kind === "courses") {
			return InsightDatasetKind.Courses;
		} else if (kind === "rooms") {
			return InsightDatasetKind.Rooms;
		} else {
			throw new InsightError("addDataset invalid InsightDatasetKind");
		}
	}

	private static async addDataset(req: Request, res: Response) {
		try {
			let kind: InsightDatasetKind = Server.getKind(req.params.kind);
			let data = Buffer.from(req.body).toString();
			console.log(`Server::addDataset(..) - params: ${JSON.stringify(req.params)}`);
			const response = await Server.insightFacade.addDataset(req.params.id, data, kind);
			res.status(200).json({result: response});
		} catch (err) {
			console.log(err);
			if (err instanceof InsightError) {
				res.status(400).json({error: err});
			} else {
				throw err;
			}
		}
	}

	private static async removeDataset(req: Request, res: Response) {
		try {
			console.log(`Server::removeDatasets(..) - params: ${JSON.stringify(req.params)}`);
			const response = await Server.insightFacade.removeDataset(req.params.id);
			res.status(200).json({result: response});
		} catch (err) {
			console.log(err);
			if (err instanceof InsightError) {
				res.status(400).json({error: err});
			} else if (err instanceof NotFoundError) {
				res.status(404).json({error: err});
			} else {
				throw err;
			}
		}
	}

	private static async listDatasets(req: Request, res: Response) {
		console.log(`Server::listDatasets(..) - params: ${JSON.stringify(req.params)}`);
		const response = await Server.insightFacade.listDatasets();
		res.status(200).json({result: response});
	}

	private static async performQuery(req: Request, res: Response) {
		try {
			console.log(`Server::performQuery(..) - params: ${JSON.stringify(req.params)}`);
			console.log(req.body);
			const response = await Server.insightFacade.performQuery(req.body);
			res.status(200).json({result: response});
		} catch (err) {
			console.log(err);
			if (err instanceof InsightError) {
				res.status(400).json({error: err});
			} else {
				throw err;
			}
		}
	}

	// The next two methods handle the echo service.
	// These are almost certainly not the best place to put these, but are here for your reference.
	// By updating the Server.echo function pointer above, these methods can be easily moved.
	private static echo(req: Request, res: Response) {
		try {
			console.log(`Server::echo(..) - params: ${JSON.stringify(req.params)}`);
			const response = Server.performEcho(req.params.msg);
			res.status(200).json({result: response});
		} catch (err) {
			res.status(400).json({error: err});
		}
	}

	private static performEcho(msg: string): string {
		if (typeof msg !== "undefined" && msg !== null) {
			return `${msg}...${msg}`;
		} else {
			return "Message not provided";
		}
	}

	private static async init(req: Request, res: Response) {
		try {
			console.log(`Server::init(..) - params: ${JSON.stringify(req.params)}`);
			let rooms = getContentFromArchives("rooms.zip");
			let courses = getContentFromArchives("courses.zip");
			clearDisk();
			let c: InsightDatasetKind = InsightDatasetKind.Courses;
			let r: InsightDatasetKind = InsightDatasetKind.Rooms;
			const cresponse = await Server.insightFacade.addDataset("courses", courses, c);
			const rresponse = await Server.insightFacade.addDataset("rooms", rooms, r);
			res.status(200).json({result: "success"});
		} catch (err) {
			console.log(err);
			if (err instanceof InsightError) {
				res.status(400).json({error: err});
			} else {
				throw err;
			}
		}
	}
}
