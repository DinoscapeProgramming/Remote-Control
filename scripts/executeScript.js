const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

if (!["win32", "darwin", "linux"].includes(process.platform) || !fs.readdirSync("./scripts").filter((folderItem) => folderItem !== "executeScript.js").map((folderItem) => "--" + folderItem).includes(process.argv[2])) process.exit(1);
try {
  if (process.argv[2] === "--moveProject") {
    require("../package.js").moveProject();
  } else {
    childProcess.spawn(({
      win32: "cscript",
      darwin: "osascript",
      linux: "bash"
    })[process.platform], [
      [
        "./scripts/" + process.argv[2].substring(2) + "/" + ({
          win32: "win32.vbs",
          darwin: "darwin.scpt",
          linux: "linux.sh"
        })[process.platform]
      ],
      ...(process.argv.find((argument) => argument.startsWith("--amount="))) ? [
        [
          [
            process.argv.find((argument) => argument.startsWith("--amount="))
          ]
        ]
      ] : []
    ], {
      stdio: "inherit"
    });
  };
} catch (err) {
  throw new Error(err.message);
};