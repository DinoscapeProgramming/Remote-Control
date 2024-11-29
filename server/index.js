Object.assign(process.env, require("fs").readFileSync("./.env", "utf8").split("\n").filter((line) => !line.startsWith("#") && (line.split("=").length > 1)).map((line) => line.trim().split("#")[0].split("=")).reduce((data, accumulator) => ({
  ...data,
  ...{
    [accumulator[0]]: JSON.parse(accumulator[1].trim())
  }
}), {}));
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
const expressDocs = require("express-documentation");
const fs = require("fs");
const tls = require("tls");
const path = require("path");
const crypto = require("crypto");
const { Worker } = require("worker_threads");
const { readDatabase, updateDatabase } = require("./database.js");
const keys = require("./keys.json");
let rateLimits = {};

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});
app.use("/docs", expressDocs(app, {
  title: "Remote Control - Docs",
  favicon: path.resolve("./assets/favicon.ico"),
  logo: path.resolve("./assets/logo.svg"),
  directory: path.resolve("./pages/docs"),
  options: {
    customHTML: {
      head: `
        <meta name="description" content="Get started with Remote Control by exploring our detailed documentation. Unlock the full potential of this advanced but easy-to-use, cross-platform remote desktop app." />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/assets/favicon.ico" />
      `
    },
    customCode: fs.readFileSync("./data/posthog.js", "utf8") || (() => {}).toString() + `
      if ("serviceWorker" in navigator) navigator.serviceWorker.register("/serviceWorker.js");
    `
  }
}));
app.use(["/api/v1/feedback/send", "/api/v1/newsletter/register"], (req, res, next) => {
  if (Date.now() - (((rateLimits || {})[req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress] || {})[req.path] || 0) < 600000) return next();
  rateLimits = {
    ...rateLimits || {},
    ...{
      [req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress]: {
        ...(rateLimits || {})[req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress] || {},
        ...{
          [req.path]: Date.now()
        }
      }
    }
  };
  next();
});
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

app.all("/admin", (req, res) => {
  res.sendFile("pages/admin/index.html", {
    root: __dirname
  });
});

app.get("/api/v1/feedback/get", (req, res) => {
  readDatabase("feedback").then(({ feedback = [] }) => {
    res.status(200).json({
      err: null,
      feedback: feedback.reduce((accumulator, { rating }) => accumulator.map((starCount, index) => starCount + ((index + 1) === rating)), [0, 0, 0, 0, 0])
    });
  }).catch(({ err }) => res.status(500).json({ err, feedback: null }));
});

app.post("/api/v1/feedback/send", (req, res) => {
  if (!req.body?.rating) return res.status(404).json({ err: "Missing rating" });
  if ((typeof req.body?.rating !== "number") || (req.body?.rating < 1) || (req.body?.rating > 5)) return res.status(422).json({ err: "Invalid rating" });
  readDatabase("feedback").then(({ feedback = [] }) => {
    updateDatabase("feedback", [
      ...feedback,
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
    ])
    .then(() => {
      res.status(200).json({ err: null })
    })
    .catch(({ err }) => {
      res.status(500).json({ err })
    });
  }).catch(({ err }) => res.status(500).json({ err }));
});

app.get("/api/v1/apps/get", (req, res) => {
  readDatabase("apps").then(({ apps = {} }) => {
    res.status(200).json({
      err: null,
      apps: Object.entries(apps).reduce((accumulator, [appId, { iconExtension, name, description, verified }]) => ({
        ...accumulator,
        ...{
          [appId]: {
            iconExtension,
            name,
            description,
            verified
          }
        }
      }), {})
    });
  }).catch(({ err }) => res.status(500).json({ err, apps: null }));
});

app.post("/api/v1/newsletter/register", (req, res) => {
  if (!req.body?.email) return res.status(404).json({ err: "Missing email" });
  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi.test(req.body?.email)) return res.status(422).json({ err: "Invalid email" });
  readDatabase("newsletter").then(({ newsletter = [] }) => {
    if (newsletter.includes(req.body?.email)) return res.status(409).json({ err: "Email address is already registered" });
    updateDatabase("newsletter", [
      ...newsletter,
      ...[
        req.body?.email
      ]
    ])
    .then(() => {
      res.status(200).json({ err: null });
    })
    .catch(({ err }) => {
      res.status(500).json({ err })
    });
  }).catch(({ err }) => res.status(500).json({ err }));
}); 

