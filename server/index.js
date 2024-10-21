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
const expressDocs = require("express-documentation");
const fs = require("fs");
const path = require("path");
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

        socket.on("receiveFile", ([fileName, fileText]) => {
          socket.to(roomId).emit("receiveFile", [fileName, fileText]);
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
app.use("/docs", expressDocs(app, {
  title: "Remote Control - Docs",
  favicon: path.resolve("./assets/favicon.ico"),
  logo: path.resolve("./assets/logo.svg"),
  directory: path.resolve("./pages/docs"),
  options: {
    customCode: fs.readFileSync("./data/postHog.js", "utf8") || (() => {}).toString()
  }
}));
app.use(["/api/v1/feedback/send", "/api/v1/newsletter/register"], rateLimit({
  limit: 1,
  standardHeaders: "draft-7",
  legacyHeaders: false
}));
app.use("/peer", peerServer);
app.use("/apps", express.static("apps"));
app.use("/assets", express.static("assets"));
app.use("/pages", express.static("pages"));
app.use(express.static("data"));

app.all("/", (req, res) => {
  res.sendFile("pages/home/index.html", {
    root: __dirname
  });
});

app.all("/team", (req, res) => {
  res.sendFile("pages/team/index.html", {
    root: __dirname
  });
});

app.all("/open-source", (req, res) => {
  res.sendFile("pages/openSource/index.html", {
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
  if (!req.body?.rating) return res.status(404).json({ err: "Missing rating" });
  if ((typeof req.body?.rating !== "number") || (req.body?.rating < 1) || (req.body?.rating > 5)) return res.status(422).json({ err: "Invalid rating" });
  fs.writeFile("./data.json", JSON.stringify({
    ...JSON.parse(fs.readFileSync("./data.json", "utf8") || "{}"),
    ...{
      feedback: [
        ...JSON.parse(fs.readFileSync("./data.json", "utf8") || "{}").feedback || [],
        ...[
          {
            ...{
              rating: req.body?.rating
            },
            ...(req.body?.comment && (typeof req.body?.comment === "string")) ? {
              comment: req.body?.comment
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

app.post("/api/v1/newsletter/register", (req, res) => {
  if (!req.body?.email) return res.status(404).json({ err: "Missing email" });
  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi.test(req.body?.email)) return res.status(422).json({ err: "Invalid email" });
  fs.writeFile("./data.json", JSON.stringify({
    ...JSON.parse(fs.readFileSync("./data.json", "utf8") || "{}"),
    ...{
      newsletter: [
        ...JSON.parse(fs.readFileSync("./data.json", "utf8") || "{}").newsletter || [],
        ...[
          req.body?.email
        ]
      ]
    }
  }), "utf8", () => {
    res.status(200).json({ err: null });
  });
}); 

app.post("/api/v1/newsletter/send", (req, res) => {
  if (!req.body?.password) return res.status(404).json({ err: "Missing password" });
  if (req.body?.password !== process.env.ADMIN_PASSWORD) return res.status(422).json({ err: "Invalid password" });
  if (!req.body?.subject) return res.status(404).json({ err: "Missing subject" });
  if ((typeof req.body?.subject !== "string") || (req.body?.subject.length < 1)) return res.status(422).json({ err: "Invalid subject" });
  if (!req.body?.type) return res.status(404).json({ err: "Missing type" });
  if (!["text", "html"].includes(req.body?.type)) return res.status(422).json({ err: "Invalid type" });
  if (!req.body?.content) return res.status(404).json({ err: "Missing content" });
  if ((typeof req.body?.content !== "string") || (req.body?.content.length < 1)) return res.status(422).json({ err: "Invalid content" });
  Promise.all(
    Array.from(Array(Math.ceil((JSON.parse(fs.readFileSync("./data.json", "utf8") || "{}").newsletter || []).length / 10))).map((_, index) => {
      return Promise.all((JSON.parse(fs.readFileSync("./data.json", "utf8") || "{}").newsletter || []).slice(index * 10, (index + 1) * 10).map((email) =>
        emailTransport.sendMail({
          from: process.env.EMAIL,
          to: email,
          subject: req.body?.subject,
          [req.body?.type]: req.body?.content
        }).catch(() => {})
      ));
    })
  ).then(() => res.status(200).json({ err: null })).catch(() => res.status(500).json({ err: "Failed to send emails" }));
});

const listen = http.listen(3000, () => {
  console.log("Server is now ready on port", listen.address().port);
});