const { ipcRenderer } = parent.require("electron");
const fs = parent.require("fs");
const os = parent.require("os");
const path = parent.require("path");
const childProcess = parent.require("child_process");
const parsedEnvironmentVariables = parent.require("dotenv").config({ path: parent.require("path").join(parent.process.resourcesPath, "app.asar/.env") }).parsed;

Array.from(document.getElementsByClassName("slider")).forEach((slider) => {
  slider.previousElementSibling.checked = (JSON.parse(localStorage.getItem("settings")) || {})[slider.parentElement.dataset.type] ?? ({
    darkMode: false,
    autoLaunch: false,
    autoUpdate: true,
    customServer: false
  })[slider.parentElement.dataset.type];

  slider.addEventListener("click", () => {
    if (slider.parentElement.dataset.type === "darkMode") {
      localStorage.setItem("settings", JSON.stringify({
        ...JSON.parse(localStorage.getItem("settings")) || {},
        ...{
          darkMode: !slider.previousElementSibling.checked
        }
      }));
      parent.document.styleSheets[2].media.deleteMedium("(prefers-color-scheme: " + ((slider.previousElementSibling.checked) ? "dark" : "white") + ")");
      parent.document.styleSheets[2].media.appendMedium("(prefers-color-scheme: " + ((slider.previousElementSibling.checked) ? "white" : "dark") + ")");
      parent.document.styleSheets[2].cssRules[0].cssRules[0].style.webkitAnimationName = "animatefade";
      parent.document.styleSheets[2].cssRules[0].cssRules[0].style.webkitAnimationDuration = "0.075s";
      parent.document.styleSheets[2].cssRules[0].cssRules[0].style.animationName = "animatefade";
      parent.document.styleSheets[2].cssRules[0].cssRules[0].style.animationDuration = "0.075s";
    } else if (slider.parentElement.dataset.type === "autoLaunch") {
      localStorage.setItem("settings", JSON.stringify({
        ...JSON.parse(localStorage.getItem("settings")) || {},
        ...{
          autoLaunch: !slider.previousElementSibling.checked
        }
      }));
      ipcRenderer.send("updateSettings", {
        type: "autoLaunch",
        value: !slider.previousElementSibling.checked
      });
    } else if (slider.parentElement.dataset.type === "autoUpdate") {
      localStorage.setItem("settings", JSON.stringify({
        ...JSON.parse(localStorage.getItem("settings")) || {},
        ...{
          autoUpdate: !slider.previousElementSibling.checked
        }
      }));
      ipcRenderer.send("updateSettings", {
        type: "autoUpdate",
        value: !slider.previousElementSibling.checked
      });
    } else if (slider.parentElement.dataset.type === "customServer") {
      if (!slider.previousElementSibling.checked) {
      try {
        childProcess.spawn(({
          win32: "cscript",
            darwin: "osascript",
            linux: "bash"
          })[parent.process.platform], [path.join(parent.process.resourcesPath, "nativePrompts/" + ({
            win32: "win32.vbs",
            darwin: "darwin.scpt",
            linux: "linux.sh"
          })[parent.process.platform]), "Custom WebRTC URL", "Please specify your resource server URL", parsedEnvironmentVariables.DEFAULT_RESOURCE_SERVER_PROTOCOL + "//" + parsedEnvironmentVariables.DEFAULT_RESOURCE_SERVER_HOSTNAME + ((parsedEnvironmentVariables.DEFAULT_RESOURCE_SERVER_PORT) ? (":" + parsedEnvironmentVariables.DEFAULT_RESOURCE_SERVER_PORT) : "")]).stdout.on('data', (customResourceServerURL) => {
            try {
              if (!customResourceServerURL.toString().startsWith("RETURN")) return;
              if (!["http:", "https:"].includes(new URL(customResourceServerURL.toString().substring(6, customResourceServerURL.toString().length - 2)).protocol)) throw alert("Invalid resource server URL");
              childProcess.spawn(({
                win32: "cscript",
                darwin: "osascript",
                linux: "bash"
              })[parent.process.platform], [path.join(parent.process.resourcesPath, "nativePrompts/" + ({
                win32: "win32.vbs",
                darwin: "darwin.scpt",
                linux: "linux.sh"
              })[parent.process.platform]), "Custom WebRTC URL", "Please specify your socket server URL", parsedEnvironmentVariables.DEFAULT_SOCKET_SERVER_PROTOCOL + "//" + parsedEnvironmentVariables.DEFAULT_SOCKET_SERVER_HOSTNAME + ((parsedEnvironmentVariables.DEFAULT_SOCKET_SERVER_PORT) ? (":" + parsedEnvironmentVariables.DEFAULT_SOCKET_SERVER_PORT) : "")]).stdout.on('data', (customSocketServerURL) => {
                try {
                  if (!customSocketServerURL.toString().startsWith("RETURN")) return;
                  if (!["http:", "https:"].includes(new URL(customSocketServerURL.toString().substring(6, customSocketServerURL.toString().length - 2)).protocol)) throw alert("Invalid socket server URL");
                  childProcess.spawn(({
                    win32: "cscript",
                    darwin: "osascript",
                    linux: "bash"
                  })[parent.process.platform], [path.join(parent.process.resourcesPath, "nativePrompts/" + ({
                    win32: "win32.vbs",
                    darwin: "darwin.scpt",
                    linux: "linux.sh"
                  })[parent.process.platform]), "Custom WebRTC URL", "Please specify your peer server URL", parsedEnvironmentVariables.DEFAULT_PEER_SERVER_PROTOCOL + "//" + parsedEnvironmentVariables.DEFAULT_PEER_SERVER_HOSTNAME + ((parsedEnvironmentVariables.DEFAULT_PEER_SERVER_PORT) ? (":" + parsedEnvironmentVariables.DEFAULT_PEER_SERVER_PORT) : "") + parsedEnvironmentVariables.DEFAULT_PEER_SERVER_PATH]).stdout.on('data', (customPeerServerURL) => {
                    try {
                      if (!customPeerServerURL.toString().startsWith("RETURN")) return;
                      if (!["ws:", "wss:"].includes(new URL(customPeerServerURL.toString().substring(6, customPeerServerURL.toString().length - 2)).protocol)) throw alert("Invalid peer server URL");
                      fs.writeFileSync(path.join(parent.process.resourcesPath, "customServer.json"), JSON.stringify({
                        resourceProtocol: new URL(customResourceServerURL.toString().substring(6, customResourceServerURL.toString().length - 2)).protocol,
                        resourceHostname: new URL(customResourceServerURL.toString().substring(6, customResourceServerURL.toString().length - 2)).hostname,
                        resourcePort: new URL(customResourceServerURL.toString().substring(6, customResourceServerURL.toString().length - 2)).port,
                        socketProtocol: new URL(customSocketServerURL.toString().substring(6, customSocketServerURL.toString().length - 2)).protocol,
                        socketHostname: new URL(customSocketServerURL.toString().substring(6, customSocketServerURL.toString().length - 2)).hostname,
                        socketPort: new URL(customSocketServerURL.toString().substring(6, customSocketServerURL.toString().length - 2)).port,
                        peerProtocol: new URL(customPeerServerURL.toString().substring(6, customPeerServerURL.toString().length - 2)).protocol,
                        peerHostname: new URL(customPeerServerURL.toString().substring(6, customPeerServerURL.toString().length - 2)).hostname,
                        peerPort: new URL(customPeerServerURL.toString().substring(6, customPeerServerURL.toString().length - 2)).port,
                        peerPath: new URL(customPeerServerURL.toString().substring(6, customPeerServerURL.toString().length - 2)).pathname
                      }), "utf8");
                      localStorage.setItem("settings", JSON.stringify({
                        ...JSON.parse(localStorage.getItem("settings")) || {},
                        ...{
                          customServer: true
                        }
                      }));
                      ipcRenderer.send("updateSettings", {
                        type: "customServer"
                      });
                      parent.postMessage({
                        type: "customServer"
                      });
                    } catch {
                      document.getElementsByClassName("slider")[3].click();
                      fs.writeFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "{}", "utf8");
                    };
                  });
                } catch {
                  document.getElementsByClassName("slider")[3].click();
                  fs.writeFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "{}", "utf8");
                };
              });
            } catch {
              document.getElementsByClassName("slider")[3].click();
              fs.writeFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "{}", "utf8");
            };
          });
        } catch {
          document.getElementsByClassName("slider")[3].click();
          fs.writeFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "{}", "utf8");
        };
      } else {
        fs.writeFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "{}", "utf8");
        localStorage.setItem("settings", JSON.stringify({
          ...JSON.parse(localStorage.getItem("settings")) || {},
          ...{
            customServer: false
          }
        }));
        ipcRenderer.send("updateSettings", {
          type: "customServer"
        });
        parent.postMessage({
          type: "customServer"
        });
      };
    } else if (slider.parentElement.dataset.type === "debugMode") {
      localStorage.setItem("settings", JSON.stringify({
        ...JSON.parse(localStorage.getItem("settings")) || {},
        ...{
          debugMode: !slider.previousElementSibling.checked
        }
      }));
      parent.document.getElementById("menuBar").children[0].children[4].style.display = (slider.previousElementSibling.checked) ? "none" : "block";
    };
  });
});

