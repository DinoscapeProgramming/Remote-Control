const { ipcRenderer } = parent.require("electron");
const fs = parent.require("fs");
const path = parent.require("path");
const childProcess = parent.require("child_process");
window.process = {
  env: fs.readFileSync(path.join(parent.process.resourcesPath, "app.asar/.env"), "utf8").split("\n").filter((line) => !line.startsWith("#") && (line.split("=").length > 1)).map((line) => line.trim().split("#")[0].split("=")).reduce((data, accumulator) => ({
    ...data,
    ...{
      [accumulator[0]]: JSON.parse(accumulator[1].trim())
    }
  }), {})
};

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
    } else if (slider.parentElement.dataset.type === "runInBackgroundOnClose") {
      localStorage.setItem("settings", JSON.stringify({
        ...JSON.parse(localStorage.getItem("settings")) || {},
        ...{
          runInBackgroundOnClose: !slider.previousElementSibling.checked
        }
      }));
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
      Array.from(parent.document.getElementById("menuBar").children[0].children).at(-1).style.display = (slider.previousElementSibling.checked) ? "none" : "block";
    };
  });
});

document.getElementById("autoLaunchSelect").value = (JSON.parse(localStorage.getItem("settings")) || {}).autoLaunchType || "foreground";

document.getElementById("autoLaunchSelect").addEventListener("change", () => {
  localStorage.setItem("settings", JSON.stringify({
    ...JSON.parse(localStorage.getItem("settings")) || {},
    ...{
      autoLaunchType: document.getElementById("autoLaunchSelect").value
    }
  }));
  fs.writeFileSync(path.join(parent.process.resourcesPath, "autoLaunchType.txt"), document.getElementById("autoLaunchSelect").value, "utf8");
});

if (parent.installingRemotePrintDriver || parent.uninstallingRemotePrintDriver) {
  let installRemotePrintDriverSpinnerIcon = document.createElement("i");
  installRemotePrintDriverSpinnerIcon.className = "fa fa-spinner fa-spin";
  installRemotePrintDriverSpinnerIcon.ariaHidden = true;
  installRemotePrintDriverSpinnerIcon.style.marginLeft = "2.5px";
  document.getElementById("installRemotePrintDriverButton").disabled = true;
  document.getElementById("installRemotePrintDriverButton").innerText = (parent.installingRemotePrintDriver) ? "Installing " : "Uninstalling ";
  document.getElementById("installRemotePrintDriverButton").appendChild(installRemotePrintDriverSpinnerIcon);
} else {
  document.getElementById("installRemotePrintDriverButton").disabled = false;
  Object.assign(
    {
      win32: () => {
        childProcess.exec("reg query HKCU\\Software\\PDFCreator.net", (err, stdout, stderr) => {
          document.getElementById("installRemotePrintDriverButton").innerText = (!err && !stderr && stdout.includes("PDFCreator")) ? "Uninstall" : "Install";
        });
      }
    },
    ...["darwin", "linux"].map((key) => ({
      [key]: () => {
        childProcess.exec("lpstat -p", (err, stdout, stderr) => {
          document.getElementById("installRemotePrintDriverButton").innerText = (!err && !stderr && stdout.includes("CUPS-PDF")) ? "Uninstall" : "Install";
        });
      }
    }))
  )[parent.process.platform]();
};

document.getElementById("installRemotePrintDriverButton").addEventListener("click", () => {
  let installRemotePrintDriverSpinnerIcon = document.createElement("i");
  installRemotePrintDriverSpinnerIcon.className = "fa fa-spinner fa-spin";
  installRemotePrintDriverSpinnerIcon.ariaHidden = true;
  installRemotePrintDriverSpinnerIcon.style.marginLeft = "2.5px";
  document.getElementById("installRemotePrintDriverButton").disabled = true;
  document.getElementById("installRemotePrintDriverButton").innerText = (document.getElementById("installRemotePrintDriverButton").innerText === "Install") ? "Installing " : "Uninstalling ";
  document.getElementById("installRemotePrintDriverButton").appendChild(installRemotePrintDriverSpinnerIcon);
  parent.postMessage({
    type: (document.getElementById("installRemotePrintDriverButton").innerText === "Installing ") ? "installRemotePrintDriver" : "uninstallRemotePrintDriver"
  });
});

window.addEventListener("message", ({ data: { type, installRemotePrintDriverButtonLabel } }) => {
  if (type !== "installRemotePrintDriverButtonLabel") return;
  document.getElementById("installRemotePrintDriverButton").disabled = false;
  document.getElementById("installRemotePrintDriverButton").innerText = installRemotePrintDriverButtonLabel;
});