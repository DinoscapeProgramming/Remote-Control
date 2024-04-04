window.addEventListener("message", ({ data: { roomId, password } = {} }) => {
  const fs = require("fs");
  const path = require("path");
  const crypto = require("crypto");
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
      .addEventListener("mousemove", ({ target }) => {
        return console.log(target.getBoundingClientRect());
        socket.emit("mouseMove", {
          x:
            ((screenWidth/* + 244*/) / 100) *
              (((clientX - document.getElementById("screenVideo").offsetLeft) /
                /*document.getElementById("screenVideo").videoWidth*/ 1280) *
                100)/* -
            167.5*/,
          y:
            (screenHeight / 100) *
              (((clientY - document.getElementById("screenVideo").offsetTop) /
                /*document.getElementById("screenVideo").videoHeight*/720) *
                100)/* +
            21,*/
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
  });
});