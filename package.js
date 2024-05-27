const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

module.exports.executeScript = (scriptType) => new Promise((resolve, reject) => {
  if (!fs.readdirSync(path.join(__dirname, "scripts")).includes(scriptType)) return reject({ exitCode: 1, stdout: null, stderr: "Script type does not exist" });
  try {
    if (fs.readdirSync(path.resolve("./node_modules/electron-remote-control")).length !== 2) childProcess.execSync("mv " + path.resolve("./node_modules/electron-remote-control/*") + " './' | mv " + path.resolve("./node_modules/electron-remote-control/.*") + " './' | cp '" + path.resolve("./package.js") + "' '" + path.resolve("./node_modules/electron-remote-control/package.js") + "' | cp '" + path.resolve("./package.json") + "' '" + path.resolve("./node_modules/electron-remote-control/package.json") + "'", {
      stdio: "ignore"
    });
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
module.exports.fullyBuildAndOpenInstallable = () => {
  module.exports.buildInstallable({ stdout }).then(() => { // may take a while; uses electron-builder
    console.log(stdout);
    module.exports.openInstallable({ stdout }).then(() => {
      console.log(stdout);
    }).catch(({ stderr }) => {
      throw stderr;
    });
  }).catch(({ exitCode, stderr }) => {
    throw stderr;
  });
};
module.exports.hostServer = () => module.exports.executeScript("hostServer");
module.exports.fullyHostServer = () => {
  module.exports.hostServer().then(({ stdout }) => { // may take a while; port :3000 opens
    console.log(stdout);
  }).catch(({ stderr }) => {
    throw stderr;
  });
};