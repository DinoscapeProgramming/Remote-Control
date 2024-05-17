const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

module.exports = () => new Promise((resolve, reject) => childProcess.exec("mv " + path.resolve("./node_modules/electron-remote-control/*") + " './' | mv " + path.resolve("./node_modules/electron-remote-control/.*") + " './' | cp '" + path.resolve("./package.js") + "' '" + path.resolve("./node_modules/electron-remote-control/package.js") + "' | cp '" + path.resolve("./package.json") + "' '" + path.resolve("./node_modules/electron-remote-control/package.json") + "'", resolve));
module.exports.buildInstallable = () => new Promise((resolve, reject) => childProcess.spawn(({
  win32: "cscript",
  darwin: "osascript",
  linux: "bash"
})[process.platform], [
  [
    path.join(process.cwd(), "scripts/buildInstallable/" + ({
      win32: "win32.vbs",
      darwin: "darwin.scpt",
      linux: "linux.sh"
    })[process.platform])
  ]
]).stdout.on('data', resolve));
module.exports.openInstallable = () => new Promise((resolve, reject) => childProcess.spawn(({
  win32: "cscript",
  darwin: "osascript",
  linux: "bash"
})[process.platform], [
  [
    path.join(process.cwd(), "scripts/openInstallable/" + ({
      win32: "win32.vbs",
      darwin: "darwin.scpt",
      linux: "linux.sh"
    })[process.platform])
  ]
]).stdout.on('data', resolve));
module.exports.hostServer = () => new Promise((resolve, reject) => childProcess.spawn(({
  win32: "cscript",
  darwin: "osascript",
  linux: "bash"
})[process.platform], [
  [
    path.join(process.cwd(), "scripts/hostServer/" + ({
      win32: "win32.vbs",
      darwin: "darwin.scpt",
      linux: "linux.sh"
    })[process.platform])
  ]
]).stdout.on('data', resolve));