const { ipcRenderer } = parent.require("electron");
const fs = parent.require("fs");
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
              if (!["http:", "https:"].includes(new URL(customResourceServerURL.toString().substring(6)).protocol)) throw alert("Invalid resource server URL");
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
                  if (!["http:", "https:"].includes(new URL(customSocketServerURL.toString().substring(6)).protocol)) throw alert("Invalid socket server URL");
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
                      if (!["ws:", "wss:"].includes(new URL(customPeerServerURL.toString().substring(6)).protocol)) throw alert("Invalid peer server URL");
                      fs.writeFileSync(path.join(parent.process.resourcesPath, "customServer.json"), JSON.stringify({
                        resourceProtocol: new URL(customResourceServerURL.toString().substring(6)).protocol,
                        resourceHostname: new URL(customResourceServerURL.toString().substring(6)).hostname,
                        resourcePort: new URL(customResourceServerURL.toString().substring(6)).port,
                        socketProtocol: new URL(customSocketServerURL.toString().substring(6)).protocol,
                        socketHostname: new URL(customSocketServerURL.toString().substring(6)).hostname,
                        socketPort: new URL(customSocketServerURL.toString().substring(6)).port,
                        peerProtocol: new URL(customPeerServerURL.toString().substring(6)).protocol,
                        peerHostname: new URL(customPeerServerURL.toString().substring(6)).hostname,
                        peerPort: new URL(customPeerServerURL.toString().substring(6)).port,
                        peerPath: new URL(customPeerServerURL.toString().substring(6)).pathname
                      }), "utf8");
                      localStorage.setItem("settings", JSON.stringify({
                        ...JSON.parse(localStorage.getItem("settings")) || {},
                        ...{
                          customServer: true
                        }
                      }));
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
      };
    };
  });
});