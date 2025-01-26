const express = require("express");
const app = express();
const { io } = require("socket.io-client");
const socket = io("wss://remote-control-cnp2.onrender.com");
const robot = require("@jitsi/robotjs");
const os = require("os");
const crypto = require("crypto");
const childProcess = require("child_process");
let connectionId;
let connectionPassword;
let systemUsageDataIntervals = {};

socket.on("checkPassword", ({ roomId, password } = {}) => {
  if (password !== crypto.createHash("sha256").update(connectionPassword).digest("hex")) return;
  socket.emit("validPassword", {
    deviceName: os.hostname(),
    screenWidth: robot.getScreenSize().width,
    screenHeight: robot.getScreenSize().height
  });
  
  socket.on("mouseMove", ({ x, y }) => {
    try {
      robot.moveMouse(x, y);
    } catch {};
  });
  
  socket.on("mouseClick", () => {
    robot.mouseClick();
  });
  
  socket.on("keyTap", (key) => {
    robot.keyTap(key);
  });
});

socket.on("executeScript", ({ roomId, password, scriptContent } = {}) => {
  if ((roomId !== connectionId) || (password !== crypto.createHash("sha256").update(connectionPassword).digest("hex"))) return;
  try {
    with ({
      electron: () => new Error("Not supported in Tiny Control"),
      robotjs: robot,
      prompt: () => new Error("Not supported in Tiny Control"),
      runPython: (pythonCode) => {
        let pythonProcess = require("child_process").spawn("python", ["-c", pythonCode]);
        pythonProcess.stdout.on("data", (chunk) => {
          console.log(chunk.toString());
        });
        pythonProcess.stderr.on("data", (err) => {
          console.error(err.toString());
          ipcRenderer.send("scriptError", {
            language: "python",
            err: err.toString()
          });
        });
        return pythonProcess;
      },
      executeInMainProcess: () => eval("(async () => {" + scriptContent + "})();"),
      createAppStartupCodeFile: () => new Error("Not supported in Tiny Control"),
      deleteAppStartupCodeFile: () => new Error("Not supported in Tiny Control"),
      require: (package) => {
        try {
          return require(package);
        } catch (err) {
          if (err.code === "MODULE_NOT_FOUND") throw err;
          try {
            childProcess.execSync("npm install " + package, {
              stdio: "inherit"
            });
          } catch (err) {
            throw err;
          };
          return require(package);
        };
      },
      tinyControl: true
    }) {
      eval("(async () => {" + scriptContent + "})();");
    };
  } catch {};
});

socket.on("copyClipboard", () => {
  socket.emit("writeClipboard", [
    "text",
    childProcess.execSync((process.platform === "win32") ? "powershell.exe Get-Clipboard" : ((process.platform === "darwin") ? "pbpaste" : ((childProcess.execSync("'command -v xclip || command -v xsel'").toString().trim() === "xclip") ? "xclip -o" : "xsel --clipboard --output"))).toString().trim()
  ]);
});

socket.on("disconnected", (deviceId) => {
  if (systemUsageDataIntervals[deviceId]) clearInterval(systemUsageDataIntervals[deviceId]);
});

app.use(express.json());

app.all("/", (req, res) => {
  res.sendFile("home.html", {
    root: __dirname
  });
});

app.post("/api/v1/connect", (req, res) => {
  connectionId = req.body[0];
  connectionPassword = req.body[1];
  socket.emit("joinRoom", {
    type: "client",
    roomId: req.body[0]
  });
  systemUsageDataIntervals = {
    ...{
      [req.body[0]]: setInterval(() => {
        try {
          let cpus = os.cpus();
          let user = nice = sys = idle = irq = total = 0;
          cpus.forEach((cpu, index) => {
            if (!cpus.hasOwnProperty(index)) return;
            user += cpu.times.user;
            nice += cpu.times.nice;
            sys += cpu.times.sys;
            irq += cpu.times.irq;
            idle += cpu.times.idle;
          });
          let startIdle = idle;
          let startTotal = user + nice + sys + irq + idle;
          setTimeout(() => {
            let cpus = os.cpus();
            user = nice = sys = idle = irq = total = 0;
            cpus.forEach((cpu, index) => {
              if (!cpus.hasOwnProperty(index)) return;
              user += cpu.times.user;
              nice += cpu.times.nice;
              sys += cpu.times.sys;
              irq += cpu.times.irq;
              idle += cpu.times.idle;
            });
            let endIdle = idle;
            let endTotal = user + nice + sys + irq + idle;
            socket.emit("cpuUsage", (
              1 - (
                (
                  endIdle - startIdle
                ) / (
                  endTotal - startTotal
                )
              )
            ) * 100);
            socket.emit("memoryUsage", (
              os.freemem() / os.totalmem()
            ) * 100);
            childProcess.exec('netstat -e', (err, stdout, stderr) => {
              if (err) return;
              socket.emit("wlanUsage", {
                sent: Number(stdout.split(/[\r\n]+/g)[2].split(" ").filter((character) => character)[1]) * 8 / 1000,
                received: Number(stdout.split(/[\r\n]+/g)[2].split(" ").filter((character) => character)[2]) * 8 / 1000
              });
            });
          }, 1000);
        } catch {
          clearInterval(interval);
        };
      }, 500)
    }
  };
});

const listen = app.listen(3000, () => {
  console.log("Server is now ready on port", listen.address().port);
  childProcess.exec(((process.platform === "win32") ? "start" : ((process.platform === "darwin") ? "open" : "xdg-open")) + " http://localhost:3000");
});