const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*"
  },
  rejectUnauthorized: false
});
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(http, {
  debug: true
});
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const { Worker } = require("worker_threads");
const keys = require("./keys.json");

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ type, roomId, password } = {}) => {
    socket.join(roomId);
    if (type === "client") {
      socket.on("validPassword", ({ deviceName, screenWidth, screenHeight } = {}) => {
        socket.to(roomId).emit("validPassword", { deviceName, screenWidth, screenHeight });

        socket.on("cpuUsage", (cpuUsage) => {
          socket.to(roomId).emit("cpuUsage", cpuUsage);
        });
  
        socket.on("memoryUsage", (memoryUsage) => {
          socket.to(roomId).emit("memoryUsage", memoryUsage);
        });

        socket.on("wlanUsage", ({ sent, received }) => {
          socket.to(roomId).emit("wlanUsage", {
            sent,
            received
          });
        });

        socket.on("writeClipboard", ([type, data]) => {
          socket.to(roomId).emit("writeClipboard", [type, data]);
        });
      });
    } else if (type === "server") {
      if (!password) return;
      socket.to(roomId).emit("checkPassword", {
        roomId,
        password
      });

      socket.on("peerId", (peerId) => {
        socket.to(roomId).emit("peerId", peerId);
        socket.on("disconnecting", () => {
          socket.to(roomId).emit("disconnected", peerId);
        });
      });

      socket.on("mouseMove", ({ x, y } = {}) => {
        socket.to(roomId).emit("mouseMove", { x, y });
      });

      socket.on("mouseClick", () => {
        socket.to(roomId).emit("mouseClick");
      });

      socket.on("keyTap", (key) => {
        if (!(new RegExp(/xxx[\x00-\x7F]+xxx/)).test(key) && !keys.includes(key.toLowerCase())) return;
        socket.to(roomId).emit("keyTap", key);
      });

      socket.on("copyClipboard", (type) => {
        socket.to(roomId).emit("copyClipboard", type);
      });

      socket.on("sendFile", ([fileName, fileText]) => {
        socket.to(roomId).emit("sendFile", [fileName, fileText]);
      });

      socket.on("receiveFile", () => {
        socket.to(roomId).emit("receiveFile");
      });
    };
  });

  socket.on("executeScript", ({ roomId, password, scriptContent } = {}) => {
    io.to(roomId).emit("executeScript", {
      roomId,
      password,
      scriptContent
    });
  });
});

if (!fs.readdirSync("./").includes("apps")) fs.mkdirSync("./apps");
if (!fs.readdirSync("./pages/help/markdown").includes("markdown.html")) new Worker("./worker.js");

app.use(bodyParser.json());
app.use("/api/v1/feedback/send", rateLimit({
  limit: 1,
  standardHeaders: "draft-7",
  legacyHeaders: false
}));
app.use("/peer", peerServer);
app.use("/apps", express.static("apps"));
app.use("/pages", express.static("pages"));

app.all("/", (req, res) => {
  res.sendFile("pages/home/index.html", {
    root: __dirname
  });
});

app.all("/reviews", (req, res) => {
  res.sendFile("pages/reviews/index.html", {
    root: __dirname
  });
});

app.all("/help", (req, res) => {
  res.sendFile("pages/help/index.html", {
    root: __dirname
  });
});

app.get("/api/v1/feedback/get", (req, res) => {
  res.json((JSON.parse(fs.readFileSync("./data.json", "utf8") || "{}").feedback || []).reduce((accumulator, { rating }) => accumulator.map((starCount, index) => starCount + ((index + 1) === rating)), [0, 0, 0, 0, 0]))
});

app.post("/api/v1/feedback/send", (req, res) => {
  if (!req.body.rating) return res.status(404).json({ err: "Missing rating" });
  if ((typeof req.body.rating !== "number") || (req.body.rating < 1) || (req.body.rating > 5)) return res.status(400).json({ err: "Invalid rating" });
  fs.writeFile("./data.json", JSON.stringify({
    ...JSON.parse(fs.readFileSync("./data.json", "utf8") || "{}"),
    ...{
      feedback: [
        ...JSON.parse(fs.readFileSync("./data.json", "utf8") || "{}").feedback || [],
        ...[
          {
            ...{
              rating: req.body.rating
            },
            ...(req.body.comment && (typeof req.body.comment === "string")) ? {
              comment: req.body.comment
            } : {}
          }
        ]
      ]
    }
  }), "utf8", () => {
    res.status(200).json({ err: null });
  });
});

app.get("/api/v1/apps/get", (req, res) => {
  res.status(200).json(Object.entries(JSON.parse(fs.readFileSync("./data.json", "utf8") || "{}").apps || {}).reduce((accumulator, [appId, { iconExtension, name, description, verified }]) => ({
    ...accumulator,
    ...{
      [appId]: {
        iconExtension,
        name,
        description,
        verified
      }
    }
  }), {}));
});

const listen = http.listen(3000, () => {
  console.log("Server is now ready on port", listen.address().port);
});