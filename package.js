const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

module.exports = () => new Promise((resolve, reject) => childProcess.exec("mv " + path.resolve("./node_modules/electron-remote-control/*") + " './' | mv " + path.resolve("./node_modules/electron-remote-control/.*") + " './' | cp '" + path.resolve("./package.js") + "' '" + path.resolve("./node_modules/electron-remote-control/package.js") + "' | cp '" + path.resolve("./package.json") + "' '" + path.resolve("./node_modules/electron-remote-control/package.json") + "'", resolve));
module.exports.buildInstallable = () => new Promise((resolve, reject) => childProcess.spawn(({
  win32: "cscript",
  darwin: "osascript",
  linux: "bash"
})[parent.process.platform], [
  [
    path.join(__dirname, "scripts/buildInstallable/" + ({
      win32: "win32.vbs",
      darwin: "darwin.scpt",
      linux: "linux.sh"
    })[parent.process.platform])
  ]
]).stdout.on('data', resolve));
module.exports.openInstallable = () => new Promise((resolve, reject) => childProcess.spawn(({
  win32: "cscript",
  darwin: "osascript",
  linux: "bash"
})[parent.process.platform], [
  [
    path.join(__dirname, "scripts/openInstallable/" + ({
      win32: "win32.vbs",
      darwin: "darwin.scpt",
      linux: "linux.sh"
    })[parent.process.platform])
  ]
]).stdout.on('data', resolve));
module.exports.hostServer = () => new Promise((resolve, reject) => childProcess.spawn(({
  win32: "cscript",
  darwin: "osascript",
  linux: "bash"
})[parent.process.platform], [
  [
    path.join(__dirname, "scripts/hostServer/" + ({
      win32: "win32.vbs",
      darwin: "darwin.scpt",
      linux: "linux.sh"
    })[parent.process.platform])
  ]
]).stdout.on('data', resolve));