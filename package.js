const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

module.exports = () => new Promise((resolve, reject) => childProcess.exec("mv " + path.resolve("./node_modules/electron-remote-control/*") + " './'", (...moveFilesResponse) => childProcess.exec("mv " + path.resolve("./node_modules/electron-remote-control/.*") + " './'", (...moveDotfilesResponse) => resolve({ moveFilesResponse, moveDotfilesResponse }))));
module.exports.buildInstallable = () => new Promise((resolve, reject) => childProcess.exec("cd '" + path.resolve("./server") + "' | npm install | npm run build", resolve));
module.exports.openInstallable = () => new Promise((resolve, reject) => childProcess.execFile(path.resolve("./client/build/*.exe"), resolve));
module.exports.hostServer = () => new Promise((resolve, reject) => childProcess.exec("cd '" + path.resolve("./server") + "' | npm install | node . ", resolve));