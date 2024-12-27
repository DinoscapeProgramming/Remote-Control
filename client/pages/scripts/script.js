const { ipcRenderer } = parent.require("electron");
const fs = parent.require("fs");
const os = parent.require("os");
const path = parent.require("path");
const crypto = parent.require("crypto");
let scriptEditor = ace.edit("scriptEditor");
scriptEditor.setTheme("ace/theme/monokai");
scriptEditor.session.setUseWorker(false);
scriptEditor.session.setMode(new (ace.require("ace/mode/javascript")).Mode());
scriptEditor.setOption("tabSize", 2);
scriptEditor.on("change", () => {
  fs.writeFileSync(path.join(parent.process.resourcesPath, "scripts/" + document.getElementById("scriptEditorContainer").dataset.id + ".js"), scriptEditor.getValue(), "utf8");
});
(new ResizeObserver(() => {
  scriptEditor.resize();
  scriptEditor.renderer.updateFull();
})).observe(document.getElementById("scriptEditor"));
window.process = {
  env: fs.readFileSync(path.join(parent.process.resourcesPath, "app.asar/.env"), "utf8").split("\n").filter((line) => !line.startsWith("#") && (line.split("=").length > 1)).map((line) => line.trim().split("#")[0].split("=")).reduce((data, accumulator) => ({
    ...data,
    ...{
      [accumulator[0]]: JSON.parse(accumulator[1].trim())
    }
  }), {})
};

if (!fs.readdirSync(parent.process.resourcesPath).includes("scripts")) fs.mkdirSync(path.join(parent.process.resourcesPath, "scripts"));

document.styleSheets[1].media.appendMedium("(prefers-color-scheme: " + (((JSON.parse(localStorage.getItem("settings")) || {}).darkMode) ? "dark" : "white") + ")");

