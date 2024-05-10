window.addEventListener("message", ({ data: { roomId, password } = {} }) => {
  const fs = require("fs");
  const path = require("path");
  const crypto = require("crypto");
  const { ipcRenderer } = require("electron");
  const socket = io((Object.keys(JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8"))).length) ? (JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).socketProtocol + "//" + JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).socketHostname + ((JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).socketPort) ? (":" + JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).socketPort) : "")) : (process.env.DEFAULT_SOCKET_SERVER_PROTOCOL + "//" + process.env.DEFAULT_SOCKET_SERVER_HOSTNAME + ((process.env.DEFAULT_SOCKET_SERVER_PORT) ? (":" + process.env.DEFAULT_SOCKET_SERVER_PORT) : "")));
  const peer = new Peer(null, {
    host: (Object.keys(JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8"))).length) ? JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).peerHostname : process.env.DEFAULT_PEER_SERVER_HOSTNAME,
    port: (Object.keys(JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8"))).length) ? JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).peerPort : process.env.DEFAULT_PEER_SERVER_PORT,
    path: (Object.keys(JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8"))).length) ? JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).peerPath : process.env.DEFAULT_PEER_SERVER_PATH
  });

  peer.on("open", (peerId) => {
    socket.emit("peerId", peerId);
  });

  peer.on("call", (call) => {
    call.answer(new MediaStream());
    call.on("stream", (videoStream) => {
      document.getElementById("screenVideo").srcObject = videoStream;
    });
  });

  socket.emit("joinRoom", {
    type: "server",
    roomId,
    password: crypto.createHash("sha256").update(password).digest("hex")
  });

  document
    .getElementById("screenVideo")
    .addEventListener("loadedmetadata", () => {
      document.getElementById("screenVideo").play();
    });

  socket.on("validPassword", ({ deviceName, screenWidth, screenHeight } = {}) => {
    opener.parent.postMessage({
      type: "connectionData",
      deviceId: roomId,
      deviceName
    });

    document
      .getElementById("screenVideo")
      .addEventListener("mousemove", ({ pageX, pageY, target }) => {
        socket.emit("mouseMove", {
          x: ((pageX - target.offsetLeft) / target.getBoundingClientRect().width) * screenWidth,
          y: ((pageY - target.offsetTop) / target.getBoundingClientRect().height) * (screenHeight + 40)
        });
      });

    document.getElementById("screenVideo").addEventListener("mousedown", () => {
      socket.emit("mouseClick");
    });

    window.addEventListener("keyup", ({ key }) => {
      socket.emit("keyTap", key);
    });

    if (!(JSON.parse(localStorage.getItem("history")) || []).find((device) => JSON.stringify(device) === JSON.stringify([
      deviceName,
      roomId,
      password
    ]))) {
      localStorage.setItem("history", JSON.stringify([
        ...(JSON.parse(localStorage.getItem("history")) || []).filter((device) => !(JSON.stringify([device[1], device[2]]) === JSON.stringify([roomId, password]))),
        ...[
          [
            deviceName,
            roomId,
            password
          ]
        ]
      ]));
    };

    socket.on("cpuUsage", (cpuUsage) => {
      opener.parent.postMessage({
        type: "usageData",
        deviceId: roomId,
        usageData: [
          "cpuUsage",
          cpuUsage
        ]
      });
    });

    socket.on("memoryUsage", (memoryUsage) => {
      opener.parent.postMessage({
        type: "usageData",
        deviceId: roomId,
        usageData: [
          "memoryUsage",
          memoryUsage
        ]
      });
    });

    socket.on("wlanUsage", ({ sent, received } = {}) => {
      opener.parent.postMessage({
        type: "usageData",
        deviceId: roomId,
        usageData: [
          "wlanUsage",
          sent + received
        ]
      });
    });

    socket.on("writeClipboard", ([type, data]) => {
      ipcRenderer.send("writeClipboard", [type, data]);
    });

    document.getElementById("copyClipboardButton").addEventListener("click", () => {
      if (document.getElementById("copyClipboardButtonSelect").matches(":hover")) return;
      socket.emit("copyClipboard", document.getElementById("copyClipboardButtonSelect").value);
    });

    document.getElementById("copyClipboardButtonSelect").addEventListener("change", ({ target }) => {
      document.getElementById("copyClipboardButtonSelect").style.width = Array.from(document.getElementById("copyClipboardButtonSelect").children).find((option) => option.value === target.value).dataset.width;
    });

    document.getElementById("shareFileButton").addEventListener("click", () => {
      
    });

    document.getElementById("screenshotButton").addEventListener("click", () => {
      let canvas = document.createElement("canvas");
      canvas.width = (screenWidth / (screenHeight + 40)) * 1080;
      canvas.height = 1080;
      canvas.getContext('2d').drawImage(document.getElementById("screenVideo"), 0, 0, canvas.width, canvas.height);
      ipcRenderer.send("downloadScreenshot", canvas.toDataURL());
    });
  });
});