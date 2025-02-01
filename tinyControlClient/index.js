/*global.window = global;
global.window.postMessage = () => {};
global.window.navigator = {
  userAgent: require("os").hostname()
};
global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
global.RTCPeerConnection = require("electron-webrtc")().RTCPeerConnection;
global.RTCSessionDescription = require("electron-webrtc")().RTCSessionDescription;
global.RTCIceCandidate = require("electron-webrtc")().RTCIceCandidate;
global.RTCDataChannel = require("electron-webrtc")().RTCDataChannel;
global.WebSocket = require("ws");
global.location = {
  protocol: "http"
};
global.File = class {
  constructor(buffer, name, options = {}) {
    this.buffer = buffer;
    this.name = name;
    this.size = buffer.length;
    this.type = options.type || "";
    this.lastModified = options.lastModified || Date.now();
  };

  async text() {
    return this.buffer.toString("utf-8");
  };

  async arrayBuffer() {
    return this.buffer.buffer.slice(this.buffer.byteOffset, this.buffer.byteOffset + this.buffer.byteLength);
  };

  async stream() {
    const { Readable } = require("stream");
    return Readable.from(this.buffer);
  };

  async slice(start = 0, end = this.size, contentType = this.type) {
    return new File(this.buffer.slice(start, end), this.name, { type: contentType });
  };
};
global.FileReader = class {
  constructor() {
    this.result = null;
    this.onload = null;
    this.onerror = null;
  };

  readAsText(file) {
    try {
      this.result = file.buffer.toString("utf-8");
      console.log(this.result);
      if (this.onload) this.onload({ target: this });
    } catch (err) {
      if (this.onerror) this.onerror(err);
    };
  };

  readAsArrayBuffer(file) {
    try {
      this.result = file.buffer.buffer.slice(file.buffer.byteOffset, file.buffer.byteOffset + file.buffer.byteLength);
      console.log(this.result);
      if (this.onload) this.onload({ target: this });
    } catch (err) {
      if (this.onerror) this.onerror(err);
    };
  };

  readAsDataURL(file) {
    try {
      this.result = `data:${file.type};base64,${file.buffer.toString("base64")}`;
      console.log(this.result);
      if (this.onload) this.onload({ target: this });
    } catch (err) {
      if (this.onerror) this.onerror(err);
    };
  };
};*/
const express = require("express");
const app = express();
const { io } = require("socket.io-client");
const socket = io("wss://remote-control-cnp2.onrender.com");
/*const { Peer } = require("@its-forked/peerjs-on-node");
const peer = new Peer(null, {
  host: "remote-control-cnp2.onrender.com",
  port: 443,
  path: "/peer",
  secure: true
});*/
const robot = require("@jitsi/robotjs");
const os = require("os");
const zlib = require("zlib");
const crypto = require("crypto");
const childProcess = require("child_process");
let connectionId;
let connectionPassword;
let systemUsageDataIntervals = {};

socket.on("checkPassword", ({ password } = {}) => {
  if (password !== crypto.createHash("sha256").update(connectionPassword).digest("hex")) return;
  socket.emit("validPassword", {
    deviceName: os.hostname(),
    screenWidth: robot.getScreenSize().width,
    screenHeight: robot.getScreenSize().height
  });

  setInterval(() => {
    let rawPixelData = robot.captureScreen().image;
    let filteredData = Buffer.alloc(((robot.getScreenSize().width * 4) + 1) * robot.getScreenSize().height);
    for (let i = 0; i < robot.getScreenSize().height; i++) {
      filteredData[i * ((robot.getScreenSize().width * 4) + 1)] = 0;
      rawPixelData.copy(filteredData, (i * ((robot.getScreenSize().width * 4)) + 1) + 1, i * robot.getScreenSize().width * 4, (i + 1) * robot.getScreenSize().width * 4);
    };
    let ihdrData = Buffer.alloc(13);
    ihdrData.writeUInt32BE(robot.getScreenSize().width, 0);
    ihdrData.writeUInt32BE(robot.getScreenSize().height, 4);
    ihdrData.writeUInt8(8, 8);
    ihdrData.writeUInt8(6, 9);
    ihdrData.writeUInt8(0, 10);
    ihdrData.writeUInt8(0, 11);
    ihdrData.writeUInt8(0, 12);
    let createChunk = (type, data) => {
      let length = Buffer.alloc(4);
      length.writeUint32BE(data.length, 0);
      let crc32 = 0xffffffff;
      let buffer = Buffer.concat([
        Buffer.from(type, "ascii"),
        data
      ]);
      for (let i = 0; i < buffer.length; i++) {
        crc32 ^= buffer[i];
        for (let j = 0; j < 8; j++) {
          if (crc32 & 1) {
            crc32 = (crc32 >>> 1) ^ 0xedb88320;
          } else {
            crc32 >>>= 1;
          };
        };
      };
      return Buffer.concat([
        length,
        Buffer.from(type, "ascii"),
        data,
        Buffer.from([
          (crc32 ^ 0xffffffff) >>> 24,
          (crc32 ^ 0xffffffff) >>> 16,
          (crc32 ^ 0xffffffff) >>> 8,
          (crc32 ^ 0xffffffff) & 0xff
        ])
      ]);
    };
    socket.emit("screenImage", Buffer.concat([
      Buffer.from([
        137,
        80,
        78,
        71,
        13,
        10,
        26,
        10
      ]),
      createChunk("IHDR", ihdrData),
      createChunk("IDAT", zlib.deflateSync(filteredData)),
      createChunk("IEND", Buffer.alloc(0))
    ]));
  });
  
  socket.on("mouseMove", ({ x, y }) => {
    try {
      robot.moveMouse(x, y);
    } catch {};
  });
  
  socket.on("mouseClick", () => {
    try {
      robot.mouseClick();
    } catch {};
  });
  
  socket.on("keyTap", (key) => {
    try {
      robot.keyTap(key);
    } catch {};
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