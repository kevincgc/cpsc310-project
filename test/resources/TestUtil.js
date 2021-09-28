"use strict";
exports.__esModule = true;
exports.clearDisk = exports.persistDir = exports.getContentFromArchives = void 0;
var fs = require("fs-extra");
var persistDir = "./data";
exports.persistDir = persistDir;
function getContentFromArchives(name) {
    return fs.readFileSync("test/resources/archives/kevincgc/" + name).toString("base64");
}
exports.getContentFromArchives = getContentFromArchives;
console.log(getContentFromArchives("courses_10.zip"));
function clearDisk() {
    fs.removeSync(persistDir);
}
exports.clearDisk = clearDisk;