(JSON.parse(localStorage.getItem("scripts")) || []).forEach(([scriptId, scriptName]) => {
  if (document.getElementById("scriptViewContainer").children[0].className === "scriptIcon") document.getElementById("scriptViewContainer").innerHTML = "";
  let scriptContainer = document.createElement("div");
  scriptContainer.dataset.id = scriptId;
  scriptContainer.style.display = "flex";
  scriptContainer.style.flexDirection = "row";
  scriptContainer.style.alignItems = "center";
  scriptContainer.style.width = "calc(100% - 30px)";
  scriptContainer.style.height = "47.5px";
  scriptContainer.style.marginTop = "12.5px";
  scriptContainer.style.marginLeft = "15px";
  scriptContainer.style.backgroundColor = "white";
  scriptContainer.style.borderRadius = "7.5px";
  scriptContainer.style.fontFamily = "system-ui";
  let scriptContainerName = document.createElement("input");
  scriptContainerName.value = scriptName;
  scriptContainerName.style.marginLeft = "6.5px";
  scriptContainerName.style.fontSize = "15px";
  scriptContainerName.style.fontWeight = "400";
  scriptContainerName.style.border = "none";
  scriptContainerName.style.padding = "8.5px";
  scriptContainerName.style.width = "calc(" + scriptName?.length?.toString() + "ch - 5px)";
  scriptContainerName.style.maxWidth = "68%;";
  scriptContainerName.addEventListener("input", ({ target }) => {
    scriptContainerName.style.width = "calc(" + target.value.length.toString() + "ch - 5px)";
  });
  scriptContainerName.addEventListener("change", ({ target }) => {
    if (!target.value) return;
    localStorage.setItem("scripts", JSON.stringify((JSON.parse(localStorage.getItem("scripts")) || []).map((script) => [
      script[0],
      (script[0] === scriptId) ? target.value : script[1]
    ])));
  });
  let scriptContainerButtonBox = document.createElement("div");
  scriptContainerButtonBox.style.display = "flex";
  scriptContainerButtonBox.style.flexDirection = "row";
  scriptContainerButtonBox.style.position = "absolute";
  scriptContainerButtonBox.style.right = "52.5px";
  let scriptContainerEditButton = document.createElement("div");
  scriptContainerEditButton.className = "scriptContainerButton";
  scriptContainerEditButton.style.cursor = "pointer";
  scriptContainerEditButton.style.width = "75px";
  scriptContainerEditButton.style.height = "30.5px";
  scriptContainerEditButton.style.color = "white";
  scriptContainerEditButton.style.backgroundColor = "#159be1";
  scriptContainerEditButton.style.borderRadius = "7.5px";
  scriptContainerEditButton.style.marginRight = "5px";
  scriptContainerEditButton.style.textAlign = "center";
  scriptContainerEditButton.addEventListener("click", () => {
    document.getElementById("scriptEditorContainer").dataset.id = scriptId;
    document.getElementById("scriptEditorContainerName").innerText = (scriptContainerName.value.split(" ").join("")) ? scriptContainerName.value : " ";
    scriptEditor.setValue(fs.readFileSync(path.join(parent.process.resourcesPath, "scripts/" + scriptId + ".js"), "utf8"));
    document.getElementById("scriptViewContainer").style.display = "none";
    document.getElementById("scriptEditorContainer").style.display = "block";
  });
  let scriptContainerEditButtonText = document.createElement("p");
  scriptContainerEditButtonText.style.fontSize = "15.25px";
  scriptContainerEditButtonText.style.marginTop = "5px";
  scriptContainerEditButtonText.innerText = "Edit";
  let scriptContainerExecuteSelect = document.createElement("select");
  scriptContainerExecuteSelect.className = "scriptContainerButton";
  scriptContainerExecuteSelect.style.cursor = "pointer";
  scriptContainerExecuteSelect.style.width = "82.5px";
  scriptContainerExecuteSelect.style.height = "30.5px";
  scriptContainerExecuteSelect.style.color = "white";
  scriptContainerExecuteSelect.style.backgroundColor = "#159be1";
  scriptContainerExecuteSelect.style.borderRadius = "7.5px";
  scriptContainerExecuteSelect.style.marginRight = "5px";
  scriptContainerExecuteSelect.style.textAlign = "center";
  scriptContainerExecuteSelect.style.border = "none";
  scriptContainerExecuteSelect.addEventListener("change", ({ target }) => {
    ipcRenderer.send("executeScript", {
      roomId: JSON.parse(target.value)[0],
      password: crypto.createHash("sha256").update(JSON.parse(target.value)[1]).digest("hex"),
      scriptContent: fs.readFileSync(path.join(parent.process.resourcesPath, "scripts/" + scriptId + ".js"), "utf8")
    });
    target.value = "defaultOption";
  });
  let scriptContainerExecuteSelectDefaultOption = document.createElement("option");
  scriptContainerExecuteSelectDefaultOption.style.display = "none";
  scriptContainerExecuteSelectDefaultOption.value = "defaultOption";
  scriptContainerExecuteSelectDefaultOption.innerText = "Execute";
  scriptContainerExecuteSelect.appendChild(scriptContainerExecuteSelectDefaultOption);
  [
    ...[
      [
        os.hostname() + " (me)",
        JSON.parse(localStorage.getItem("loginDetails"))[0],
        JSON.parse(localStorage.getItem("loginDetails"))[1]
      ]
    ],
    ...(JSON.parse(localStorage.getItem("history")) || []).filter(([_, deviceId]) => deviceId !== JSON.parse(localStorage.getItem("loginDetails"))[0])
  ].forEach(([deviceName, deviceId, devicePassword]) => {
    let scriptContainerExecuteSelectDeviceOption = document.createElement("option");
    scriptContainerExecuteSelectDeviceOption.value = JSON.stringify([
      deviceId,
      devicePassword
    ]);
    scriptContainerExecuteSelectDeviceOption.innerText = deviceName;
    scriptContainerExecuteSelect.appendChild(scriptContainerExecuteSelectDeviceOption);
  });
  scriptContainerExecuteSelect.value = "defaultOption";
  let scriptContainerButtonSeparationLine = document.createElement("div");
  scriptContainerButtonSeparationLine.style.width = "1px";
  scriptContainerButtonSeparationLine.style.height = "30.5px";
  scriptContainerButtonSeparationLine.style.backgroundColor = "#bfbfbfd9";
  scriptContainerButtonSeparationLine.style.opacity = "0.75";
  scriptContainerButtonSeparationLine.style.marginLeft = "5px";
  let scriptContainerDeleteButton = document.createElement("div");
  scriptContainerDeleteButton.className = "scriptContainerButton";
  scriptContainerDeleteButton.style.cursor = "pointer";
  scriptContainerDeleteButton.style.width = "30.5px";
  scriptContainerDeleteButton.style.height = "30.5px";
  scriptContainerDeleteButton.style.backgroundColor = "#159be1";
  scriptContainerDeleteButton.style.borderRadius = "7.5px";
  scriptContainerDeleteButton.style.marginLeft = "7.5px";
  scriptContainerDeleteButton.style.display = "flex";
  scriptContainerDeleteButton.style.justifyContent = "center";
  scriptContainerDeleteButton.style.alignItems = "center";
  scriptContainerDeleteButton.addEventListener("click", () => {
    if (!confirm("Are you sure you want to irreversibly delete this script containing its content?")) return;
    scriptContainer.remove();
    if (!document.getElementById("scriptViewContainer").children.length) {
      let scriptIconPlacementContainer = document.createElement("div");
      scriptIconPlacementContainer.className = "scriptIcon";
      scriptIconPlacementContainer.style.display = "flex";
      scriptIconPlacementContainer.style.justifyContent = "center";
      scriptIconPlacementContainer.style.alignItems = "center";
      scriptIconPlacementContainer.style.marginTop = "37.5px";
      scriptIconPlacementContainer.style.marginBottom = "25px";
      let scriptIconContainer = document.createElement("div");
      scriptIconContainer.style.display = "flex";
      scriptIconContainer.style.justifyContent = "center";
      scriptIconContainer.style.width = "8.75%";
      scriptIconContainer.style.aspectRatio = "1/1";
      scriptIconContainer.style.borderRadius = "15px";
      scriptIconContainer.style.backgroundColor = "#1de19e";
      let scriptIcon = document.createElement("i");
      scriptIcon.className = "fa fa-file-code-o";
      scriptIcon.ariaHidden = true;
      scriptIcon.style.fontSize = "3.675vw";
      scriptIcon.style.color = "white";
      scriptIcon.style.margin = "auto 0";
      scriptIconContainer.appendChild(scriptIcon);
      scriptIconPlacementContainer.appendChild(scriptIconContainer);
      document.getElementById("scriptViewContainer").appendChild(scriptIconPlacementContainer);
    };
    localStorage.setItem("scripts", JSON.stringify((JSON.parse(localStorage.getItem("scripts")) || []).filter((script) => script[0] !== scriptId)));
    try {
      fs.unlinkSync(path.join(parent.process.resourcesPath, "scripts/" + scriptId + ".js"));
    } catch {};
  });
  let scriptContainerDeleteButtonIcon = document.createElement("i");
  scriptContainerDeleteButtonIcon.className = "fa fa-trash";
  scriptContainerDeleteButtonIcon.ariaHidden = true;
  scriptContainerDeleteButtonIcon.style.color = "white";
  scriptContainerDeleteButtonIcon.style.fontSize = "19px";
  scriptContainerEditButton.appendChild(scriptContainerEditButtonText);
  scriptContainerDeleteButton.appendChild(scriptContainerDeleteButtonIcon);
  scriptContainerButtonBox.appendChild(scriptContainerEditButton);
  scriptContainerButtonBox.appendChild(scriptContainerExecuteSelect);
  scriptContainerButtonBox.appendChild(scriptContainerButtonSeparationLine);
  scriptContainerButtonBox.appendChild(scriptContainerDeleteButton);
  scriptContainer.appendChild(scriptContainerName);
  scriptContainer.appendChild(scriptContainerButtonBox);
  document.getElementById("scriptViewContainer").appendChild(scriptContainer);
});

