const { ipcRenderer } = parent.require("electron");
const fs = parent.require("fs");
const path = parent.require("path");
const crypto = parent.require("crypto");
window.process = {
  env: fs.readFileSync(path.join(parent.process.resourcesPath, "app.asar/.env"), "utf8").split("\n").filter((line) => !line.startsWith("#") && (line.split("=").length > 1)).map((line) => line.trim().split("#")[0].split("=")).reduce((data, accumulator) => ({
    ...data,
    ...{
      [accumulator[0]]: JSON.parse(accumulator[1].trim())
    }
  }), {})
};

document.getElementById("reviewEmbed").src = ((Object.keys(JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8"))).length) ? (JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8")).resourceProtocol + "//" + JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8")).resourceHostname + ((JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8")).resourcePort) ? (":" + JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8")).resourcePort) : "")) : (process.env.DEFAULT_RESOURCE_SERVER_PROTOCOL + "//" + process.env.DEFAULT_RESOURCE_SERVER_HOSTNAME + ((process.env.DEFAULT_RESOURCE_SERVER_PORT) ? (":" + process.env.DEFAULT_RESOURCE_SERVER_PORT) : ""))) + "/reviews";
if (!localStorage.getItem("loginDetails")) {
  localStorage.setItem("loginDetails", JSON.stringify([
    Array.apply(null, Array(9)).map(() => Math.floor(Math.random() * 10)).join(""),
    crypto.randomBytes(8).toString("hex")
  ]));
};

Array.from(document.getElementById("actionContainer").children).forEach((actionElement, index) => {
  actionElement.addEventListener("click", () => {
    parent.document.getElementById("pageEmbed").src = "../" +  ((index) ? "scripts" : "monitor") + "/index.html";
    Array.from(parent.document.getElementById("menuBar").children).forEach((unhighlightingMenuBar) => {
      Array.from(unhighlightingMenuBar.children).forEach((unhighlightingMenuBarItem) => {
        unhighlightingMenuBarItem.style.backgroundColor = "#0b8acd99";
        unhighlightingMenuBarItem.className = "menuBarItem";
      });
    });
    parent.document.getElementById("menuBar").children[0].children[2 + index].style.backgroundColor = "#0c7cb7";
    parent.document.getElementById("menuBar").children[0].children[2 + index].classList.remove("menuBarItem");
  });
});

document.getElementById("connectionDetailContainer").children[0].children[1].innerText = JSON.parse(localStorage.getItem("loginDetails"))[0].split("").map((character, index) => (((index + 1) % 3) === 0) ? character + " " : character).join("").substring(0, JSON.parse(localStorage.getItem("loginDetails"))[0].split("").map((character, index) => (((index + 1) % 3) === 0) ? character + " " : character).join("").length - 1);
document.getElementById("connectionDetailContainer").children[2].children[1].innerText = JSON.parse(localStorage.getItem("loginDetails"))[1];
document.getElementById("connectionActionContainer").children[3].addEventListener("click", () => {
  if (!document.getElementById("connectionActionContainer").children[1].value || !document.getElementById("connectionActionContainer").children[2].value) return;
  let roomId = document.getElementById("connectionActionContainer").children[1].value;
  let password = document.getElementById("connectionActionContainer").children[2].value;
  document.getElementById("connectionActionContainer").children[1].value = "";
  document.getElementById("connectionActionContainer").children[2].value = "";
  let remoteControlWindow = window.open("../remoteControl/index.html", "_blank", "title=Remote Control,autoHideMenuBar=true,nodeIntegration=true,contextIsolation=false");
  remoteControlWindow.addEventListener("load", () => {
    remoteControlWindow.postMessage({
      roomId,
      password
    });
  });
});

document.getElementById("regenerateConnectionIcon").addEventListener("click", () => {
  localStorage.setItem("loginDetails", JSON.stringify([
    JSON.parse(localStorage.getItem("loginDetails"))[0],
    crypto.randomBytes(8).toString("hex")
  ]));
  document.getElementById("connectionDetailContainer").children[2].children[1].innerText = JSON.parse(localStorage.getItem("loginDetails"))[1];
  ipcRenderer.send("regenerateConnection", JSON.parse(localStorage.getItem("loginDetails"))[0]);
});

document.getElementById("copyConnectionIcon").addEventListener("click", () => {
  navigator.clipboard.writeText(JSON.parse(localStorage.getItem("loginDetails")).join(" "));
});