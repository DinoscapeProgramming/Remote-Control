#! /usr/bin/env node
const path = require("path");
const childProcess = require("child_process");

if (!["win32", "darwin", "linux"].includes(process.platform) || process.argv.slice(2).map((argument) => ["-mwl", "--win", "--mac", "--darwin", "--linux"].includes(argument)).includes(false)) process.exit(1);
try {
  let spawnedProcess = childProcess.execFile(path.parse(__dirname).root + "'" + path.resolve("./node_modules/.bin/electron-builder" + ((process.platform === "win32") ? ".cmd" : "")).substring(path.parse(__dirname).root.length) + "'", Array.from(new Set(process.argv.slice(2))), {
    ...{
      shell: "powershell.exe",
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
  spawnedProcess.stdout.on("data", (data) => console.log(data.toString()));
} catch (err) {
  throw new Error(err.message);
};