document.getElementById("createScriptButton").addEventListener("click", () => {
  if (document.getElementById("scriptViewContainer").children[0].className === "scriptIcon") document.getElementById("scriptViewContainer").innerHTML = "";
  let scriptId = crypto.randomBytes(4).toString("hex");
  localStorage.setItem("scripts", JSON.stringify([
    ...JSON.parse(localStorage.getItem("scripts")) || [],
    ...[
      [
        scriptId,
        "Script"
      ]
    ]
  ]));
  fs.writeFileSync(path.join(parent.process.resourcesPath, "scripts/" + scriptId + ".js"), "/* Default Parameters include:\n  - window\n  - electron\n  - robotjs\n  - alert\n  - prompt\n  - confirm\n  - runPython\n  - executeInMainProcess\n  - createAppStartupCodeFile\n  - deleteAppStartupCodeFile\n*/", "utf8");
  let scriptContainer = document.createElement("div");
  scriptContainer.dataset.id = scriptId;
  scriptContainer.style.display = "flex";
  scriptContainer.style.flexDirection = "row";
  scriptContainer.style.alignItems = "center";
  scriptContainer.style.width = "calc(100% - 30px)";
  scriptContainer.style.height = "47.5px";
  scriptContainer.style.marginTop = "12.5px";
  scriptContainer.style.marginLeft = "15px";
  scriptContainer.style.backgroundColor = "white";
  scriptContainer.style.borderRadius = "7.5px";
  scriptContainer.style.fontFamily = "system-ui";
  let scriptContainerName = document.createElement("input");
  scriptContainerName.value = "Script";
  scriptContainerName.style.marginLeft = "6.5px";
  scriptContainerName.style.fontSize = "15px";
  scriptContainerName.style.fontWeight = "400";
  scriptContainerName.style.border = "none";
  scriptContainerName.style.padding = "8.5px";
  scriptContainerName.style.width = "calc(6ch - 5px)";
  scriptContainerName.style.maxWidth = "68%;";
  scriptContainerName.addEventListener("input", ({ target }) => {
    scriptContainerName.style.width = "calc(" + target.value.length.toString() + "ch - 5px)";
  });
  scriptContainerName.addEventListener("change", ({ target }) => {
    if (!target.value) return;
    localStorage.setItem("scripts", JSON.stringify((JSON.parse(localStorage.getItem("scripts")) || []).map((script) => [
      script[0],
      (script[0] === scriptId) ? target.value : script[1]
    ])));
  });
  scriptContainerName.select();
  let scriptContainerButtonBox = document.createElement("div");
  scriptContainerButtonBox.style.display = "flex";
  scriptContainerButtonBox.style.flexDirection = "row";
  scriptContainerButtonBox.style.position = "absolute";
  scriptContainerButtonBox.style.right = "52.5px";
  let scriptContainerEditButton = document.createElement("div");
  scriptContainerEditButton.className = "scriptContainerButton";
  scriptContainerEditButton.style.cursor = "pointer";
  scriptContainerEditButton.style.width = "75px";
  scriptContainerEditButton.style.height = "30.5px";
  scriptContainerEditButton.style.color = "white";
  scriptContainerEditButton.style.backgroundColor = "#159be1";
  scriptContainerEditButton.style.borderRadius = "7.5px";
  scriptContainerEditButton.style.marginRight = "5px";
  scriptContainerEditButton.style.textAlign = "center";
  scriptContainerEditButton.addEventListener("click", () => {
    document.getElementById("scriptEditorContainer").dataset.id = scriptId;
    document.getElementById("scriptEditorContainerName").innerText = (scriptContainerName.value.split(" ").join("")) ? scriptContainerName.value : " ";
    scriptEditor.setValue(fs.readFileSync(path.join(parent.process.resourcesPath, "scripts/" + scriptId + ".js"), "utf8"));
    document.getElementById("scriptViewContainer").style.display = "none";
    document.getElementById("scriptEditorContainer").style.display = "block";
  });
  let scriptContainerEditButtonText = document.createElement("p");
  scriptContainerEditButtonText.style.fontSize = "15.25px";
  scriptContainerEditButtonText.style.marginTop = "5px";
  scriptContainerEditButtonText.innerText = "Edit";
  let scriptContainerExecuteSelect = document.createElement("select");
  scriptContainerExecuteSelect.className = "scriptContainerButton";
  scriptContainerExecuteSelect.style.cursor = "pointer";
  scriptContainerExecuteSelect.style.width = "82.5px";
  scriptContainerExecuteSelect.style.height = "30.5px";
  scriptContainerExecuteSelect.style.color = "white";
  scriptContainerExecuteSelect.style.backgroundColor = "#159be1";
  scriptContainerExecuteSelect.style.borderRadius = "7.5px";
  scriptContainerExecuteSelect.style.marginRight = "5px";
  scriptContainerExecuteSelect.style.textAlign = "center";
  scriptContainerExecuteSelect.style.border = "none";
  scriptContainerExecuteSelect.addEventListener("change", ({ target }) => {
    ipcRenderer.send("executeScript", {
      roomId: JSON.parse(target.value)[0],
      password: crypto.createHash("sha256").update(JSON.parse(target.value)[1]).digest("hex"),
      scriptContent: fs.readFileSync(path.join(parent.process.resourcesPath, "scripts/" + scriptId + ".js"), "utf8")
    });
    target.value = "defaultOption";
  });
  let scriptContainerExecuteSelectDefaultOption = document.createElement("option");
  scriptContainerExecuteSelectDefaultOption.style.display = "none";
  scriptContainerExecuteSelectDefaultOption.value = "defaultOption";
  scriptContainerExecuteSelectDefaultOption.innerText = "Execute";
  scriptContainerExecuteSelect.appendChild(scriptContainerExecuteSelectDefaultOption);
  [
    ...[
      [
        os.hostname() + " (me)",
        JSON.parse(localStorage.getItem("loginDetails"))[0],
        JSON.parse(localStorage.getItem("loginDetails"))[1]
      ]
    ],
    ...(JSON.parse(localStorage.getItem("history")) || []).filter((_, deviceId) => deviceId !== JSON.parse(localStorage.getItem("loginDetails"))[0])
  ].forEach(([deviceName, deviceId, devicePassword]) => {
    let scriptContainerExecuteSelectDeviceOption = document.createElement("option");
    scriptContainerExecuteSelectDeviceOption.value = JSON.stringify([
      deviceId,
      devicePassword
    ]);
    scriptContainerExecuteSelectDeviceOption.innerText = deviceName;
    scriptContainerExecuteSelect.appendChild(scriptContainerExecuteSelectDeviceOption);
  });
  let scriptContainerButtonSeparationLine = document.createElement("div");
  scriptContainerButtonSeparationLine.style.width = "1px";
  scriptContainerButtonSeparationLine.style.height = "30.5px";
  scriptContainerButtonSeparationLine.style.backgroundColor = "#bfbfbfd9";
  scriptContainerButtonSeparationLine.style.opacity = "0.75";
  scriptContainerButtonSeparationLine.style.marginLeft = "5px";
  let scriptContainerDeleteButton = document.createElement("div");
  scriptContainerDeleteButton.className = "scriptContainerButton";
  scriptContainerDeleteButton.style.cursor = "pointer";
  scriptContainerDeleteButton.style.width = "30.5px";
  scriptContainerDeleteButton.style.height = "30.5px";
  scriptContainerDeleteButton.style.backgroundColor = "#159be1";
  scriptContainerDeleteButton.style.borderRadius = "7.5px";
  scriptContainerDeleteButton.style.marginLeft = "7.5px";
  scriptContainerDeleteButton.style.display = "flex";
  scriptContainerDeleteButton.style.justifyContent = "center";
  scriptContainerDeleteButton.style.alignItems = "center";
  scriptContainerDeleteButton.addEventListener("click", () => {
    if (!confirm("Are you sure you want to irreversibly delete this script containing its code?")) return;
    scriptContainer.remove();
    if (!document.getElementById("scriptViewContainer").children.length) {
      let scriptIconPlacementContainer = document.createElement("div");
      scriptIconPlacementContainer.className = "scriptIcon";
      scriptIconPlacementContainer.style.display = "flex";
      scriptIconPlacementContainer.style.justifyContent = "center";
      scriptIconPlacementContainer.style.alignItems = "center";
      scriptIconPlacementContainer.style.marginTop = "37.5px";
      scriptIconPlacementContainer.style.marginBottom = "25px";
      let scriptIconContainer = document.createElement("div");
      scriptIconContainer.style.display = "flex";
      scriptIconContainer.style.justifyContent = "center";
      scriptIconContainer.style.width = "8.75%";
      scriptIconContainer.style.aspectRatio = "1/1";
      scriptIconContainer.style.borderRadius = "15px";
      scriptIconContainer.style.backgroundColor = "#1de19e";
      let scriptIcon = document.createElement("i");
      scriptIcon.className = "fa fa-file-code-o";
      scriptIcon.ariaHidden = true;
      scriptIcon.style.fontSize = "3.675vw";
      scriptIcon.style.color = "white";
      scriptIcon.style.margin = "auto 0";
      scriptIconContainer.appendChild(scriptIcon);
      scriptIconPlacementContainer.appendChild(scriptIconContainer);
      document.getElementById("scriptViewContainer").appendChild(scriptIconPlacementContainer);
    };
    localStorage.setItem("scripts", JSON.stringify((JSON.parse(localStorage.getItem("scripts")) || []).filter((script) => script[0] !== scriptId)));
    try {
      fs.unlinkSync(path.join(parent.process.resourcesPath, "scripts/" + scriptId + ".js"));
    } catch {};
  });
  let scriptContainerDeleteButtonIcon = document.createElement("i");
  scriptContainerDeleteButtonIcon.className = "fa fa-trash";
  scriptContainerDeleteButtonIcon.ariaHidden = true;
  scriptContainerDeleteButtonIcon.style.color = "white";
  scriptContainerDeleteButtonIcon.style.fontSize = "19px";
  scriptContainerEditButton.appendChild(scriptContainerEditButtonText);
  scriptContainerDeleteButton.appendChild(scriptContainerDeleteButtonIcon);
  scriptContainerButtonBox.appendChild(scriptContainerEditButton);
  scriptContainerButtonBox.appendChild(scriptContainerExecuteSelect);
  scriptContainerButtonBox.appendChild(scriptContainerButtonSeparationLine);
  scriptContainerButtonBox.appendChild(scriptContainerDeleteButton);
  scriptContainer.appendChild(scriptContainerName);
  scriptContainer.appendChild(scriptContainerButtonBox);
  document.getElementById("scriptViewContainer").appendChild(scriptContainer);
  document.getElementById("scriptStoreContainer").style.display = "none";
  document.getElementById("scriptEditorContainer").style.display = "none";
  document.getElementById("scriptViewContainer").style.display = "block";
  document.getElementById("createScriptButton").style.right = "120px";
  document.getElementById("openStoreButton").children[0].className = "fa fa-download";
  document.getElementById("openStoreButton").childNodes[2].nodeValue = "\nOpen Store\n";
});

