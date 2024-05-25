const { ipcRenderer } = parent.require("electron");
const path = parent.require("path");
const crypto = parent.require("crypto");

if (!localStorage.getItem("loginDetails")) {
  localStorage.setItem("loginDetails", JSON.stringify([
    Array.apply(null, Array(9)).map(() => Math.floor(Math.random() * 10)).join(""),
    crypto.randomBytes(8).toString("hex")
  ]));
};

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

(JSON.parse(localStorage.getItem("history")) || []).reverse().forEach(([deviceName, deviceId, devicePassword]) => {
  if (document.getElementById("historyContainer").children[0].className === "historyIcon") document.getElementById("historyContainer").innerHTML = "";
  let deviceContainer = document.createElement("div");
  deviceContainer.style.display = "flex";
  deviceContainer.style.flexDirection = "column";
  deviceContainer.style.border = "1px solid #bfbfbf5c";
  deviceContainer.style.width = "calc(100% - 30px)";
  deviceContainer.style.height = "60px";
  deviceContainer.style.marginTop = (document.getElementById("historyContainer").children.length) ? "6.5px" : "13.75px";
  deviceContainer.style.marginLeft = "15px";
  deviceContainer.style.backgroundColor = "white";
  deviceContainer.style.borderRadius = "15px";
  deviceContainer.style.fontFamily = "system-ui";
  let deviceContainerName = document.createElement("h3");
  deviceContainerName.style.color = "black";
  deviceContainerName.style.fontWeight = "600";
  deviceContainerName.style.marginTop = "8.75px";
  deviceContainerName.style.marginBottom = "0";
  deviceContainerName.style.marginLeft = "13.5px";
  deviceContainerName.innerText = deviceName;
  let deviceContainerData = document.createElement("div");
  deviceContainerData.style.display = "flex";
  deviceContainerData.style.flexDirection = "row";
  deviceContainerData.style.marginLeft = "13.75px";
  let deviceContainerDataId = document.createElement("p");
  deviceContainerDataId.style.color = "black";
  deviceContainerDataId.style.marginTop = "1px";
  deviceContainerDataId.style.fontSize = "12.5px";
  deviceContainerDataId.innerText = "ID: " + deviceId.split("").map((character, index) => (((index + 1) % 3) === 0) ? character + " " : character).join("").substring(0, deviceId.split("").map((character, index) => (((index + 1) % 3) === 0) ? character + " " : character).join("").length - 1);;
  deviceContainerDataSeparationLine = document.createElement("div");
  deviceContainerDataSeparationLine.style.width = "1px";
  deviceContainerDataSeparationLine.style.height = "15.25px";
  deviceContainerDataSeparationLine.style.backgroundColor = "#bfbfbf8f";
  deviceContainerDataSeparationLine.style.marginTop = "2.225px";
  deviceContainerDataSeparationLine.style.marginLeft = "7.5px";
  let deviceContainerDataPassword = document.createElement("p");
  deviceContainerDataPassword.style.color = "black";
  deviceContainerDataPassword.style.marginTop = "1px";
  deviceContainerDataPassword.style.marginLeft = "9.5px";
  deviceContainerDataPassword.style.fontSize = "12.5px";
  deviceContainerDataPassword.innerText = "Password: " + devicePassword;
  let deviceContainerConnectButton = document.createElement("div");
  deviceContainerConnectButton.className = "deviceContainerConnectButton";
  deviceContainerConnectButton.style.cursor = "pointer";
  deviceContainerConnectButton.style.position = "absolute";
  deviceContainerConnectButton.style.right = "47.5px";
  deviceContainerConnectButton.style.width = "32.5px";
  deviceContainerConnectButton.style.height = "32.5px";
  deviceContainerConnectButton.style.borderRadius = "10px";
  deviceContainerConnectButton.style.backgroundColor = "#159be1";
  deviceContainerConnectButton.style.marginTop = "15px";
  if ((JSON.parse(localStorage.getItem("settings")) || {}).darkMode) deviceContainerConnectButton.style.filter = "invert(95%) hue-rotate(180deg)";
  deviceContainerConnectButton.addEventListener("click", () => {
    let remoteControlWindow = window.open("../remoteControl/index.html", "_blank", "title=Remote Control,autoHideMenuBar=true,nodeIntegration=true,contextIsolation=false");
    remoteControlWindow.addEventListener("load", () => {
      remoteControlWindow.postMessage({
        roomId: deviceId,
        password: devicePassword
      });
    });
  });
  let deviceContainerConnectButtonIcon = document.createElement("i");
  deviceContainerConnectButtonIcon.className = "fa fa-plug";
  deviceContainerConnectButtonIcon.ariaHidden = true;
  deviceContainerConnectButtonIcon.style.position = "absolute";
  deviceContainerConnectButtonIcon.style.top = "50%";
  deviceContainerConnectButtonIcon.style.left = "50%";
  deviceContainerConnectButtonIcon.style.transform = "translate(-50%, -50%)";
  deviceContainerData.appendChild(deviceContainerDataId);
  deviceContainerData.appendChild(deviceContainerDataSeparationLine);
  deviceContainerData.appendChild(deviceContainerDataPassword);
  deviceContainerConnectButton.appendChild(deviceContainerConnectButtonIcon);
  deviceContainer.appendChild(deviceContainerName);
  deviceContainer.appendChild(deviceContainerData);
  deviceContainer.appendChild(deviceContainerConnectButton);
  document.getElementById("historyContainer").appendChild(deviceContainer);
});