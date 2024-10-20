const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

module.exports.moveProject = () => new Promise((resolve, reject) => {
  try {
    let stdoutData = "";
    let stderrData = "";
    let spawnedProcess;
    if (fs.readdirSync(path.resolve("./node_modules/electron-remote-control")).length !== 4) {
      fs.writeFileSync("./node_modules/electron-remote-control/package.json", JSON.stringify(Object.assign({
        ...JSON.parse(fs.readFileSync("./package.json", "utf8") || "{}") || {},
        ...JSON.parse(fs.readFileSync("./node_modules/electron-remote-control/package.json", "utf8") || "{}") || {}
      }, ...["scripts", "keywords", "bin"].map((key) => ({
        [key]: ((key === "keywords") ? Object.values : ((value) => value))({
          ...(JSON.parse(fs.readFileSync("./package.json", "utf8") || "{}") || {})[key] || {},
          ...(JSON.parse(fs.readFileSync("./node_modules/electron-remote-control/package.json", "utf8") || "{}") || {})[key] || {}
        })
      }))), null, 2), "utf8");
      spawnedProcess = childProcess.execSync(((process.platform === "win32") ? "del '" : "rm '") + path.resolve("./package.json") + ((process.platform === "win32") ? "'; move '" : "' && mv '") + path.resolve("./node_modules/electron-remote-control/*") + ((process.platform === "win32") ? "' '.\\'; move '" : "' './' && mv '") + path.resolve("./node_modules/electron-remote-control/.*") + ((process.platform === "win32") ? "' '.\\'; copy '" : "' './' && cp '") + path.resolve("./package.js") + "' '" + path.resolve("./node_modules/electron-remote-control/package.js") + ((process.platform === "win32") ? "'; copy '" : "' && cp '") + path.resolve("./package.json") + "' '" + path.resolve("./node_modules/electron-remote-control/package.json") + ((process.platform === "win32") ? "'; md '" : "' && mkdir '") + path.resolve("./node_modules/electron-remote-control/bin") + ((process.platform === "win32") ? "'; xcopy /E /I '" : "' && cp - R '") + path.resolve("./bin/*") + "' '" + path.resolve("./node_modules/electron-remote-control/bin") + ((process.platform === "win32") ? "'; md '" : "' && mkdir '") + path.resolve("./node_modules/electron-remote-control/scripts") + ((process.platform === "win32") ? "'; xcopy /E /I '" : "' && cp -R '") + path.resolve("./scripts/*") + "' '" + path.resolve("./node_modules/electron-remote-control/scripts") + "'", {
        ...{
          detached: true,
          stdio: "inherit",
          env: {
            ...process.env,
            ...{
              FORCE_COLOR: true
            }
          }
        },
        ...(process.platform === "win32") ? {
          shell: "powershell.exe"
        } : {}
      });
      spawnedProcess.stdout.on("data", (data) => {
        console.log(data.toString());
        stdoutData += data.toString();
      });
      spawnedProcess.stderr.on("data", (data) => {
        console.log(data.toString());
        stderrData += data.toString();
      });
    };
    resolve({ exitCode: 0, stdout: stdoutData ?? ("Already moved project to " + process.cwd()), stderr: stderrData });
  } catch (err) {
    reject({ exitCode: 1, stdout: null, stderr: err });
  };
});
module.exports.executeScript = (scriptType) => new Promise((resolve, reject) => {
  if (!fs.readdirSync(path.join(__dirname, "scripts")).includes(scriptType)) return reject({ exitCode: 1, stdout: null, stderr: "Script type does not exist" });
  try {
    if (fs.readdirSync(path.resolve("./node_modules/electron-remote-control")).length !== 4) {
      fs.writeFileSync("./node_modules/electron-remote-control/package.json", JSON.stringify(Object.assign({
        ...JSON.parse(fs.readFileSync("./package.json", "utf8") || "{}") || {},
        ...JSON.parse(fs.readFileSync("./node_modules/electron-remote-control/package.json", "utf8") || "{}") || {}
      }, ...["scripts", "keywords", "bin"].map((key) => ({
        [key]: ((key === "keywords") ? Object.values : ((value) => value))({
          ...(JSON.parse(fs.readFileSync("./package.json", "utf8") || "{}") || {})[key] || {},
          ...(JSON.parse(fs.readFileSync("./node_modules/electron-remote-control/package.json", "utf8") || "{}") || {})[key] || {}
        })
      }))), null, 2), "utf8");
      childProcess.execSync(((process.platform === "win32") ? "del '" : "rm '") + path.resolve("./package.json") + ((process.platform === "win32") ? "'; move '" : "' && mv '") + path.resolve("./node_modules/electron-remote-control/*") + ((process.platform === "win32") ? "' '.\\'; move '" : "' './' && mv '") + path.resolve("./node_modules/electron-remote-control/.*") + ((process.platform === "win32") ? "' '.\\'; copy '" : "' './' && cp '") + path.resolve("./package.js") + "' '" + path.resolve("./node_modules/electron-remote-control/package.js") + ((process.platform === "win32") ? "'; copy '" : "' && cp '") + path.resolve("./package.json") + "' '" + path.resolve("./node_modules/electron-remote-control/package.json") + ((process.platform === "win32") ? "'; md '" : "' && mkdir '") + path.resolve("./node_modules/electron-remote-control/bin") + ((process.platform === "win32") ? "'; xcopy /E /I '" : "' && cp - R '") + path.resolve("./bin/*") + "' '" + path.resolve("./node_modules/electron-remote-control/bin") + ((process.platform === "win32") ? "'; md '" : "' && mkdir '") + path.resolve("./node_modules/electron-remote-control/scripts") + ((process.platform === "win32") ? "'; xcopy /E /I '" : "' && cp -R '") + path.resolve("./scripts/*") + "' '" + path.resolve("./node_modules/electron-remote-control/scripts") + "'", {
        ...{
          stdio: "ignore"
        },
        ...(process.platform === "win32") ? {
          shell: "powershell.exe"
        } : {}
      });
    };
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
    ], {
      env: {
        ...process.env,
        ...{
          FORCE_COLOR: true
        }
      }
    });
    spawnedProcess.stdout.on("data", (data) => {
      console.log(data.toString());
      stdoutData += data.toString();
    });
    spawnedProcess.stderr.on("data", (data) => {
      console.log(data.toString());
      stderrData += data.toString();
    });
    spawnedProcess.on("close", (exitCode) => {
      reject({ exitCode, stdout: stdoutData, stderr: stderrData });
    });
  };
});
module.exports.buildInstallable = () => module.exports.executeScript("buildInstallable"); // deprecated; backwards compatibility
module.exports.openInstallable = () => module.exports.executeScript("openInstallable"); // deprecated; backwards compatibility
module.exports.fullyBuildAndOpenInstallable = () => { // deprecated; backwards compatibility
  module.exports.buildInstallable().then(() => {
    module.exports.openInstallable();
  });
};
module.exports.buildClient = module.exports.developerBuild = () => module.exports.executeScript("buildClient"); // buildClient recommended; developerBuild is deprecated
module.exports.hostServer = module.exports.fullyHostServer = () => module.exports.executeScript("hostServer"); // hostServer recommended; fullyHostServer is deprecated