document.getElementById("installRemotePrintDriverButton").addEventListener("click", () => {
  let installRemotePrintDriverSpinnerIcon = document.createElement("i");
  installRemotePrintDriverSpinnerIcon.className = "fa fa-spinner fa-spin";
  installRemotePrintDriverSpinnerIcon.ariaHidden = true;
  installRemotePrintDriverSpinnerIcon.style.marginLeft = "2.5px";
  document.getElementById("installRemotePrintDriverButton").disabled = true;
  document.getElementById("installRemotePrintDriverButton").innerText = (document.getElementById("installRemotePrintDriverButton").innerText === "Install") ? "Installing " : "Uninstalling ";
  document.getElementById("installRemotePrintDriverButton").appendChild(installRemotePrintDriverSpinnerIcon);
  if (document.getElementById("installRemotePrintDriverButton").innerText === "Installing ") {
    ({
      win32: () => {
        https.get("https://download.pdfforge.org/download/pdfcreator/PDFCreator-stable", (response) => {
          const fileWriteStream = fs.createWriteStream(path.join(__dirname, "PDFCreator-Setup.exe"));
          response.pipe(fileWriteStream);
          fileWriteStream.on('finish', () => {
            fileWriteStream.close(() => {
              installPDFCreator(installerPath);
              childProcess.exec(path.join(__dirname, "PDFCreator-Setup.exe") + " /SILENT /NORESTART", (err, stdout, stderr) => {
                document.getElementById("installRemotePrintDriverButton").disabled = false;
                document.getElementById("installRemotePrintDriverButton").innerText = (err) ? "Install" : "Uninstall";
                if (err) ipcRenderer.send("scriptError", {
                  language: "javascript",
                  err: err.message
                });
              });
            });
          });
        }).on("error", (err) => {
          try {
            document.getElementById("installRemotePrintDriverButton").disabled = false;
            document.getElementById("installRemotePrintDriverButton").innerText = "Install";
            ipcRenderer.send("scriptError", {
              language: "javascript",
              err: err.message
            });
            fs.unlinkSync(path.join(__dirname, "PDFCreator-Setup.exe"));
          } catch {};
        });
      },
      darwin: () => {
        childProcess.exec("sudo lpadmin -p RemotePrinter -E -v cups-pdf:/ -m everywhere", (err, stdout, stderr) => {
          if (err) ipcRenderer.send("scriptError", {
            language: "javascript",
            err: err.message
          });
          document.getElementById("installRemotePrintDriverButton").disabled = false;
          document.getElementById("installRemotePrintDriverButton").innerText = ((err) ? "Install" : "Uninstall");
        });
      },
      linux: () => {
        childProcess.exec("sudo apt-get install cups -y", (err, stdout, stderr) => {
          if (err) {
            ipcRenderer.send("scriptError", {
              language: "javascript",
              err: err.message
            });
            document.getElementById("installRemotePrintDriverButton").disabled = false;
            document.getElementById("installRemotePrintDriverButton").innerText = "Install";
          } else {
            childProcess.exec("sudo systemctl start cups", (err, stdout, stderr) => {
              if (err) ipcRenderer.send("scriptError", {
                language: "javascript",
                err: err.message
              });
              document.getElementById("installRemotePrintDriverButton").disabled = false;
              document.getElementById("installRemotePrintDriverButton").innerText = ((err) ? "Install" : "Uninstall");
            });
          };
        });
      }
    })[os.platform()]();
  } else {
    Object.assign(
      {
        win32: () => {
          childProcess.exec("wmic product where \"name like '%PDFCreator%'\" call uninstall /nointeractive", (err, stdout, stderr) => {
            if (err || !stdout.includes("ReturnValue = 0")) ipcRenderer.send("scriptError", {
              language: "javascript",
              err: err.message
            });
            document.getElementById("installRemotePrintDriverButton").disabled = false;
            document.getElementById("installRemotePrintDriverButton").innerText = ((err || !stdout.includes("ReturnValue = 0")) ? "Uninstall" : "Install");
          });
        }
      },
      ...["darwin", "linux"].map((key) => ({
        [key]: () => {
          childProcess.exec("lpadmin -x CUPS-PDF", (err, stdout, stderr) => {
            if (err) ipcRenderer.send("scriptError", {
              language: "javascript",
              err: err.message
            });
            document.getElementById("installRemotePrintDriverButton").disabled = false;
            document.getElementById("installRemotePrintDriverButton").innerText = ((err) ? "Uninstall" : "Install");
          });
        }
      }))
    )[os.platform()]();
  };
});