app.post("/api/v1/newsletter/send", (req, res) => {
  req.cookies = req.headers.cookie.split(";").map((cookie) => cookie.trim().split("=")).reduce((data, accumulator) => ({
    ...data,
    ...{
      [accumulator[0]]: decodeURIComponent(accumulator[1])
    }
  }), {});
  if (!req.cookies?.adminPassword) return res.status(404).json({ err: "Missing password" });
  if (req.cookies?.adminPassword !== process.env.ADMIN_PASSWORD) return res.status(418).json({ err: "I'm a teapot" });
  if (!req.body?.subject) return res.status(404).json({ err: "Missing subject" });
  if ((typeof req.body?.subject !== "string") || (req.body?.subject.length < 1)) return res.status(422).json({ err: "Invalid subject" });
  if (!req.body?.type) return res.status(404).json({ err: "Missing type" });
  if (!["text", "html"].includes(req.body?.type)) return res.status(422).json({ err: "Invalid type" });
  if (!req.body?.content) return res.status(404).json({ err: "Missing content" });
  if ((typeof req.body?.content !== "string") || (req.body?.content.length < 1)) return res.status(422).json({ err: "Invalid content" });
  readDatabase("newsletter").then(({ newsletter = [] }) => {
    console.log(newsletter);
    Promise.all(
      Array.from(Array(Math.ceil(newsletter.length / 10))).map((_, index) => {
        return Promise.all(newsletter.slice(index * 10, (index + 1) * 10).map((email) => {
          let client = tls.connect(465, "smtp.gmail.com", {
            rejectUnauthorized: false
          }, () => client.write("EHLO localhost\r\n"));
          let step = 0;

          client.on("data", (data) => {
            switch (step) {
              case 0:
                if (data.toString().startsWith("250")) {
                  client.write("AUTH LOGIN\r\n");
                  step++;
                };
                break;
        
              case 1:
                if (data.toString().startsWith("334")) {
                  client.write(Buffer.from(process.env.EMAIL_ADDRESS).toString("base64") + "\r\n");
                  step++;
                };
                break;
        
              case 2:
                if (data.toString().startsWith("334")) {
                  client.write(Buffer.from(process.env.EMAIL_PASSWORD).toString("base64") + "\r\n");
                  step++;
                };
                break;
        
              case 3:
                if (data.toString().startsWith("235")) {
                  client.write("MAIL FROM: <" + process.env.EMAIL_ADDRESS + ">\r\n");
                  step++;
                };
                break;
        
              case 4:
                if (data.toString().startsWith("250")) {
                  client.write("RCPT TO: <" + email + ">\r\n");
                  step++;
                };
                break;
        
              case 5:
                if (data.toString().startsWith("250")) {
                  client.write("DATA\r\n");
                  step++;
                };
                break;
        
              case 6:
                if (data.toString().startsWith("354")) {
                  client.write((req.body?.type === "html") ? ("Content-Type: text/html; charset=utf-8\r\nSubject: " + req.body?.subject + "\r\n\r\n" + req.body?.content + "\r\n.\r\n") : ("Subject: " + req.body?.subject + "\r\n\r\n" + req.body?.content + "\r\n.\r\n"));
                  step++;
                };
                break;
        
              case 7:
                if (data.toString().startsWith("250")) client.end();
                break;
            };
          });
        }));
      })
    )
    .then(() => {
      res.status(204).json({ err: null })
    })
    .catch(() => {
      res.status(500).json({ err: "Failed to send emails" })
    });
  }).catch(({ err }) => res.status(500).json({ err }));
});

app.get("/api/v1/admin/verify", (req, res) => {
  req.cookies = req.headers.cookie.split(";").map((cookie) => cookie.trim().split("=")).reduce((data, accumulator) => ({
    ...data,
    ...{
      [accumulator[0]]: decodeURIComponent(accumulator[1])
    }
  }), {});
  if (!req.cookies?.adminPassword) return res.status(404).json({ err: "Missing password", valid: false });
  res.status(200).json({
    err: null,
    valid: (req.cookies?.adminPassword === process.env.ADMIN_PASSWORD)
  });
});

app.post("/api/v1/admin/login", (req, res) => {
  if (!req.body?.password) return res.status(404).json({ err: "Missing password" });
  if (crypto.createHash("sha256").update(req.body?.password).digest("hex") !== process.env.ADMIN_PASSWORD) return res.status(422).json({ err: "Invalid password" });
  res.cookie("adminPassword", process.env.ADMIN_PASSWORD, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict"
  });
  res.status(200).json({ err: null });
});

app.all("/favicon.ico", (req, res) => {
  res.sendFile("assets/favicon.ico", {
    root: __dirname
  });
});

const listen = http.listen(3000, () => {
  console.log("Server is now ready on port", listen.address().port);
});