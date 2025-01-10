Object.assign(process.env, require("fs").readFileSync(require("path").join(process.resourcesPath, "app.asar/.env"), "utf8").split("\n").filter((line) => !line.startsWith("#") && (line.split("=").length > 1)).map((line) => line.trim().split("#")[0].split("=")).reduce((data, accumulator) => ({
  ...data,
  ...{
    [accumulator[0]]: JSON.parse(accumulator[1].trim())
  }
}), {}));
if (!require("fs").readdirSync(process.resourcesPath).includes("autoLaunchType.txt")) require("fs").writeFileSync(require("path").join(process.resourcesPath, "autoLaunchType.txt"), "foreground");
if (!require("fs").readdirSync(process.resourcesPath).includes("customServer.json")) require("fs").writeFileSync(require("path").join(process.resourcesPath, "customServer.json"), "{}");
if (!require("fs").readdirSync(process.resourcesPath).includes("prompt.vbs")) {
  require("fs").mkdir(require("path").join(process.resourcesPath, "nativePrompts"), () => {
    require("fs").writeFileSync(require("path").join(process.resourcesPath, "nativePrompts/win32.vbs"), `box = InputBox(Wscript.Arguments.Item(1), Wscript.Arguments.Item(0), Wscript.Arguments.Item(2))\nWscript.Echo "RETURN" + box`, "utf8");
    require("fs").writeFileSync(require("path").join(process.resourcesPath, "nativePrompts/darwin.scpt"), `on run (clp)\ndisplay dialog clp's item 2 with title clp's item 1 default answer clp's item 3 buttons {"Cancel", "OK"} default button 2\nend run`, "utf8");
    require("fs").writeFileSync(require("path").join(process.resourcesPath, "nativePrompts/linux.sh"), `zenity --entry --title="$1" --text="$2" --entry-text="$3" ""`, "utf8");
  });
};
const { app, BrowserWindow, ipcMain, screen, dialog, clipboard, nativeImage, Tray, Menu, autoUpdater } = require("electron");
const fs = require("fs");
const os = require("os");
const path = require("path");
const childProcess = require("child_process");
const { io } = require("socket.io-client");
const socket = io((Object.keys(JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8"))).length) ? (JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).socketProtocol + "//" + JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).socketHostname + ((JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).socketPort) ? (":" + JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).socketPort) : "")) : (process.env.DEFAULT_SOCKET_SERVER_PROTOCOL + "//" + process.env.DEFAULT_SOCKET_SERVER_HOSTNAME + ((process.env.DEFAULT_SOCKET_SERVER_PORT) ? (":" + process.env.DEFAULT_SOCKET_SERVER_PORT) : "")));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
const robot = require("@jitsi/robotjs");
let systemUsageDataIntervals = {};
let tray;

const createWindow = () => {
  const window = new BrowserWindow({
    show: false,
    title: "Remote Control",
    icon: path.join(__dirname, "assets/favicon.ico"),
    autoHideMenuBar: true,
    skipTaskbar: ((app.getLoginItemSettings().wasOpenedAtLogin || process.argv.includes("--startup")) && ((fs.readFileSync(path.join(process.resourcesPath, "autoLaunchType.txt"), "utf8") || "foreground") === "background")),
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false
    }
  });
  window.maximize();
  window.loadFile("pages/main/index.html");
  if (tray || (!app.getLoginItemSettings().wasOpenedAtLogin && !process.argv.includes("--startup")) || ((fs.readFileSync(path.join(process.resourcesPath, "autoLaunchType.txt"), "utf8") || "foreground") !== "background")) {
    window.show();
  } else {
    tray = new Tray(path.join(__dirname, "assets/favicon.ico"));
    tray.setToolTip("Remote Control");
    tray.setContextMenu(Menu.buildFromTemplate([
      {
        label: "Show",
        click: () => {
          window.show();
          window.setSkipTaskbar(false);
          tray.destroy();
          tray = null;
        }
      },
      {
        label: "Exit",
        click: () => {
          window.webContents.executeJavaScript("localStorage.getItem('settings');").then((settings) => {
            if (!(JSON.parse(settings) || {}).runInBackgroundOnClose) return (tray.destroy(), tray = null);
            app.quit();
          });
        }
      }
    ]));
  };

  ipcMain.on("updateElectronApp", () => {
    autoUpdater.setFeedURL({
      ...{
        url: "https://update.electronjs.org" + (new URL(require("./package.json").repository)).pathname + "/" + process.platform + "-" + process.arch + "/" + app.getVersion() + ((process.platform === "darwin") ? "/RELEASES.json" : "")
      },
      ...(process.platform === "darwin") ? {
        headers: {
          'User-Agent': "update-electron-app/3.0.0 (" + os.platform() + ": " + os.arch() + ")"
        },
        serverType: "json"
      } : {}
    });

    autoUpdater.on("update-downloaded", (_, releaseNotes, releaseName) => {
      dialog.showMessageBox({
        type: "info",
        buttons: [
          "Restart",
          "Later"
        ],
        title: "Application Update",
        message: (process.platform === "win32") ? releaseNotes : releaseName,
        detail: 'A new version has been downloaded. Restart the application to apply the updates.'
      }).then((returnValue) => {
        if (returnValue.response) return;
        autoUpdater.quitAndInstall();
      });
    });
  });

  setTimeout(() => {
    window.webContents.send("debugLog", "Started App");

    window.webContents.send("roomId");
    ipcMain.on("roomId", (_, roomId) => {
      socket.emit("joinRoom", {
        type: "client",
        roomId
      });
      window.webContents.send("debugLog", "Joined Room");
    });
    
    ipcMain.on("validPassword", (_, roomId) => {
      socket.emit("validPassword", {
        deviceName: os.hostname(),
        screenWidth: screen.getPrimaryDisplay().workAreaSize.width,
        screenHeight: screen.getPrimaryDisplay().workAreaSize.height
      });

      socket.on("peerId", (peerId) => {
        window.webContents.send("peerId", {
          peerId,
          screenWidth: screen.getPrimaryDisplay().workAreaSize.width,
          screenHeight: screen.getPrimaryDisplay().workAreaSize.height
        });
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

      systemUsageDataIntervals = {
        ...{
          [roomId]: setInterval(() => {
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

    socket.on("checkPassword", ({ roomId, password } = {}) => {
      window.webContents.send("checkPassword", {
        roomId,
        password
      });
    });

    socket.on("disconnected", (deviceId) => {
      if (systemUsageDataIntervals[deviceId]) clearInterval(systemUsageDataIntervals[deviceId]);
      window.webContents.send("disconnected", deviceId);
    });

    ipcMain.on("executeScript", (_, { roomId, password, scriptContent } = {}) => {
      socket.emit("executeScript", {
        roomId,
        password,
        scriptContent
      });
    });

    socket.on("executeScript", ({ roomId, password, scriptContent } = {}) => {
      window.webContents.send("executeScript", {
        roomId,
        password,
        scriptContent
      });
    });

    ipcMain.on("executeDebugCode", (_, debugCode) => {
      with ({
        log: (debugLog) => window.webContents.send("debugLog", debugLog),
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
        eval("(async () => {" + debugCode + "})();");
      };
    });

    socket.on("copyClipboard", (type) => {
      socket.emit("writeClipboard", [
        type,
        ({
          text: () => clipboard.readText(),
          html: () => clipboard.readHTML(),
          image: () => clipboard.readImage().toDataURL(),
          rtf: () => clipboard.readRTF(),
          bookmark: () => clipboard.readBookmark()
        })[type]()
      ]);
    });

    ipcMain.on("writeClipboard", (_, [type, data]) => {
      clipboard.write({
        [type]: (type !== "image") ? data : nativeImage.createFromDataURL(data)
      });
    });

    socket.on("sendFile", ([fileName, fileText]) => {
      dialog.showSaveDialog({
        defaultPath: fileName
      }).then(({ canceled, filePath }) => {
        if (canceled) return;
        fs.writeFileSync(filePath, fileText, "utf8");
      });
    });

    socket.on("receiveFile", () => {
      dialog.showOpenDialog({
        properties: ["openFile"]
      }).then(({ canceled, filePaths: [filePath] }) => {
        if (canceled) return;
        socket.emit("receiveFile", [path.basename(filePath), fs.readFileSync(filePath, "utf8")]);
      });
    });

    ipcMain.on("receiveFile", (_, [fileName, fileText]) => {
      dialog.showSaveDialog({
        defaultPath: fileName
      }).then(({ canceled, filePath }) => {
        if (canceled) return;
        fs.writeFileSync(filePath, fileText, "utf8");
      });
    });

    ipcMain.on("runInBackgroundOnClose", () => {
      if (tray) return (tray.destroy(), tray = null);
      window.hide();
      window.setSkipTaskbar(true);
      tray = new Tray(path.join(__dirname, "assets/favicon.ico"));
      tray.setToolTip("Remote Control");
      tray.setContextMenu(Menu.buildFromTemplate([
        {
          label: "Show",
          click: () => {
            window.show();
            window.setSkipTaskbar(false);
            tray.destroy();
            tray = null;
          }
        },
        {
          label: "Exit",
          click: () => app.quit()
        }
      ]));
    });

    ipcMain.on("scriptError", (_, { language, err }) => {
      dialog.showErrorBox("A " + ((language === "javascript") ? "JavaScript" : "Python") + " error occured in the renderer process", err); 
    });

    ipcMain.on("updateSettings", (_, { type, value }) => {
      if (type === "autoLaunch") {
        app.setLoginItemSettings({
          ...{
            openAtLogin: value
          },
          ...(value) ? {
            path: app.getPath("exe"),
            args: [
              "--startup"
            ]
          } : {}
        });
      } else if (type === "autoUpdate") {
        if (value) {
          autoUpdater.setFeedURL({
            ...{
              url: "https://update.electronjs.org" + (new URL(require("./package.json").repository)).pathname + "/" + process.platform + "-" + process.arch + "/" + app.getVersion() + ((process.platform === "darwin") ? "/RELEASES.json" : "")
            },
            ...(process.platform === "darwin") ? {
              headers: {
                'User-Agent': "update-electron-app/3.0.0 (" + os.platform() + ": " + os.arch() + ")"
              },
              serverType: "json"
            } : {}
          });
          
          autoUpdater.on("update-downloaded", (_, releaseNotes, releaseName) => {
            dialog.showMessageBox({
              type: "info",
              buttons: [
                "Restart",
                "Later"
              ],
              title: "Application Update",
              message: (process.platform === "win32") ? releaseNotes : releaseName,
              detail: 'A new version has been downloaded. Restart the application to apply the updates.'
            }).then((returnValue) => {
              if (returnValue.response) return;
              autoUpdater.quitAndInstall();
            });
          });
        } else {
          autoUpdater.removeAllListeners();
        };
      } else if (type === "customServer") {
        socket.io.uri = (Object.keys(JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8"))).length) ? (JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).socketProtocol + "//" + JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).socketHostname + ((JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).socketPort) ? (":" + JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).socketPort) : "")) : (process.env.DEFAULT_SOCKET_SERVER_PROTOCOL + "//" + process.env.DEFAULT_SOCKET_SERVER_HOSTNAME + ((process.env.DEFAULT_SOCKET_SERVER_PORT) ? (":" + process.env.DEFAULT_SOCKET_SERVER_PORT) : ""));
        socket.disconnect().connect();
      };
    });
  }, 2000);
};

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (!BrowserWindow.getAllWindows().length) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});