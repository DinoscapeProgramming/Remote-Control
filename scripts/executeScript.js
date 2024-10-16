const fs = require("fs");
const childProcess = require("child_process");

if (!["win32", "darwin", "linux"].includes(process.platform) || !fs.readdirSync("./scripts").filter((folderItem) => folderItem !== "executeScript.js").map((folderItem) => "--" + folderItem).includes(process.argv[2])) process.exit(1);
try {
  childProcess.spawn(({
    win32: "cscript",
    darwin: "osascript",
    linux: "bash"
  })[process.platform], [
    [
      path.join(process.cwd(), "scripts/" + process.argv[2].substring(2) + "/" + ({
        win32: "win32.vbs",
        darwin: "darwin.scpt",
        linux: "linux.sh"
      })[process.platform])
    ]
  ]);
} catch {};