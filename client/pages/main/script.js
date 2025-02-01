Object.assign(process.env, require("fs").readFileSync(require("path").join(process.resourcesPath, "app.asar/.env"), "utf8").split("\n").filter((line) => !line.startsWith("#") && (line.split("=").length > 1)).map((line) => line.trim().split("#")[0].split("=")).reduce((data, accumulator) => ({
  ...data,
  ...{
    [accumulator[0]]: JSON.parse(accumulator[1].trim())
  }
}), {}));
const { ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");
const https = require("https");
const crypto = require("crypto");
const childProcess = require("child_process");
let peer = new Peer(null, {
  host: (Object.keys(JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8"))).length) ? JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).peerHostname : process.env.DEFAULT_PEER_SERVER_HOSTNAME,
  port: (Object.keys(JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8"))).length) ? JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).peerPort : process.env.DEFAULT_PEER_SERVER_PORT,
  path: (Object.keys(JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8"))).length) ? JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).peerPath : process.env.DEFAULT_PEER_SERVER_PATH,
  secure: ((Object.keys(JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8"))).length) ? JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).peerProtocol : process.env.DEFAULT_PEER_SERVER_PROTOCOL) === "wss:"
});
let systemUsageData = {};
let discordBotLogs = {};
let discordBotStoppageScripts = {};
let debugLogs = [];
let devToolsOpenedOnDebugMode = false;
window.installingRemotePrintDriver = false;
window.uninstallingRemotePrintDriver = false;

if (!fs.readdirSync(process.resourcesPath).includes("appStartupCode")) fs.mkdirSync(path.join(process.resourcesPath, "appStartupCode"));
if ((JSON.parse(localStorage.getItem("settings")) || {}).debugMode) Array.from(document.getElementById("menuBar").children[0].children).at(-1).style.display = "block";

document.styleSheets[2].media.appendMedium("(prefers-color-scheme: " + (((JSON.parse(localStorage.getItem("settings")) || {}).darkMode ?? false) ? "dark" : "white") + ")");
if ((JSON.parse(localStorage.getItem("settings")) || {}).autoUpdate ?? true) ipcRenderer.send("updateElectronApp");

if (!localStorage.getItem("loginDetails")) {
  localStorage.setItem("loginDetails", JSON.stringify([
    Array.apply(null, Array(9)).map(() => Math.floor(Math.random() * 10)).join(""),
    crypto.randomBytes(8).toString("hex")
  ]));
};

Array.from(document.getElementById("menuBar").children).forEach((menuBar) => {
  Array.from(menuBar.children).forEach((menuBarItem) => {
    menuBarItem.addEventListener("click", () => {
      if (menuBarItem.innerText.toLowerCase() !== "feedback") {
        if (menuBarItem.style.backgroundColor === "rgb(12, 124, 183)") return;
        if ((menuBarItem.innerText.toLowerCase() !== "debug") && devToolsOpenedOnDebugMode) {
          ipcRenderer.send("executeDebugCode", "window.webContents.closeDevTools();");
          devToolsOpenedOnDebugMode = false;
        } else if ((menuBarItem.innerText.toLowerCase() === "debug") && !(((window.outerWidth - window.innerWidth) > 160) || ((window.outerHeight - window.innerHeight) > 160))) {
          ipcRenderer.send("executeDebugCode", "window.webContents.openDevTools();");
          devToolsOpenedOnDebugMode = true;
        };
        document.getElementById("pageEmbed").src = "../" +  menuBarItem.innerText.toLowerCase() + "/index.html";
        Array.from(document.getElementById("menuBar").children).forEach((unhighlightingMenuBar) => {
          Array.from(unhighlightingMenuBar.children).forEach((unhighlightingMenuBarItem) => {
            unhighlightingMenuBarItem.style.backgroundColor = "#0b8acd99";
            unhighlightingMenuBarItem.className = "menuBarItem";
          });
        });
        menuBarItem.style.backgroundColor = "#0c7cb7";
        menuBarItem.classList.remove("menuBarItem");
      } else {
        Array.from(document.getElementById("feedbackModalContentRatingContainer").children).forEach((feedbackModalContentRatingContainerIcon) => {
          feedbackModalContentRatingContainerIcon.className = "";
        });
        document.getElementById("feedbackModalContentCommentInput").value = "";
        document.getElementById("feedbackModalContentCommentInput").style.height = "10.25vh";
        document.getElementById("feedbackModal").style.display = "flex";
        Array.from(document.getElementById("pageEmbed").contentWindow.document.getElementsByTagName("datalist")[0].children).slice(0, document.getElementById("pageEmbed").contentWindow.document.getElementsByTagName("datalist")[0].children.length - 2).forEach((datalistItem) => {
          datalistItem.disabled = true;
        });
        Array.from(document.getElementById("pageEmbed").contentWindow.document.getElementsByTagName("datalist")[0].children).at(-2).disabled = false;
      };
    });
  });
});

document.getElementById("pageEmbed").addEventListener("load", () => {
  if (!document.getElementById("pageEmbed").src.endsWith("/debug/index.html") && (JSON.parse(localStorage.getItem("settings")) || {}).debugMode) Array.from(document.getElementById("pageEmbed").contentWindow.document.getElementsByTagName("datalist")[0].children).find((datalistItem) => datalistItem.value === "/debug").disabled = false;
  document.getElementById("pageEmbed").contentWindow.document.getElementById("searchInput").focus();
  document.getElementById("pageEmbed").contentWindow.document.getElementById("searchInput").select();
  document.getElementById("pageEmbed").contentWindow.document.getElementById("searchInput").addEventListener("keypress", ({ key }) => {
    if ((key !== "Enter") || !document.getElementById("pageEmbed").contentWindow.document.getElementById("searchInput").value || !Array.from(document.getElementById("pageEmbed").contentWindow.document.getElementsByTagName("datalist")[0].children).filter((datalistItem) => !datalistItem.disabled).map((datalistItem) => datalistItem.value).find((keyboardShortcut) => document.getElementById("pageEmbed").contentWindow.document.getElementById("searchInput").value.startsWith(keyboardShortcut) || keyboardShortcut.startsWith(document.getElementById("pageEmbed").contentWindow.document.getElementById("searchInput").value.split(" ")[0]))) return;
    Object.entries({
      ["home"]: () => document.getElementById("menuBar").children[0].children[0].click(),
      ["connect"]: () => document.getElementById("menuBar").children[0].children[1].click(),
      ["monitor"]: () => document.getElementById("menuBar").children[0].children[2].click(),
      ["scripts"]: () => document.getElementById("menuBar").children[0].children[3].click(),
      ["debug"]: () => Array.from(document.getElementById("menuBar").children[0].children).at(-1).click(),
      ["feedback"]: () => document.getElementById("menuBar").children[1].children[0].click(),
      ["settings"]: () => document.getElementById("menuBar").children[1].children[1].click(),
      ["help"]: () => document.getElementById("menuBar").children[1].children[2].click(),
      ["reload"]: () => document.getElementById("pageEmbed").contentWindow.location.reload(),
      ["set-connection"]: () => {
        document.getElementById("pageEmbed").contentWindow.document.getElementById("connectionActionContainer").children[1].value = document.getElementById("pageEmbed").contentWindow.document.getElementById("searchInput").value.split(" ")[1];
        document.getElementById("pageEmbed").contentWindow.document.getElementById("connectionActionContainer").children[2].value = document.getElementById("pageEmbed").contentWindow.document.getElementById("searchInput").value.split(" ")[2];
        document.getElementById("pageEmbed").contentWindow.document.getElementById("connectionActionContainer").children[3].click();
      },
      ["regenerate-connection"]: () => document.getElementById("pageEmbed").contentWindow.document.getElementById("regenerateConnectionIcon").click(),
      ["copy-connection"]: () => document.getElementById("pageEmbed").contentWindow.document.getElementById("copyConnectionIcon").click(),
      ["create-script"]: () => {
        document.getElementById("pageEmbed").contentWindow.document.getElementById("createScriptButton").click();
        Array.from(document.getElementById("pageEmbed").contentWindow.document.getElementById("scriptViewContainer").children).at(-1).children[0].value = document.getElementById("pageEmbed").contentWindow.document.getElementById("searchInput").value.split(" ").slice(1).join(" ") || "Script";
        Array.from(document.getElementById("pageEmbed").contentWindow.document.getElementById("scriptViewContainer").children).at(-1).children[0].style.width = "calc(" + (document.getElementById("pageEmbed").contentWindow.document.getElementById("searchInput").value.split(" ").slice(1).join(" ") || "Script").length.toString() + "ch - 5px)";
        localStorage.setItem("scripts", JSON.stringify({
          ...JSON.parse(localStorage.getItem("scripts")) || [],
          ...[
            crypto.randomBytes(4).toString("hex"),
            document.getElementById("pageEmbed").contentWindow.document.getElementById("searchInput").value.split(" ").slice(1).join(" ") || "Script"
          ]
        }));
      },
      ["open-store"]: () => {
        document.getElementById("pageEmbed").contentWindow.document.getElementById("openStoreButton").click();
        Array.from(document.getElementById("pageEmbed").contentWindow.document.getElementsByTagName("datalist")[0].children).find((keyboardShortcut) => keyboardShortcut.value === "/open-store").value = "/back";
      },
      ["back"]: () => {
        document.getElementById("pageEmbed").contentWindow.document.getElementById("openStoreButton").click();
        Array.from(document.getElementById("pageEmbed").contentWindow.document.getElementsByTagName("datalist")[0].children).find((keyboardShortcut) => keyboardShortcut.value === "/back").value = "/open-store";
      },
      ["dark-mode"]: () => document.getElementById("pageEmbed").contentWindow.document.getElementsByClassName("slider")[0].click(),
      ["auto-launch"]: () => document.getElementById("pageEmbed").contentWindow.document.getElementsByClassName("slider")[1].click(),
      ["auto-update"]: () => document.getElementById("pageEmbed").contentWindow.document.getElementsByClassName("slider")[2].click(),
      ["custom-server"]: () => document.getElementById("pageEmbed").contentWindow.document.getElementsByClassName("slider")[3].click(),
      ["debug-mode"]: () => document.getElementById("pageEmbed").contentWindow.document.getElementsByClassName("slider")[4].click(),
      ["remote-print-driver"]: () => document.getElementById("pageEmbed").contentWindow.document.getElementsByClassName("installRemotePrintDriverButton")[0].click(),
      ["close"]: () => document.getElementById("feedbackModalCloseIcon").click(),
      ["exit"]: () => window.close()
    }).find((keyboardShortcut) => document.getElementById("pageEmbed").contentWindow.document.getElementById("searchInput").value.startsWith("/" + keyboardShortcut[0]) || ("/" + keyboardShortcut[0]).startsWith(document.getElementById("pageEmbed").contentWindow.document.getElementById("searchInput").value.split(" ")[0]))[1]();
    document.getElementById("pageEmbed").contentWindow.document.getElementById("searchInput").value = "";
    document.getElementById("pageEmbed").contentWindow.document.getElementById("searchInput").focus();
    document.getElementById("pageEmbed").contentWindow.document.getElementById("searchInput").select();
  });
  document.getElementById("pageEmbed").contentWindow.devTools = {
    left: () => ipcRenderer.send("executeDebugCode", "window.webContents.closeDevTools(); window.webContents.openDevTools({ mode: 'left' });"),
    right: () => ipcRenderer.send("executeDebugCode", "window.webContents.closeDevTools(); window.webContents.openDevTools({ mode: 'right' });"),
    detach: () => ipcRenderer.send("executeDebugCode", "window.webContents.closeDevTools(); window.webContents.openDevTools({ mode: 'detach' });"),
    close: () => ipcRenderer.send("executeDebugCode", "window.webContents.closeDevTools();")
  };
});

ipcRenderer.on("roomId", () => {
  ipcRenderer.send("roomId", JSON.parse(localStorage.getItem("loginDetails"))[0]);
});

ipcRenderer.on("checkPassword", (_, { roomId, password } = {}) => {
  if (password === crypto.createHash("sha256").update(JSON.parse(localStorage.getItem("loginDetails"))[1]).digest("hex")) {
    ipcRenderer.send("validPassword", roomId);
  } else if ((JSON.parse(localStorage.getItem("throwAwayPasswords") || "[]") || []).map(([throwAwayPassword]) => crypto.createHash("sha256").update(throwAwayPassword).digest("hex")).includes(password)) {
    ipcRenderer.send("validPassword", roomId);
    localStorage.setItem("throwAwayPasswords", JSON.stringify((JSON.parse(localStorage.getItem("throwAwayPasswords")) || []).map((throwAwayPassword) => [
      throwAwayPassword[0],
      throwAwayPassword[1] - Number(password === crypto.createHash("sha256").update(throwAwayPassword[0]).digest("hex"))
    ]).filter((throwAwayPassword) => throwAwayPassword[1] > 0)));
    if (document.getElementById("pageEmbed").src.endsWith("/integrations/index.html")) Array.from(document.getElementById("pageEmbed").contentWindow.document.getElementById("throwAwayPasswordContainer").children).forEach((throwAwayPasswordContainer) => {
      if ((JSON.parse(localStorage.getItem("throwAwayPasswords")) || []).map(([throwAwayPassword]) => throwAwayPassword).includes(throwAwayPasswordContainer.dataset.id)) return;
      throwAwayPasswordContainer.remove();
    });
  };
});

ipcRenderer.on("executeScript", (_, { roomId, password, scriptContent } = {}) => {
  if ((roomId === JSON.parse(localStorage.getItem("loginDetails"))[0]) && (password === crypto.createHash("sha256").update(JSON.parse(localStorage.getItem("loginDetails"))[1]).digest("hex"))) {
    try {
      with ({
        electron: require("electron"),
        robotjs: require("@jitsi/robotjs"),
        prompt: (body, options) => {
          return new Promise((resolve, reject) => {
            childProcess.spawn(({
              win32: "cscript",
              darwin: "osascript",
              linux: "bash"
            })[process.platform], [path.join(process.resourcesPath, "nativePrompts/" + ({
              win32: "win32.vbs",
              darwin: "darwin.scpt",
              linux: "linux.sh"
            })[process.platform]), (options || {}).title || require(path.join(process.resourcesPath, "app.asar/package.json")).productName, body, (options || {}).defaultText || ((typeof options === "string") ? options : "")]).stdout.on('data', (promptData) => {
              if (!promptData.toString().startsWith("RETURN")) return;
              resolve(promptData.toString().substring(6, promptData.toString().length - 2));
            });
          });
        },
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
        executeInMainProcess: (func) => ipcRenderer.send("executeDebugCode", "(" + func.toString() + ")();"),
        createAppStartupCodeFile: (func) => {
          let appStartupCodeFileId = crypto.randomBytes(4).toString("hex");
          fs.writeFileSync(path.join(process.resourcesPath, "appStartupCode/" + appStartupCodeFileId + ".js"), func.toString(), "utf8");
          eval("(async () => (" + func.toString() + ")())();");
          return appStartupCodeFileId;
        },
        deleteAppStartupCodeFile: (appStartupCodeFileId) => {
          try {
            fs.unlinkSync(path.join(process.resourcesPath, "appStartupCode/" + appStartupCodeFileId + ".js"));
          } catch {};
        },
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
        tinyControl: false
      }) {
        eval("(async () => {" + scriptContent + "})();");
      };
    } catch (err) {
      ipcRenderer.send("scriptError", {
        language: "javascript",
        err: err.stack
      });
    };
  };
});

ipcRenderer.on("peerId", (_, { peerId, screenWidth, screenHeight }) => {
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: "screen:0:0",
        minWidth: (screenWidth / screenHeight) * 1080,
        maxWidth: (screenWidth / screenHeight) * 1080,
        minHeight: 1080,
        maxHeight: 1080
      }
    }
  }).then((videoStream) => {
    peer.call(peerId, videoStream);
  });
});

Array.from(document.getElementById("feedbackModalContentRatingContainer").children).forEach((feedbackModalContentRatingContainerIcon, index) => {
  feedbackModalContentRatingContainerIcon.addEventListener("mouseenter", () => {
    Array.from(document.getElementById("feedbackModalContentRatingContainer").children).slice(0, index + 1).forEach((hoveredFeedbackModalContentRatingContainerIcon) => {
      hoveredFeedbackModalContentRatingContainerIcon.classList.add("hoveredFeedbackModalContentRatingContainerIcon");
    });
  });

  feedbackModalContentRatingContainerIcon.addEventListener("mouseleave", () => {
    Array.from(document.getElementById("feedbackModalContentRatingContainer").children).slice(0, index + 1).forEach((hoveredFeedbackModalContentRatingContainerIcon) => {
      hoveredFeedbackModalContentRatingContainerIcon.classList.remove("hoveredFeedbackModalContentRatingContainerIcon");
    });
  });

  feedbackModalContentRatingContainerIcon.addEventListener("click", () => {
    Array.from(document.getElementById("feedbackModalContentRatingContainer").getElementsByClassName("selectedFeedbackModalContentRatingContainerIcon")).forEach((selectedFeedbackModalContentRatingContainerIcon) => {
      selectedFeedbackModalContentRatingContainerIcon.classList.remove("selectedFeedbackModalContentRatingContainerIcon");
    });
    Array.from(document.getElementById("feedbackModalContentRatingContainer").children).slice(0, index + 1).forEach((selectedFeedbackModalContentRatingContainerIcon) => {
      selectedFeedbackModalContentRatingContainerIcon.classList.add("selectedFeedbackModalContentRatingContainerIcon");
    });
  });
});

document.getElementById("sendFeedbackButton").addEventListener("click", () => {
  if (!Array.from(document.getElementById("feedbackModalContentRatingContainer").children).filter((feedbackModalContentRatingContainerIcon) => feedbackModalContentRatingContainerIcon.classList.contains("selectedFeedbackModalContentRatingContainerIcon")).length) return;
  fetch(((Object.keys(JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8"))).length) ? (JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).resourceProtocol + "//" + JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).resourceHostname + ((JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).resourcePort) ? (":" + JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).resourcePort) : "")) : (process.env.DEFAULT_RESOURCE_SERVER_PROTOCOL + "//" + process.env.DEFAULT_RESOURCE_SERVER_HOSTNAME + ((process.env.DEFAULT_RESOURCE_SERVER_PORT) ? (":" + process.env.DEFAULT_RESOURCE_SERVER_PORT) : ""))) + "/api/v1/feedback/send", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      rating: Array.from(document.getElementById("feedbackModalContentRatingContainer").children).filter((feedbackModalContentRatingContainerIcon) => feedbackModalContentRatingContainerIcon.classList.contains("selectedFeedbackModalContentRatingContainerIcon")).length,
      comment: document.getElementById("feedbackModalContentCommentInput").value
    })
  })
  .then(() => {
    Array.from(document.getElementById("feedbackModalContentRatingContainer").children).forEach((feedbackModalContentRatingContainerIcon) => {
      feedbackModalContentRatingContainerIcon.className = "";
    });
    document.getElementById("feedbackModalContentCommentInput").value = "";
    document.getElementById("feedbackModalContentCommentInput").style.height = "10.25vh";
  })
  .catch(() => {});
});

document.getElementById("feedbackModalCloseIcon").addEventListener("click", () => {
  document.getElementById("feedbackModal").style.visibility = "hidden";
  document.getElementById("feedbackModal").style.opacity = "0";
  document.getElementById("feedbackModal").style.transition = "visibility 0s 0.175s, opacity 0.175s linear";
  setTimeout(() => {
    document.getElementById("feedbackModal").style.display = "none";
    document.getElementById("feedbackModal").style.removeProperty("visibility");
    document.getElementById("feedbackModal").style.removeProperty("opacity");
    document.getElementById("feedbackModal").style.removeProperty("transition");
    document.getElementById("pageEmbed").contentWindow.document.getElementById("searchInput").focus();
    document.getElementById("pageEmbed").contentWindow.document.getElementById("searchInput").select();
  }, 175);
  Array.from(document.getElementById("pageEmbed").contentWindow.document.getElementsByTagName("datalist")[0].children).slice(0, document.getElementById("pageEmbed").contentWindow.document.getElementsByTagName("datalist")[0].children.length - 2).forEach((datalistItem) => {
    datalistItem.disabled = false;
  });
  Array.from(document.getElementById("pageEmbed").contentWindow.document.getElementsByTagName("datalist")[0].children).at(-2).disabled = true;
});

window.addEventListener("click", ({ target }) => {
  if (target.id === "feedbackModal") {
    target.style.visibility = "hidden";
    target.style.opacity = "0";
    target.style.transition = "visibility 0s 0.175s, opacity 0.175s linear";
    setTimeout(() => {
      target.style.display = "none";
      target.style.removeProperty("visibility");
      target.style.removeProperty("opacity");
      target.style.removeProperty("transition");
      document.getElementById("pageEmbed").contentWindow.document.getElementById("searchInput").focus();
      document.getElementById("pageEmbed").contentWindow.document.getElementById("searchInput").select();
    }, 175);
    Array.from(document.getElementById("pageEmbed").contentWindow.document.getElementsByTagName("datalist")[0].children).slice(0, document.getElementById("pageEmbed").contentWindow.document.getElementsByTagName("datalist")[0].children.length - 2).forEach((datalistItem) => {
      datalistItem.disabled = false;
    });
    Array.from(document.getElementById("pageEmbed").contentWindow.document.getElementsByTagName("datalist")[0].children).at(-2).disabled = true;
  };
});

window.addEventListener("message", ({ data: { type, deviceId, deviceName, usageData, discordBotId, immediateExecution } = {} } = {}) => {
  if (type === "connectionData") {
    systemUsageData = {
      ...systemUsageData || {},
      ...{
        [deviceId]: deviceName
      }
    }
    document.getElementById("pageEmbed").contentWindow.postMessage({
      type,
      deviceList: Object.keys(systemUsageData).map((deviceId) => [deviceId, systemUsageData[deviceId]])
    });
  } else if (type === "usageData") {
    document.getElementById("pageEmbed").contentWindow.postMessage({
      type,
      deviceList: [
        [
          deviceId
        ]
      ],
      usageData
    });
  } else if (type === "requestConnectedDevices") {
    document.getElementById("pageEmbed").contentWindow.postMessage({
      type: "connectionData",
      deviceList: Object.keys(systemUsageData).map((deviceId) => [deviceId, systemUsageData[deviceId]])
    });
  } else if (type === "runDiscordBot") {
    with ({
      ...{
        electron: require("electron"),
        robotjs: require("@jitsi/robotjs"),
        log: (logInput) => {
          if (!document.getElementById("pageEmbed").src.endsWith("/integrations/index.html")) return (discordBotLogs[discordBotId] = [
            ...discordBotLogs[discordBotId] || [],
            ...[
              logInput
            ]
          ]);
          document.getElementById("pageEmbed").contentWindow.postMessage({
            type: "log",
            log: logInput
          });
        },
        prompt: (body, options) => {
          return new Promise((resolve, reject) => {
            childProcess.spawn(({
              win32: "cscript",
              darwin: "osascript",
              linux: "bash"
            })[process.platform], [path.join(process.resourcesPath, "nativePrompts/" + ({
              win32: "win32.vbs",
              darwin: "darwin.scpt",
              linux: "linux.sh"
            })[process.platform]), (options || {}).title || require(path.join(process.resourcesPath, "app.asar/package.json")).productName, body, (options || {}).defaultText || ((typeof options === "string") ? options : "")]).stdout.on('data', (promptData) => {
              if (!promptData.toString().startsWith("RETURN")) return;
              resolve(promptData.toString().substring(6, promptData.toString().length - 2));
            });
          });
        },
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
        executeInMainProcess: (func) => ipcRenderer.send("executeDebugCode", "(" + func.toString() + ")();"),
        createAppStartupCodeFile: (func) => {
          let appStartupCodeFileId = crypto.randomBytes(4).toString("hex");
          fs.writeFileSync(path.join(process.resourcesPath, "appStartupCode/" + appStartupCodeFileId + ".js"), func.toString(), "utf8");
          if (immediateExecution ?? true) eval("(async () => (" + func.toString() + ")())();");
          return appStartupCodeFileId;
        },
        deleteAppStartupCodeFile: (appStartupCodeFileId) => {
          try {
            fs.unlinkSync(path.join(process.resourcesPath, "appStartupCode/" + appStartupCodeFileId + ".js"));
          } catch {};
        },
        registerStoppageScript: (discordBotStoppageScript) => {
          if (typeof discordBotStoppageScript !== "function") return;
          discordBotStoppageScripts[discordBotId] = discordBotStoppageScript;
        },
        require: (package) => {
          try {
            return require(package);
          } catch (err) {
            if (err.code === "MODULE_NOT_FOUND") throw err;
            try {
              childProcess.execSync("npm install " + package, {
                stdio: "inherit"
              });
            } catch {
              throw err;
            };
            return require(package);
          };
        }
      },
      ...(JSON.parse(localStorage.getItem("discordBots") || "[]") || []).find((discordBot) => discordBot[0] === discordBotId)[2].reduce((data, accumulator) => ({
        ...data,
        ...{
          [accumulator[0]]: accumulator[1]
        }
      }), {})
    }) {
      eval("(async () => {" + fs.readFileSync(path.join(process.resourcesPath, "discordBots/" + discordBotId + ".js"), "utf8") + "})();");
    };
  } else if (type === "stopDiscordBot") {
    with ({
      ...{
        electron: require("electron"),
        robotjs: require("@jitsi/robotjs"),
        log: (logInput) => {
          if (!document.getElementById("pageEmbed").src.endsWith("/integrations/index.html")) return (discordBotLogs[discordBotId] = [
            ...discordBotLogs[discordBotId] || [],
            ...[
              logInput
            ]
          ]);
          document.getElementById("pageEmbed").contentWindow.postMessage({
            type: "log",
            log: logInput
          });
        },
        prompt: (body, options) => {
          return new Promise((resolve, reject) => {
            childProcess.spawn(({
              win32: "cscript",
              darwin: "osascript",
              linux: "bash"
            })[process.platform], [path.join(process.resourcesPath, "nativePrompts/" + ({
              win32: "win32.vbs",
              darwin: "darwin.scpt",
              linux: "linux.sh"
            })[process.platform]), (options || {}).title || require(path.join(process.resourcesPath, "app.asar/package.json")).productName, body, (options || {}).defaultText || ((typeof options === "string") ? options : "")]).stdout.on('data', (promptData) => {
              if (!promptData.toString().startsWith("RETURN")) return;
              resolve(promptData.toString().substring(6, promptData.toString().length - 2));
            });
          });
        },
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
        executeInMainProcess: (func) => ipcRenderer.send("executeDebugCode", "(" + func.toString() + ")();"),
        createAppStartupCodeFile: (func) => {
          let appStartupCodeFileId = crypto.randomBytes(4).toString("hex");
          fs.writeFileSync(path.join(process.resourcesPath, "appStartupCode/" + appStartupCodeFileId + ".js"), func.toString(), "utf8");
          if (immediateExecution ?? true) eval("(async () => (" + func.toString() + ")())();");
          return appStartupCodeFileId;
        },
        deleteAppStartupCodeFile: (appStartupCodeFileId) => {
          try {
            fs.unlinkSync(path.join(process.resourcesPath, "appStartupCode/" + appStartupCodeFileId + ".js"));
          } catch {};
        },
        registerStoppageScript: (discordBotStoppageScript) => {
          if (typeof discordBotStoppageScript !== "function") return;
          discordBotStoppageScripts[discordBotId] = discordBotStoppageScript;
        },
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
        }
      },
      ...(JSON.parse(localStorage.getItem("discordBots") || "[]") || []).find((discordBot) => discordBot[0] === discordBotId)[2].reduce((data, accumulator) => ({
        ...data,
        ...{
          [accumulator[0]]: accumulator[1]
        }
      }), {})
    }) {
      eval("(async () => { (" + discordBotStoppageScripts[discordBotId].toString() + ")(); })();");
    };
  } else if (type === "requestDebugLogs") {
    document.getElementById("pageEmbed").contentWindow.postMessage({
      type: "debugLogs",
      debugLogs
    });
  } else if (type === "customServer") {
    peer = new Peer(null, {
      host: (Object.keys(JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8"))).length) ? JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).peerHostname : process.env.DEFAULT_PEER_SERVER_HOSTNAME,
      port: (Object.keys(JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8"))).length) ? JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).peerPort : process.env.DEFAULT_PEER_SERVER_PORT,
      path: (Object.keys(JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8"))).length) ? JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).peerPath : process.env.DEFAULT_PEER_SERVER_PATH,
      secure: ((Object.keys(JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8"))).length) ? JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).peerProtocol : process.env.DEFAULT_PEER_SERVER_PROTOCOL) === "wss:"
    });
  } else if (type === "installRemotePrintDriver") {
    window.installingRemotePrintDriver = true;
    ({
      win32: () => {
        childProcess.exec("reg query HKCU\\Software\\PDFCreator.net", (err, stdout, stderr) => {
          if (!err && !stderr && stdout.includes("PDFCreator")) {
            childProcess.exec("reg add 'HKCU\\Software\\PDFCreator.net\\Settings\\ApplicationSettings' /v Path /t REG_SZ /d '" + path.join(process.resourcesPath, "printJobs") + "' /f", (err, stdout, stderr) => {
              window.installingRemotePrintDriver = false;
              document.getElementById("pageEmbed").contentWindow.postMessage({
                type: "installRemotePrintDriverButtonLabel",
                installRemotePrintDriverButtonLabel: (err || stderr) ? "Install" : "Uninstall"
              });
              if (err || stderr) ipcRenderer.send("scriptError", {
                language: "javascript",
                err: err?.message || stderr || "Failed to modify PDFCreator"
              });
            });
          } else {
            https.get("https://download.pdfforge.org/download/pdfcreator/PDFCreator-stable?download", (response) => {
              if (response.statusCode < 300 || response.statusCode >= 400 || !response.headers.location) return;
              https.get(response.headers.location, (response) => {
                const fileWriteStream = fs.createWriteStream(path.join(process.resourcesPath, "PDFCreator-Setup.exe"));
                response.pipe(fileWriteStream);
                fileWriteStream.on('finish', () => {
                  fileWriteStream.close(() => {
                    childProcess.execFile(path.join(process.resourcesPath, "PDFCreator-Setup.exe"), [
                      "/SILENT",
                      "/NORESTART"
                    ], (err, stdout, stderr) => {
                      try {
                        fs.unlinkSync(path.join(process.resourcesPath, "PDFCreator-Setup.exe"));
                      } catch (err) {
                        ipcRenderer.send("scriptError", {
                          language: "javascript",
                          err: err?.message || "Failed to delete PDFCreator installer"
                        });
                      } finally {
                        if (err || stderr) {
                          window.installingRemotePrintDriver = false;
                          document.getElementById("pageEmbed").contentWindow.postMessage({
                            type: "installRemotePrintDriverButtonLabel",
                            installRemotePrintDriverButtonLabel: "Install"
                          });
                          ipcRenderer.send("scriptError", {
                            language: "javascript",
                            err: err?.message || stderr || "Failed to install PDFCreator"
                          });
                        } else {
                          childProcess.exec("reg add 'HKCU\\Software\\PDFCreator.net\\Settings\\ApplicationSettings' /v Path /t REG_SZ /d '" + path.join(process.resourcesPath, "printJobs") + "' /f", (err, stdout, stderr) => {
                            window.installingRemotePrintDriver = false;
                            document.getElementById("pageEmbed").contentWindow.postMessage({
                              type: "installRemotePrintDriverButtonLabel",
                              installRemotePrintDriverButtonLabel: (err || stderr) ? "Install" : "Uninstall"
                            });
                            if (err || stderr) ipcRenderer.send("scriptError", {
                              language: "javascript",
                              err: err?.message || stderr || "Failed to modify PDFCreator"
                            });
                          });
                        };
                      };
                    });
                  });
                });
              }).on("error", (err) => {
                try {
                  fs.unlinkSync(path.join(process.resourcesPath, "PDFCreator-Setup.exe"));
                } catch (err) {
                  ipcRenderer.send("scriptError", {
                    language: "javascript",
                    err: err?.message || "Failed to delete PDFCreator installer"
                  });
                } finally {
                  window.installingRemotePrintDriver = false;
                  document.getElementById("pageEmbed").contentWindow.postMessage({
                    type: "installRemotePrintDriverButtonLabel",
                    installRemotePrintDriverButtonLabel: "Install"
                  });
                  ipcRenderer.send("scriptError", {
                    language: "javascript",
                    err: err?.message || "Failed to download PDFCreator"
                  });
                };
              });
            }).on("error", (err) => {
              try {
                fs.unlinkSync(path.join(process.resourcesPath, "PDFCreator-Setup.exe"));
              } catch (err) {
                ipcRenderer.send("scriptError", {
                  language: "javascript",
                  err: err?.message || "Failed to delete PDFCreator installer"
                });
              } finally {
                window.installingRemotePrintDriver = false;
                document.getElementById("pageEmbed").contentWindow.postMessage({
                  type: "installRemotePrintDriverButtonLabel",
                  installRemotePrintDriverButtonLabel: "Install"
                });
                ipcRenderer.send("scriptError", {
                  language: "javascript",
                  err: err?.message || "Failed to download PDFCreator"
                });
              };
            });
          };
        });
      },
      darwin: () => {
        childProcess.exec("sudo lpadmin -p RemotePrinter -E -v cups-pdf:/ -m everywhere", (err, stdout, stderr) => {
          window.installingRemotePrintDriver = false;
          document.getElementById("pageEmbed").contentWindow.postMessage({
            type: "installRemotePrintDriverButtonLabel",
            installRemotePrintDriverButtonLabel: (err || stderr) ? "Install" : "Uninstall"
          });
          if (err || stderr) ipcRenderer.send("scriptError", {
            language: "javascript",
            err: err?.message || stderr || "Failed to launch CUPS"
          });
        });
      },
      linux: () => {
        childProcess.exec("lpstat -p", (err, stdout, stderr) => {
          if (!err && !stderr && stdout.includes("CUPS-PDF")) {
            childProcess.exec("sudo systemctl start cups", (err, stdout, stderr) => {
              window.installingRemotePrintDriver = false;
              document.getElementById("pageEmbed").contentWindow.postMessage({
                type: "installRemotePrintDriverButtonLabel",
                installRemotePrintDriverButtonLabel: (err || stderr) ? "Install" : "Uninstall"
              });
              if (err || stderr) ipcRenderer.send("scriptError", {
                language: "javascript",
                err: err?.message || stderr || "Failed to launch CUPS"
              });
            });
          } else {
            childProcess.exec("sudo apt-get install cups -y", (err, stdout, stderr) => {
              if (err || stderr) {
                window.installingRemotePrintDriver = false;
                document.getElementById("pageEmbed").contentWindow.postMessage({
                  type: "installRemotePrintDriverButtonLabel",
                  installRemotePrintDriverButtonLabel: "Install"
                });
                ipcRenderer.send("scriptError", {
                  language: "javascript",
                  err: err?.message || stderr || "Failed to install CUPS"
                });
              } else {
                childProcess.exec("sudo systemctl start cups", (err, stdout, stderr) => {
                  window.installingRemotePrintDriver = false;
                  document.getElementById("pageEmbed").contentWindow.postMessage({
                    type: "installRemotePrintDriverButtonLabel",
                    installRemotePrintDriverButtonLabel: (err || stderr) ? "Install" : "Uninstall"
                  });
                  if (err || stderr) ipcRenderer.send("scriptError", {
                    language: "javascript",
                    err: err?.message || stderr || "Failed to launch CUPS"
                  });
                });
              };
            });
          };
        });
      }
    })[process.platform]();
  } else if (type === "uninstallRemotePrintDriver") {
    window.uninstallingRemotePrintDriver = true;
    Object.assign(
      {
        win32: () => {
          if (!confirm("Are you sure you want to delete PDFCreator potentially corrupting other programs dependent on it?")) return;
          childProcess.exec("wmic product where \"name like '%PDFCreator%'\" call uninstall /nointeractive", (err, stdout, stderr) => {
            window.uninstallingRemotePrintDriver = false;
            document.getElementById("pageEmbed").contentWindow.postMessage({
              type: "installRemotePrintDriverButtonLabel",
              installRemotePrintDriverButtonLabel: (err || stderr || !stdout.includes("ReturnValue = 0")) ? "Uninstall" : "Install"
            });
            if (err || stderr || !stdout.includes("ReturnValue = 0")) ipcRenderer.send("scriptError", {
              language: "javascript",
              err: err?.message || stderr || "Failed to uninstall PDFCreator"
            });
          });
        }
      },
      ...["darwin", "linux"].map((key) => ({
        [key]: () => {
          if (!confirm("Are you sure you want to delete CUPS potentially corrupting other programs dependent on it?")) return;
          childProcess.exec("lpadmin -x CUPS-PDF", (err, stdout, stderr) => {
            window.uninstallingRemotePrintDriver = false;
            document.getElementById("pageEmbed").contentWindow.postMessage({
              type: "installRemotePrintDriverButtonLabel",
              installRemotePrintDriverButtonLabel: (err || stderr) ? "Uninstall" : "Install"
            });
            if (err || stderr) ipcRenderer.send("scriptError", {
              language: "javascript",
              err: err?.message || stderr || "Failed to uninstall CUPS"
            });
          });
        }
      }))
    )[process.platform]();
  };
});

ipcRenderer.on("disconnected", (_, deviceId) => {
  systemUsageData = Array.from(systemUsageData).filter((device) => device[0] !== deviceId).reduce((data, accumulator) => ({
    ...data,
    ...{
      [accumulator[0]]: accumulator[1]
    }
  }), {});
  document.getElementById("pageEmbed").contentWindow.postMessage({
    type: "disconnectionData",
    deviceList: [
      [
        deviceId
      ]
    ]
  });
});

ipcRenderer.on("debugLog", (_, debugLog) => {
  debugLogs.push(debugLog);
  document.getElementById("pageEmbed").contentWindow.postMessage({
    type: "debugLog",
    debugLogs: [
      debugLog
    ]  
  });
});

fs.readdirSync(path.join(process.resourcesPath, "appStartupCode")).forEach((appStartupCodeFile) => {
  try {
    with ({
      electron: require("electron"),
      robotjs: require("@jitsi/robotjs"),
      prompt: (body, options) => {
        return new Promise((resolve, reject) => {
          childProcess.spawn(({
            win32: "cscript",
            darwin: "osascript",
            linux: "bash"
          })[process.platform], [path.join(process.resourcesPath, "nativePrompts/" + ({
            win32: "win32.vbs",
            darwin: "darwin.scpt",
            linux: "linux.sh"
          })[process.platform]), (options || {}).title || require(path.join(process.resourcesPath, "app.asar/package.json")).productName, body, (options || {}).defaultText || ((typeof options === "string") ? options : "")]).stdout.on('data', (promptData) => {
            if (!promptData.toString().startsWith("RETURN")) return;
            resolve(promptData.toString().substring(6, promptData.toString().length - 2));
          });
        });
      },
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
      executeInMainProcess: (func) => ipcRenderer.send("executeDebugCode", "(" + func.toString() + ")();"),
      createAppStartupCodeFile: (func) => {
        let appStartupCodeFileId = crypto.randomBytes(4).toString("hex");
        fs.writeFileSync(path.join(process.resourcesPath, "appStartupCode/" + appStartupCodeFileId + ".js"), func.toString(), "utf8");
        eval("(async () => (" + func.toString() + ")())();");
        return appStartupCodeFileId;
      },
      deleteAppStartupCodeFile: (appStartupCodeFileId) => {
        try {
          fs.unlinkSync(path.join(process.resourcesPath, "appStartupCode/" + appStartupCodeFileId + ".js"));
        } catch {};
      },
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
      }
    }) {
      eval("(async () => (" + fs.readFileSync(path.join(process.resourcesPath, "appStartupCode/" + appStartupCodeFile), "utf8") + ")())();");
    };
  } catch (err) {
    ipcRenderer.send("scriptError", {
      language: "javascript",
      err: err.stack
    });
  };
});

window.addEventListener("beforeunload", (event) => {
  if (!(JSON.parse(localStorage.getItem("settings")) || {}).runInBackgroundOnClose) return;
  event.preventDefault();
  ipcRenderer.send("runInBackgroundOnClose");
});

window.devTools = {
  left: () => ipcRenderer.send("executeDebugCode", "window.webContents.closeDevTools(); window.webContents.openDevTools({ mode: 'left' });"),
  right: () => ipcRenderer.send("executeDebugCode", "window.webContents.closeDevTools(); window.webContents.openDevTools({ mode: 'right' });"),
  detach: () => ipcRenderer.send("executeDebugCode", "window.webContents.closeDevTools(); window.webContents.openDevTools({ mode: 'detach' });"),
  close: () => ipcRenderer.send("executeDebugCode", "window.webContents.closeDevTools();")
};