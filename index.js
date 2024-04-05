const childProcess = require("child_process");

module.exports = {
  buildInstallable: () => new Promise((resolve, reject) => childProcess.exec("cd client; npm run build", resolve)),
  openInstallable: () => new Promise((resolve, reject) => childProcess.exec("./client/build/*.exe", resolve)),
  hostServer: () => new Promise((resolve, reject) => childProcess.exec("cd server; node . ", resolve))
};