document.getElementById("scriptEditorContainerBackButton").addEventListener("click", () => {
  document.getElementById("scriptEditorContainer").style.display = "none";
  document.getElementById("scriptViewContainer").style.display = "block";
});

fetch(((Object.keys(JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8"))).length) ? (JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8")).resourceProtocol + "//" + JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8")).resourceHostname + ((JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8")).resourcePort) ? (":" + JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8")).resourcePort) : "")) : (process.env.DEFAULT_RESOURCE_SERVER_PROTOCOL + "//" + process.env.DEFAULT_RESOURCE_SERVER_HOSTNAME + ((process.env.DEFAULT_RESOURCE_SERVER_PORT) ? (":" + process.env.DEFAULT_RESOURCE_SERVER_PORT) : ""))) + "/api/v1/apps/get")
.then((response) => response.json())
.then(({ err, apps }) => {
  if (err) return;
  Object.entries(apps || {}).sort((previousApp, nextApp) => nextApp[1].downloads - previousApp[1].downloads).forEach(([appId, { iconExtension, name, description, verified }]) => {
    if (document.getElementById("scriptStoreContainer").children[0].className === "scriptIcon") document.getElementById("scriptStoreContainer").innerHTML = "";
    let appContainer = document.createElement("div");
    appContainer.dataset.id = appId;
    appContainer.style.display = "flex";
    appContainer.style.flexDirection = "column";
    appContainer.style.width = "calc(1005 - 30px)";
    appContainer.style.backgroundColor = "white";
    appContainer.style.marginTop = "10px";
    appContainer.style.marginLeft = "15px";
    appContainer.style.borderRadius = "12.5px";
    let appDataContainer = document.createElement("div");
    appDataContainer.style.display = "flex";
    appDataContainer.style.flexDirection = "row";
    let appDataContainerIcon = document.createElement("img");
    appDataContainerIcon.style.width = "90px";
    appDataContainerIcon.style.padding = "20px";
    appDataContainerIcon.src = ((Object.keys(JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8"))).length) ? (JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8")).resourceProtocol + "//" + JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8")).resourceHostname + ((JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8")).resourcePort) ? (":" + JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8")).resourcePort) : "")) : (process.env.DEFAULT_RESOURCE_SERVER_PROTOCOL + "//" + process.env.DEFAULT_RESOURCE_SERVER_HOSTNAME + ((process.env.DEFAULT_RESOURCE_SERVER_PORT) ? (":" + process.env.DEFAULT_RESOURCE_SERVER_PORT) : ""))) + "/apps/icons/" + appId + "." + iconExtension;
    appDataContainerIcon.alt = "App Icon";
    let appDataTextContainer = document.createElement("div");
    appDataTextContainer.style.display = "flex";
    appDataTextContainer.style.flexDirection = "column";
    appDataTextContainer.style.fontFamily = "system-ui";
    let appDataTextNameContainer = document.createElement("div");
    appDataTextNameContainer.style.display = "flex";
    appDataTextNameContainer.style.flexDirection = "row";
    let appDataTextContainerName = document.createElement("h2");
    appDataTextContainerName.style.color = "black";
    appDataTextContainerName.style.marginTop = "16.5px";
    appDataTextContainerName.style.marginBottom = "0";
    appDataTextContainerName.innerText = name;
    let appDataTextContainerIcon;
    if (verified) {
      appDataTextContainerIcon = document.createElement("i");
      appDataTextContainerIcon.className = "fa fa-check-circle";
      appDataTextContainerIcon.ariaHidden = true;
      appDataTextContainerIcon.style.color = "#007bffc7";
      appDataTextContainerIcon.style.fontSize = "25px";
      appDataTextContainerIcon.style.marginTop = "21px";
      appDataTextContainerIcon.style.marginLeft = "6.25px";
    };
    let appDataTextContainerDescription = document.createElement("p");
    appDataTextContainerDescription.style.color = "black";
    appDataTextContainerDescription.style.marginTop = "7.5px";
    appDataTextContainerDescription.style.marginBottom = "22.5px";
    appDataTextContainerDescription.style.fontSize = "14px";
    appDataTextContainerDescription.innerText = description;
    let appInstallButtonHolder = document.createElement("div");
    appInstallButtonHolder.style.paddingBottom = "20px";
    let appInstallButton = document.createElement("button");
    appInstallButton.className = "scriptContainerButton";
    appInstallButton.style.width = "calc(100% - 52.5px)";
    appInstallButton.style.height = "27.5px";
    appInstallButton.style.fontFamily = "system-ui";
    appInstallButton.style.border = "none";
    appInstallButton.style.borderRadius = "7.5px";
    appInstallButton.style.color = "white";
    appInstallButton.style.backgroundColor = "#159be1";
    appInstallButton.style.paddingTop = "7.5px";
    appInstallButton.style.paddingBottom = "25px";
    appInstallButton.style.marginTop = "-2.75px";
    appInstallButton.style.marginLeft = "26.5px";
    appInstallButton.style.cursor = "pointer";
    let appInstallButtonIcon = document.createElement("i");
    appInstallButtonIcon.className = "fa fa-download";
    appInstallButtonIcon.ariaHidden = true;
    appInstallButtonIcon.style.marginRight = "2px";
    appInstallButton.addEventListener("click", () => {
      if (!verified && !confirm("Are you sure you want install this unverified app possibly corrupting your computer?")) return;
      fetch(((Object.keys(JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8"))).length) ? (JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8")).resourceProtocol + "//" + JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8")).resourceHostname + ((JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8")).resourcePort) ? (":" + JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8")).resourcePort) : "")) : (process.env.DEFAULT_RESOURCE_SERVER_PROTOCOL + "//" + process.env.DEFAULT_RESOURCE_SERVER_HOSTNAME + ((process.env.DEFAULT_RESOURCE_SERVER_PORT) ? (":" + process.env.DEFAULT_RESOURCE_SERVER_PORT) : ""))) + "/apps/code/" + appId + ".js")
      .then((response) => response.text())
      .then((appContent) => {
        document.getElementById("createScriptButton").click();
        Array.from(document.getElementById("scriptViewContainer").children).at(-1).children[0].value = name;
        Array.from(document.getElementById("scriptViewContainer").children).at(-1).children[0].style.width = "calc(" + name.length.toString() + "ch - 5px)";
        localStorage.setItem("scripts", JSON.stringify([
          ...(JSON.parse(localStorage.getItem("scripts")) || []).toSpliced(-1),
          ...[
            [
              Array.from(document.getElementById("scriptViewContainer").children).at(-1).dataset.id,
              name
            ]
          ]
        ]));
        fs.writeFileSync(path.join(parent.process.resourcesPath, "scripts/" + Array.from(document.getElementById("scriptViewContainer").children).at(-1).dataset.id + ".js"), appContent, "utf8");
      })
      .catch(() => {});
    });
    let appInstallButtonText = document.createTextNode("Install App");
    appDataTextNameContainer.appendChild(appDataTextContainerName);
    if (verified) appDataTextNameContainer.appendChild(appDataTextContainerIcon);
    appDataTextContainer.appendChild(appDataTextNameContainer);
    appDataTextContainer.appendChild(appDataTextContainerDescription);
    appDataContainer.appendChild(appDataContainerIcon);
    appDataContainer.appendChild(appDataTextContainer);
    appInstallButton.appendChild(appInstallButtonIcon);
    appInstallButton.appendChild(appInstallButtonText);
    appInstallButtonHolder.appendChild(appInstallButton);
    appContainer.appendChild(appDataContainer);
    appContainer.appendChild(appInstallButtonHolder);
    document.getElementById("scriptStoreContainer").appendChild(appContainer);
  });
})
.catch(() => {});

document.getElementById("openStoreButton").addEventListener("click", () => {
  if (document.getElementById("openStoreButton").children[0].className === "fa fa-download") {
    document.getElementById("scriptViewContainer").style.display = "none";
    document.getElementById("scriptEditorContainer").style.display = "none";
    document.getElementById("scriptStoreContainer").style.display = "flex";
    document.getElementById("createScriptButton").style.right = "80px";
    document.getElementById("openStoreButton").children[0].className = "fa fa-arrow-left";
    document.getElementById("openStoreButton").childNodes[2].nodeValue = "\nBack\n";
  } else {
    document.getElementById("scriptStoreContainer").style.display = "none";
    document.getElementById("scriptEditorContainer").style.display = "none";
    document.getElementById("scriptViewContainer").style.display = "block";
    document.getElementById("createScriptButton").style.right = "120px";
    document.getElementById("openStoreButton").children[0].className = "fa fa-download";
    document.getElementById("openStoreButton").childNodes[2].nodeValue = "\nOpen Store\n";
  };
});