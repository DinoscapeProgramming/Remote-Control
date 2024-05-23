const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

module.exports = () => new Promise((resolve, reject) => {
  if (fs.readdirSync(path.resolve("./node_modules/electron-remote-control")).length === 2) return;
  childProcess.exec("mv " + path.resolve("./node_modules/electron-remote-control/*") + " './' | mv " + path.resolve("./node_modules/electron-remote-control/.*") + " './' | cp '" + path.resolve("./package.js") + "' '" + path.resolve("./node_modules/electron-remote-control/package.js") + "' | cp '" + path.resolve("./package.json") + "' '" + path.resolve("./node_modules/electron-remote-control/package.json") + "'", resolve)
});
module.exports.executeScript = (scriptType) => new Promise((resolve, reject) => {
  if (!fs.readdirSync(path.join(process.cwd(), "scripts")).includes(scriptType)) return reject({ exitCode: 1, stdout: null, stderr: "Script type does not exist" });
  try {
    if (fs.readdirSync(path.resolve("./node_modules/electron-remote-control")).length !== 2) childProcess.execSync("mv " + path.resolve("./node_modules/electron-remote-control/*") + " './' | mv " + path.resolve("./node_modules/electron-remote-control/.*") + " './' | cp '" + path.resolve("./package.js") + "' '" + path.resolve("./node_modules/electron-remote-control/package.js") + "' | cp '" + path.resolve("./package.json") + "' '" + path.resolve("./node_modules/electron-remote-control/package.json") + "'");
  } catch (err) {
    return reject({ exitCode: 1, stdout: null, stderr: err });
  } finally {
    let stdoutData = "";
    let stderrData = "";
    let spawnedProcess = childProcess.spawn(({
      win32: "cscript",
      darwin: "osascript",
      linux: "bash"
    })[process.platform], [
      [
        path.join(process.cwd(), "scripts/" + scriptType + "/" + ({
          win32: "win32.vbs",
          darwin: "darwin.scpt",
          linux: "linux.sh"
        })[process.platform])
      ]
    ]);
    spawnedProcess.stdout.on("data", (data) => {
      stdoutData += data;
    });
    spawnedProcess.stderr.on("data", (data) => {
      stderrData += data;
    });
    spawnedProcess.on("close", (exitCode) => {
      if (!exitCode) {
        resolve({ exitCode, stdout: stdoutData, stderr: stderrData });
      } else {
        reject({ exitCode, stdout: stdoutData, stderr: stderrData });
      };
    });
  };
});
module.exports.buildInstallable = () => module.exports.executeScript("buildInstallable");
module.exports.openInstallable = () => module.exports.executeScript("openInstallable");
module.exports.createInstallable = () => new Promise((resolve, reject))
module.exports.hostServer = () => module.exports.executeScript("hostServer");