import * as fs from "fs-extra";

const persistDir = "./data";

function getContentFromArchives(name: string): string {
	return fs.readFileSync("test/resources/archives/kevincgc/" + name).toString("base64");
}
function clearDisk(): void {
	fs.removeSync(persistDir);
}
function sleep(delay: number) {
	new Promise((resolve) => setTimeout(resolve, delay));
}
export {getContentFromArchives, persistDir, clearDisk, sleep};

