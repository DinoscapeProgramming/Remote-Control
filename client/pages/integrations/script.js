const { shell } = parent.require("electron");
const fs = parent.require("fs");
const path = parent.require("path");
const crypto = parent.require("crypto");
let discordBotEditor = ace.edit("discordBotEditor");
discordBotEditor.setTheme("ace/theme/monokai");
discordBotEditor.session.setUseWorker(false);
discordBotEditor.session.setMode(new (ace.require("ace/mode/javascript")).Mode());
discordBotEditor.setOption("tabSize", 2);
discordBotEditor.on("change", () => {
  fs.writeFileSync(path.join(parent.process.resourcesPath, "discordBots/" + document.getElementById("discordBotEditorContainer").dataset.id + ".js"), discordBotEditor.getValue(), "utf8");
});
(new ResizeObserver(() => {
  discordBotEditor.resize();
  discordBotEditor.renderer.updateFull();
})).observe(document.getElementById("discordBotEditor"));
window.process = {
  env: fs.readFileSync(path.join(parent.process.resourcesPath, "app.asar/.env"), "utf8").split("\n").filter((line) => !line.startsWith("#") && (line.split("=").length > 1)).map((line) => line.trim().split("#")[0].split("=")).reduce((data, accumulator) => ({
    ...data,
    ...{
      [accumulator[0]]: JSON.parse(accumulator[1].trim())
    }
  }), {})
};

if (!fs.readdirSync(parent.process.resourcesPath).includes("discordBots")) fs.mkdirSync(path.join(parent.process.resourcesPath, "discordBots"));

(JSON.parse(localStorage.getItem("throwAwayPasswords") || "[]") || []).forEach(([throwAwayPasswordCode, throwAwayPasswordUses]) => {
  if (document.getElementById("integrationContainer").getElementsByClassName("integrationIcon").length) document.getElementById("integrationContainer").getElementsByClassName("integrationIcon")[0].remove();
  document.getElementById("throwAwayPasswordCategoryText").style.display = "block";
  document.getElementById("throwAwayPasswordCategorySeparationLine").style.display = "block";
  document.getElementById("throwAwayPasswordContainer").style.display = "block";
  let throwAwayPasswordContainer = document.createElement("div");
  throwAwayPasswordContainer.dataset.id = throwAwayPasswordCode;
  throwAwayPasswordContainer.style.display = "flex";
  throwAwayPasswordContainer.style.flexDirection = "row";
  throwAwayPasswordContainer.style.alignItems = "center";
  throwAwayPasswordContainer.style.width = "calc(100% - 30px)";
  throwAwayPasswordContainer.style.height = "47.5px";
  throwAwayPasswordContainer.style.marginTop = "7.5px";
  throwAwayPasswordContainer.style.marginLeft = "15px";
  throwAwayPasswordContainer.style.backgroundColor = "white";
  throwAwayPasswordContainer.style.borderRadius = "7.5px";
  throwAwayPasswordContainer.style.fontFamily = "system-ui";
  let throwAwayPasswordContainerCode = document.createElement("input");
  throwAwayPasswordContainerCode.value = "Throw-Away Password";
  throwAwayPasswordContainerCode.style.marginLeft = "6.5px";
  throwAwayPasswordContainerCode.style.fontSize = "15px";
  throwAwayPasswordContainerCode.style.fontWeight = "400";
  throwAwayPasswordContainerCode.style.border = "none";
  throwAwayPasswordContainerCode.style.padding = "8.5px";
  throwAwayPasswordContainerCode.style.width = "calc(19ch - 5px)";
  throwAwayPasswordContainerCode.style.maxWidth = "68%;";
  throwAwayPasswordContainerCode.addEventListener("input", ({ target }) => {
    throwAwayPasswordContainerCode.style.width = "calc(" + target.value.length.toString() + "ch - 5px)";
  });
  throwAwayPasswordContainerCode.addEventListener("change", ({ target }) => {
    if (!target.value) return;
    localStorage.setItem("throwAwayPasswords", JSON.stringify((JSON.parse(localStorage.getItem("throwAwayPasswords") || "[]") || []).map((throwAwayPassword) => [
      (throwAwayPassword[0] === throwAwayPasswordCode) ? target.value : throwAwayPassword[0],
      throwAwayPassword[1]
    ])));
    throwAwayPasswordCode = target.value;
  });
  let throwAwayPasswordContainerButtonBox = document.createElement("div");
  throwAwayPasswordContainerButtonBox.style.display = "flex";
  throwAwayPasswordContainerButtonBox.style.flexDirection = "row";
  throwAwayPasswordContainerButtonBox.style.position = "absolute";
  throwAwayPasswordContainerButtonBox.style.right = "52.5px";
  let throwAwayPasswordContainerUseDisplay = document.createElement("div");
  throwAwayPasswordContainerUseDisplay.style.display = "flex";
  throwAwayPasswordContainerUseDisplay.style.justifyContent = "center";
  throwAwayPasswordContainerUseDisplay.style.alignItems = "center";
  throwAwayPasswordContainerUseDisplay.style.width = "72.5px";
  throwAwayPasswordContainerUseDisplay.style.height = "30.5px";
  throwAwayPasswordContainerUseDisplay.style.color = "white";
  throwAwayPasswordContainerUseDisplay.style.backgroundColor = "rgb(21, 155, 225)";
  throwAwayPasswordContainerUseDisplay.style.borderRadius = "7.5px";
  throwAwayPasswordContainerUseDisplay.style.marginRight = "5px";
  throwAwayPasswordContainerUseDisplay.style.textAlign = "center";
  throwAwayPasswordContainerUseDisplay.style.border = "none";
  let throwAwayPasswordContainerUseDisplayInput = document.createElement("input");
  throwAwayPasswordContainerUseDisplayInput.value = throwAwayPasswordUses.toString();
  throwAwayPasswordContainerUseDisplayInput.type = "number";
  throwAwayPasswordContainerUseDisplayInput.className = "throwAwayPasswordContainerUseDisplayInput";
  throwAwayPasswordContainerUseDisplayInput.style.width = "calc(1ch + 1px)";
  throwAwayPasswordContainerUseDisplayInput.style.border = "none";
  throwAwayPasswordContainerUseDisplayInput.style.color = "white";
  throwAwayPasswordContainerUseDisplayInput.style.backgroundColor = "transparent";
  throwAwayPasswordContainerUseDisplayInput.style.fontSize = "12.5px";
  throwAwayPasswordContainerUseDisplayInput.style.fontFamily = "system-ui";
  throwAwayPasswordContainerUseDisplayInput.style.marginBottom = "0.75px";
  throwAwayPasswordContainerUseDisplayInput.style.marginRight = "1px";
  throwAwayPasswordContainerUseDisplayInput.addEventListener("input", ({ target }) => {
    throwAwayPasswordContainerUseDisplay.style.width = "calc(72.5px + " + (target.value.length - 1).toString() + "ch)";
    throwAwayPasswordContainerUseDisplayInput.style.width = "calc(" + target.value.length.toString() + "ch + 1px)";
    throwAwayPasswordContainerUseDisplayInput.nextElementSibling.innerText = " use" + ((target.value.length - 1) ? "s" : "") + " left";
  });
  throwAwayPasswordContainerUseDisplayInput.addEventListener("change", ({ target }) => {
    if (!target.value) return;
    localStorage.setItem("throwAwayPasswords", JSON.stringify((JSON.parse(localStorage.getItem("throwAwayPasswords") || "[]") || []).map((throwAwayPassword) => [
      throwAwayPassword[0],
      (throwAwayPassword[0] === throwAwayPasswordCode) ? Number(target.value) : throwAwayPassword[1]
    ])));
  });
  let throwAwayPasswordContainerUseDisplayText = document.createElement("span");
  throwAwayPasswordContainerUseDisplayText.style.fontSize = "12.25px";
  throwAwayPasswordContainerUseDisplayText.style.marginBottom = "2px";
  throwAwayPasswordContainerUseDisplayText.style.marginRight = "calc(1.5px + 0.25ch)";
  throwAwayPasswordContainerUseDisplayText.innerText = " use left";
  let throwAwayPasswordContainerButtonSeparationLine = document.createElement("div");
  throwAwayPasswordContainerButtonSeparationLine.style.width = "1px";
  throwAwayPasswordContainerButtonSeparationLine.style.height = "30.5px";
  throwAwayPasswordContainerButtonSeparationLine.style.backgroundColor = "rgba(191, 191, 191, 0.85)";
  throwAwayPasswordContainerButtonSeparationLine.style.opacity = "0.75";
  throwAwayPasswordContainerButtonSeparationLine.style.marginLeft = "5px";
  let throwAwayPasswordContainerCopyButton = document.createElement("div");
  throwAwayPasswordContainerCopyButton.className = "throwAwayPasswordContainerButton";
  throwAwayPasswordContainerCopyButton.style.cursor = "pointer";
  throwAwayPasswordContainerCopyButton.style.width = "30.5px";
  throwAwayPasswordContainerCopyButton.style.height = "30.5px";
  throwAwayPasswordContainerCopyButton.style.backgroundColor = "rgb(21, 155, 225)";
  throwAwayPasswordContainerCopyButton.style.borderRadius = "7.5px";
  throwAwayPasswordContainerCopyButton.style.marginLeft = "7.5px";
  throwAwayPasswordContainerCopyButton.style.display = "flex";
  throwAwayPasswordContainerCopyButton.style.justifyContent = "center";
  throwAwayPasswordContainerCopyButton.style.alignItems = "center";
  throwAwayPasswordContainerCopyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(throwAwayPasswordContainerCode.value);
  });
  let throwAwayPasswordContainerCopyButtonIcon = document.createElement("i");
  throwAwayPasswordContainerCopyButtonIcon.className = "fa fa-clipboard";
  throwAwayPasswordContainerCopyButtonIcon.ariaHidden = true;
  throwAwayPasswordContainerCopyButtonIcon.style.color = "white";
  throwAwayPasswordContainerCopyButtonIcon.style.fontSize = "14px";
  throwAwayPasswordContainerCopyButtonIcon.style.marginLeft = "1px";
  let throwAwayPasswordContainerDeleteButton = document.createElement("div");
  throwAwayPasswordContainerDeleteButton.className = "throwAwayPasswordContainerButton";
  throwAwayPasswordContainerDeleteButton.style.cursor = "pointer";
  throwAwayPasswordContainerDeleteButton.style.width = "30.5px";
  throwAwayPasswordContainerDeleteButton.style.height = "30.5px";
  throwAwayPasswordContainerDeleteButton.style.backgroundColor = "rgb(21, 155, 225)";
  throwAwayPasswordContainerDeleteButton.style.borderRadius = "7.5px";
  throwAwayPasswordContainerDeleteButton.style.marginLeft = "5px";
  throwAwayPasswordContainerDeleteButton.style.display = "flex";
  throwAwayPasswordContainerDeleteButton.style.justifyContent = "center";
  throwAwayPasswordContainerDeleteButton.style.alignItems = "center";
  throwAwayPasswordContainerDeleteButton.addEventListener("click", () => {
    if (!confirm("Are you sure you want to irreversibly delete this throw-away password?")) return;
    throwAwayPasswordContainer.remove();
    if (!document.getElementById("throwAwayPasswordContainer").children.length) {
      document.getElementById("throwAwayPasswordCategoryText").style.display = "none";
      document.getElementById("throwAwayPasswordCategorySeparationLine").style.display = "none";
      document.getElementById("throwAwayPasswordContainer").style.display = "none";
      if (!document.getElementById("discordBotContainer").children.length) {
        let integrationIconPlacementContainer = document.createElement("div");
        integrationIconPlacementContainer.className = "integrationIcon";
        integrationIconPlacementContainer.style.display = "flex";
        integrationIconPlacementContainer.style.justifyContent = "center";
        integrationIconPlacementContainer.style.alignItems = "center";
        integrationIconPlacementContainer.style.marginTop = "37.5px";
        integrationIconPlacementContainer.style.marginBottom = "25px";
        let integrationIconContainer = document.createElement("div");
        integrationIconContainer.style.display = "flex";
        integrationIconContainer.style.justifyContent = "center";
        integrationIconContainer.style.width = "8.75%";
        integrationIconContainer.style.aspectRatio = "1/1";
        integrationIconContainer.style.borderRadius = "15px";
        integrationIconContainer.style.backgroundColor = "#1de19e";
        let integrationIcon = document.createElement("i");
        integrationIcon.className = "fa fa-chain-broken";
        integrationIcon.ariaHidden = true;
        integrationIcon.style.fontSize = "3.675vw";
        integrationIcon.style.color = "white";
        integrationIcon.style.margin = "auto 0";
        integrationIconContainer.appendChild(integrationIcon);
        integrationIconPlacementContainer.appendChild(integrationIconContainer);
        document.getElementById("integrationContainer").insertBefore(integrationIconPlacementContainer, document.getElementById("throwAwayPasswordCategoryText"));
      };
    };
    localStorage.setItem("throwAwayPasswords", JSON.stringify((JSON.parse(localStorage.getItem("throwAwayPasswords") || "[]") || []).filter((throwAwayPassword) => throwAwayPassword[0] !== throwAwayPasswordCode)));
  });
  let throwAwayPasswordContainerDeleteButtonIcon = document.createElement("i");
  throwAwayPasswordContainerDeleteButtonIcon.className = "fa fa-trash";
  throwAwayPasswordContainerDeleteButtonIcon.ariaHidden = true;
  throwAwayPasswordContainerDeleteButtonIcon.style.color = "white";
  throwAwayPasswordContainerDeleteButtonIcon.style.fontSize = "19px";
  throwAwayPasswordContainerUseDisplay.appendChild(throwAwayPasswordContainerUseDisplayInput);
  throwAwayPasswordContainerUseDisplay.appendChild(throwAwayPasswordContainerUseDisplayText);
  throwAwayPasswordContainerCopyButton.appendChild(throwAwayPasswordContainerCopyButtonIcon);
  throwAwayPasswordContainerDeleteButton.appendChild(throwAwayPasswordContainerDeleteButtonIcon);
  throwAwayPasswordContainerButtonBox.appendChild(throwAwayPasswordContainerUseDisplay);
  throwAwayPasswordContainerButtonBox.appendChild(throwAwayPasswordContainerButtonSeparationLine);
  throwAwayPasswordContainerButtonBox.appendChild(throwAwayPasswordContainerCopyButton);
  throwAwayPasswordContainerButtonBox.appendChild(throwAwayPasswordContainerDeleteButton);
  throwAwayPasswordContainer.appendChild(throwAwayPasswordContainerCode);
  throwAwayPasswordContainer.appendChild(throwAwayPasswordContainerButtonBox);
  document.getElementById("throwAwayPasswordContainer").appendChild(throwAwayPasswordContainer);
});

(JSON.parse(localStorage.getItem("discordBots") || "[]") || []).forEach(([discordBotId, discordBotName]) => {
  if (document.getElementById("integrationContainer").getElementsByClassName("integrationIcon").length) document.getElementById("integrationContainer").getElementsByClassName("integrationIcon")[0].remove();
  document.getElementById("discordBotCategoryText").style.display = "block";
  document.getElementById("discordBotCategorySeparationLine").style.display = "block";
  document.getElementById("discordBotContainer").style.display = "block";
  let discordBotContainer = document.createElement("div");
  discordBotContainer.dataset.id = discordBotId;
  discordBotContainer.style.display = "flex";
  discordBotContainer.style.flexDirection = "row";
  discordBotContainer.style.alignItems = "center";
  discordBotContainer.style.width = "calc(100% - 30px)";
  discordBotContainer.style.height = "47.5px";
  discordBotContainer.style.marginTop = "7.5px";
  discordBotContainer.style.marginLeft = "15px";
  discordBotContainer.style.backgroundColor = "white";
  discordBotContainer.style.borderRadius = "7.5px";
  discordBotContainer.style.fontFamily = "system-ui";
  let discordBotContainerName = document.createElement("input");
  discordBotContainerName.value = discordBotName;
  discordBotContainerName.style.marginLeft = "6.5px";
  discordBotContainerName.style.fontSize = "15px";
  discordBotContainerName.style.fontWeight = "400";
  discordBotContainerName.style.border = "none";
  discordBotContainerName.style.padding = "8.5px";
  discordBotContainerName.style.width = "calc(11ch - 5px)";
  discordBotContainerName.addEventListener("input", ({ target }) => {
    discordBotContainerName.style.width = "calc(" + target.value.length.toString() + "ch - 5px)";
  });
  discordBotContainerName.addEventListener("change", ({ target }) => {
    if (!target.value) return;
    localStorage.setItem("discordBots", JSON.stringify((JSON.parse(localStorage.getItem("discordBots") || "[]") || []).map((discordBot) => [
      discordBot[0],
      (discordBot[0] === discordBotId) ? target.value : discordBot[1],
      discordBot[2]
    ])));
  });
  let discordBotContainerButtonBox = document.createElement("div");
  discordBotContainerButtonBox.style.display = "flex";
  discordBotContainerButtonBox.style.flexDirection = "row";
  discordBotContainerButtonBox.style.position = "absolute";
  discordBotContainerButtonBox.style.right = "52.5px";
  let discordBotContainerEditButton = document.createElement("div");
  discordBotContainerEditButton.className = "discordBotContainerButton";
  discordBotContainerEditButton.style.cursor = "pointer";
  discordBotContainerEditButton.style.width = "75px";
  discordBotContainerEditButton.style.height = "30.5px";
  discordBotContainerEditButton.style.color = "white";
  discordBotContainerEditButton.style.backgroundColor = "#159be1";
  discordBotContainerEditButton.style.borderRadius = "7.5px";
  discordBotContainerEditButton.style.marginRight = "5px";
  discordBotContainerEditButton.style.textAlign = "center";
  discordBotContainerEditButton.addEventListener("click", () => {
    document.getElementById("discordBotEditorContainer").dataset.id = discordBotId;
    document.getElementById("discordBotEditorContainerName").innerText = (discordBotContainerName.value.split(" ").join("")) ? discordBotContainerName.value : " ";
    if ((JSON.parse(localStorage.getItem("discordBots") || "[]") || []).find((discordBot) => discordBot[0] === discordBotId)[2].length < ((document.getElementById("discordBotEditorContainerSecrets").children[0].children.length) - 1)) {
      Array.from(document.getElementById("discordBotEditorContainerSecrets").children[0].children).slice(0, -1).forEach((discordBotEditorContainerSecret, index) => {
        if (!index || (index > (JSON.parse(localStorage.getItem("discordBots") || "[]") || []).find((discordBot) => discordBot[0] === discordBotId)[2].length)) return ((index) ? discordBotEditorContainerSecret.remove() : null);
        discordBotEditorContainerSecret.children[0].children[0].value = (JSON.parse(localStorage.getItem("discordBots") || "[]") || []).find((discordBot) => discordBot[0] === discordBotId)[2][index - 1][0];
        discordBotEditorContainerSecret.children[1].children[0].value = (JSON.parse(localStorage.getItem("discordBots") || "[]") || []).find((discordBot) => discordBot[0] === discordBotId)[2][index - 1][1];
      });
    } else {
      Array.from(document.getElementById("discordBotEditorContainerSecrets").children[0].children).slice(0, -1).forEach((discordBotEditorContainerSecret, index) => {
        if (!index) return;
        discordBotEditorContainerSecret.children[0].children[0].value = (JSON.parse(localStorage.getItem("discordBots") || "[]") || []).find((discordBot) => discordBot[0] === discordBotId)[2][index - 1][0];
        discordBotEditorContainerSecret.children[1].children[0].value = (JSON.parse(localStorage.getItem("discordBots") || "[]") || []).find((discordBot) => discordBot[0] === discordBotId)[2][index - 1][1];
      });
      Object.entries((JSON.parse(localStorage.getItem("discordBots") || "[]") || []).find((discordBot) => discordBot[0] === discordBotId)[2]).slice(2).forEach((discordBotSecret) => {
        let discordBotEditorContainerSecret = document.createElement("tr");
        let discordBotEditorContainerSecretName = document.createElement("td");
        discordBotEditorContainerSecretName.style.border = "1px solid #dddddd";
        let discordBotEditorContainerSecretNameInput = document.createElement("input");
        discordBotEditorContainerSecretNameInput.value = discordBotSecret[0];
        discordBotEditorContainerSecretNameInput.style.width = "calc(100% - 15px)";
        discordBotEditorContainerSecretNameInput.style.border = "none";
        discordBotEditorContainerSecretNameInput.style.backgroundColor = "transparent";
        discordBotEditorContainerSecretNameInput.style.padding = "8px";
        discordBotEditorContainerSecretNameInput.style.fontFamily = "system-ui";
        discordBotEditorContainerSecretNameInput.addEventListener("change", ({ target }) => {
          localStorage.setItem("discordBots", JSON.stringify((JSON.parse(localStorage.getItem("discordBots") || "[]") || []).map((discordBot) => (discordBot[0] === document.getElementById("discordBotEditorContainer").dataset.id) ? discordBot.map((discordBotItem, index) => (index === 2) ? discordBotItem.map((discordBotSecret, index) => (index === (Array.from(document.getElementById("discordBotEditorContainerSecrets").children[0].children).indexOf(discordBotEditorContainerSecret) - 1)) ? [
            target.value,
            discordBotSecret[1]
          ] : discordBotSecret) : discordBotItem) : discordBot)));
        });
        let discordBotEditorContainerSecretValue = document.createElement("td");
        discordBotEditorContainerSecretValue.style.border = "1px solid #dddddd";
        let discordBotEditorContainerSecretValueInput = document.createElement("input");
        discordBotEditorContainerSecretValueInput.value = discordBotSecret[0];
        discordBotEditorContainerSecretValueInput.style.width = "calc(100% - 15px)";
        discordBotEditorContainerSecretValueInput.style.border = "none";
        discordBotEditorContainerSecretValueInput.style.backgroundColor = "transparent";
        discordBotEditorContainerSecretValueInput.style.padding = "8px";
        discordBotEditorContainerSecretValueInput.style.fontFamily = "system-ui";
        discordBotEditorContainerSecretValueInput.addEventListener("change", ({ target }) => {
          localStorage.setItem("discordBots", JSON.stringify((JSON.parse(localStorage.getItem("discordBots") || "[]") || []).map((discordBot) => (discordBot[0] === document.getElementById("discordBotEditorContainer").dataset.id) ? discordBot.map((discordBotItem, index) => (index === 2) ? discordBotItem.map((discordBotSecret, index) => (index === (Array.from(document.getElementById("discordBotEditorContainerSecrets").children[0].children).indexOf(discordBotEditorContainerSecret) - 1)) ? [
            discordBotSecret[0],
            target.value
          ] : discordBotSecret) : discordBotItem) : discordBot)));
        });
        let discordBotEditorContainerSecretDeleteButton = document.createElement("td");
        discordBotEditorContainerSecretDeleteButton.style.cursor = "pointer";
        discordBotEditorContainerSecretDeleteButton.style.border = "1px solid #dddddd";
        discordBotEditorContainerSecretDeleteButton.addEventListener("click", () => {
          if (!confirm("Are you sure you want to irreversibly delete this secret containing its value?")) return;
          discordBotEditorContainerSecret.remove();
          localStorage.setItem("discordBots", JSON.stringify((JSON.parse(localStorage.getItem("discordBots") || "[]") || []).map((discordBot) => (discordBot[0] === document.getElementById("discordBotEditorContainer").dataset.id) ? discordBot.map((discordBotItem, index) => (index === 2) ? discordBotItem.filter((_, index) => (index !== (Array.from(document.getElementById("discordBotEditorContainerSecrets").children[0].children).indexOf(discordBotEditorContainerSecret) - 1))) : discordBotItem) : discordBot)));
        });
        let discordBotEditorContainerSecretDeleteButtonIcon = document.createElement("i");
        discordBotEditorContainerSecretDeleteButtonIcon.className = "fa fa-trash";
        discordBotEditorContainerSecretDeleteButtonIcon.ariaHidden = true;
        discordBotEditorContainerSecretDeleteButtonIcon.style.width = "6.5px";
        discordBotEditorContainerSecretDeleteButtonIcon.style.fontSize = "20px";
        discordBotEditorContainerSecretDeleteButtonIcon.style.marginLeft = "7.5px";
        discordBotEditorContainerSecretName.appendChild(discordBotEditorContainerSecretNameInput);
        discordBotEditorContainerSecretValue.appendChild(discordBotEditorContainerSecretValueInput);
        discordBotEditorContainerSecretDeleteButton.appendChild(discordBotEditorContainerSecretDeleteButtonIcon);
        discordBotEditorContainerSecret.appendChild(discordBotEditorContainerSecretName);
        discordBotEditorContainerSecret.appendChild(discordBotEditorContainerSecretValue);
        discordBotEditorContainerSecret.appendChild(discordBotEditorContainerSecretDeleteButton);
        document.getElementById("discordBotEditorContainerSecrets").children[0].insertBefore(discordBotEditorContainerSecret, Array.from(document.getElementById("discordBotEditorContainerSecrets").children).at(-1));
      });
    };
    discordBotEditor.setValue(fs.readFileSync(path.join(parent.process.resourcesPath, "discordBots/" + discordBotId + ".js"), "utf8"));
    document.getElementById("integrationContainer").style.display = "none";
    document.getElementById("discordBotEditorContainer").style.display = "block";
  });
  let discordBotContainerEditButtonText = document.createElement("p");
  discordBotContainerEditButtonText.style.fontSize = "15.25px";
  discordBotContainerEditButtonText.style.marginTop = "5px";
  discordBotContainerEditButtonText.innerText = "Edit";
  let discordBotContainerInviteButton = document.createElement("div");
  discordBotContainerInviteButton.className = "discordBotContainerButton";
  discordBotContainerInviteButton.style.cursor = "pointer";
  discordBotContainerInviteButton.style.width = "75px";
  discordBotContainerInviteButton.style.height = "30.5px";
  discordBotContainerInviteButton.style.color = "white";
  discordBotContainerInviteButton.style.backgroundColor = "#159be1";
  discordBotContainerInviteButton.style.borderRadius = "7.5px";
  discordBotContainerInviteButton.style.marginRight = "5px";
  discordBotContainerInviteButton.style.textAlign = "center";
  discordBotContainerInviteButton.addEventListener("click", () => {
    shell.openExternal("https://discord.com/oauth2/authorize?client_id=" + (JSON.parse((localStorage.getItem("discordBots") || "[]") || []).find((discordBot) => discordBot[0] === discordBotId)[2].CLIENT_ID || "") + "&permissions=8&scope=bot");
  });
  let discordBotContainerInviteButtonText = document.createElement("p");
  discordBotContainerInviteButtonText.style.fontSize = "15.25px";
  discordBotContainerInviteButtonText.style.marginTop = "5px";
  discordBotContainerInviteButtonText.innerText = "Invite";
  let discordBotContainerButtonSeparationLine = document.createElement("div");
  discordBotContainerButtonSeparationLine.style.width = "1px";
  discordBotContainerButtonSeparationLine.style.height = "30.5px";
  discordBotContainerButtonSeparationLine.style.backgroundColor = "rgba(191, 191, 191, 0.85)";
  discordBotContainerButtonSeparationLine.style.opacity = "0.75";
  discordBotContainerButtonSeparationLine.style.marginLeft = "5px";
  let discordBotContainerDeleteButton = document.createElement("div");
  discordBotContainerDeleteButton.className = "discordBotContainerButton";
  discordBotContainerDeleteButton.style.cursor = "pointer";
  discordBotContainerDeleteButton.style.width = "30.5px";
  discordBotContainerDeleteButton.style.height = "30.5px";
  discordBotContainerDeleteButton.style.backgroundColor = "rgb(21, 155, 225)";
  discordBotContainerDeleteButton.style.borderRadius = "7.5px";
  discordBotContainerDeleteButton.style.marginLeft = "7.5px";
  discordBotContainerDeleteButton.style.display = "flex";
  discordBotContainerDeleteButton.style.justifyContent = "center";
  discordBotContainerDeleteButton.style.alignItems = "center";
  discordBotContainerDeleteButton.addEventListener("click", () => {
    if (!confirm("Are you sure you want to irreversibly delete this Discord Bot containing its code?")) return;
    discordBotContainer.remove();
    if (!document.getElementById("discordBotContainer").children.length) {
      document.getElementById("discordBotCategoryText").style.display = "none";
      document.getElementById("discordBotCategorySeparationLine").style.display = "none";
      document.getElementById("discordBotContainer").style.display = "none";
      if (!document.getElementById("throwAwayPasswordContainer").children.length) {
        let integrationIconPlacementContainer = document.createElement("div");
        integrationIconPlacementContainer.className = "integrationIcon";
        integrationIconPlacementContainer.style.display = "flex";
        integrationIconPlacementContainer.style.justifyContent = "center";
        integrationIconPlacementContainer.style.alignItems = "center";
        integrationIconPlacementContainer.style.marginTop = "37.5px";
        integrationIconPlacementContainer.style.marginBottom = "25px";
        let integrationIconContainer = document.createElement("div");
        integrationIconContainer.style.display = "flex";
        integrationIconContainer.style.justifyContent = "center";
        integrationIconContainer.style.width = "8.75%";
        integrationIconContainer.style.aspectRatio = "1/1";
        integrationIconContainer.style.borderRadius = "15px";
        integrationIconContainer.style.backgroundColor = "#1de19e";
        let integrationIcon = document.createElement("i");
        integrationIcon.className = "fa fa-chain-broken";
        integrationIcon.ariaHidden = true;
        integrationIcon.style.fontSize = "3.675vw";
        integrationIcon.style.color = "white";
        integrationIcon.style.margin = "auto 0";
        integrationIconContainer.appendChild(integrationIcon);
        integrationIconPlacementContainer.appendChild(integrationIconContainer);
        document.getElementById("integrationContainer").insertBefore(integrationIconPlacementContainer, document.getElementById("throwAwayPasswordCategoryText"));
      };
    };
    localStorage.setItem("discordBots", JSON.stringify((JSON.parse(localStorage.getItem("discordBots") || "[]") || []).filter((discordBot) => discordBot[0] !== discordBotId)));
    try {
      fs.unlinkSync(path.join(parent.process.resourcesPath, "discordBots/" + discordBotId + ".js"));
    } catch {};
  });
  let discordBotContainerDeleteButtonIcon = document.createElement("i");
  discordBotContainerDeleteButtonIcon.className = "fa fa-trash";
  discordBotContainerDeleteButtonIcon.ariaHidden = true;
  discordBotContainerDeleteButtonIcon.style.color = "white";
  discordBotContainerDeleteButtonIcon.style.fontSize = "19px";
  discordBotContainerEditButton.appendChild(discordBotContainerEditButtonText);
  discordBotContainerInviteButton.appendChild(discordBotContainerInviteButtonText);
  discordBotContainerDeleteButton.appendChild(discordBotContainerDeleteButtonIcon);
  discordBotContainerButtonBox.appendChild(discordBotContainerEditButton);
  discordBotContainerButtonBox.appendChild(discordBotContainerInviteButton);
  discordBotContainerButtonBox.appendChild(discordBotContainerButtonSeparationLine);
  discordBotContainerButtonBox.appendChild(discordBotContainerDeleteButton);
  discordBotContainer.appendChild(discordBotContainerName);
  discordBotContainer.appendChild(discordBotContainerButtonBox);
  document.getElementById("discordBotContainer").appendChild(discordBotContainer);
});

document.getElementById("createThrowAwayPasswordButton").addEventListener("click", () => {
  if (document.getElementById("integrationContainer").getElementsByClassName("integrationIcon").length) document.getElementById("integrationContainer").getElementsByClassName("integrationIcon")[0].remove();
  document.getElementById("throwAwayPasswordCategoryText").style.display = "block";
  document.getElementById("throwAwayPasswordCategorySeparationLine").style.display = "block";
  document.getElementById("throwAwayPasswordContainer").style.display = "block";
  let throwAwayPasswordCode = crypto.randomBytes(8).toString("hex");
  localStorage.setItem("throwAwayPasswords", JSON.stringify([
    ...JSON.parse(localStorage.getItem("throwAwayPasswords") || "[]") || [],
    ...[
      [
        throwAwayPasswordCode,
        1
      ]
    ]
  ]));
  let throwAwayPasswordContainer = document.createElement("div");
  throwAwayPasswordContainer.dataset.id = throwAwayPasswordCode;
  throwAwayPasswordContainer.style.display = "flex";
  throwAwayPasswordContainer.style.flexDirection = "row";
  throwAwayPasswordContainer.style.alignItems = "center";
  throwAwayPasswordContainer.style.width = "calc(100% - 30px)";
  throwAwayPasswordContainer.style.height = "47.5px";
  throwAwayPasswordContainer.style.marginTop = "7.5px";
  throwAwayPasswordContainer.style.marginLeft = "15px";
  throwAwayPasswordContainer.style.backgroundColor = "white";
  throwAwayPasswordContainer.style.borderRadius = "7.5px";
  throwAwayPasswordContainer.style.fontFamily = "system-ui";
  let throwAwayPasswordContainerCode = document.createElement("input");
  throwAwayPasswordContainerCode.value = throwAwayPasswordCode;
  throwAwayPasswordContainerCode.style.marginLeft = "6.5px";
  throwAwayPasswordContainerCode.style.fontSize = "15px";
  throwAwayPasswordContainerCode.style.fontWeight = "400";
  throwAwayPasswordContainerCode.style.border = "none";
  throwAwayPasswordContainerCode.style.padding = "8.5px";
  throwAwayPasswordContainerCode.style.width = "calc(19ch - 5px)";
  throwAwayPasswordContainerCode.style.maxWidth = "68%;";
  throwAwayPasswordContainerCode.addEventListener("input", ({ target }) => {
    throwAwayPasswordContainerCode.style.width = "calc(" + target.value.length.toString() + "ch - 5px)";
  });
  throwAwayPasswordContainerCode.addEventListener("change", ({ target }) => {
    if (!target.value) return;
    localStorage.setItem("throwAwayPasswords", JSON.stringify((JSON.parse(localStorage.getItem("throwAwayPasswords") || "[]") || []).map((throwAwayPassword) => [
      (throwAwayPassword[0] === throwAwayPasswordCode) ? target.value : throwAwayPassword[0],
      throwAwayPassword[1]
    ])));
    throwAwayPasswordCode = target.value;
  });
  let throwAwayPasswordContainerButtonBox = document.createElement("div");
  throwAwayPasswordContainerButtonBox.style.display = "flex";
  throwAwayPasswordContainerButtonBox.style.flexDirection = "row";
  throwAwayPasswordContainerButtonBox.style.position = "absolute";
  throwAwayPasswordContainerButtonBox.style.right = "52.5px";
  let throwAwayPasswordContainerUseDisplay = document.createElement("div");
  throwAwayPasswordContainerUseDisplay.style.display = "flex";
  throwAwayPasswordContainerUseDisplay.style.justifyContent = "center";
  throwAwayPasswordContainerUseDisplay.style.alignItems = "center";
  throwAwayPasswordContainerUseDisplay.style.width = "72.5px";
  throwAwayPasswordContainerUseDisplay.style.height = "30.5px";
  throwAwayPasswordContainerUseDisplay.style.color = "white";
  throwAwayPasswordContainerUseDisplay.style.backgroundColor = "rgb(21, 155, 225)";
  throwAwayPasswordContainerUseDisplay.style.borderRadius = "7.5px";
  throwAwayPasswordContainerUseDisplay.style.marginRight = "5px";
  throwAwayPasswordContainerUseDisplay.style.textAlign = "center";
  throwAwayPasswordContainerUseDisplay.style.border = "none";
  let throwAwayPasswordContainerUseDisplayInput = document.createElement("input");
  throwAwayPasswordContainerUseDisplayInput.value = "1";
  throwAwayPasswordContainerUseDisplayInput.type = "number";
  throwAwayPasswordContainerUseDisplayInput.className = "throwAwayPasswordContainerUseDisplayInput";
  throwAwayPasswordContainerUseDisplayInput.style.width = "calc(1ch + 1px)";
  throwAwayPasswordContainerUseDisplayInput.style.border = "none";
  throwAwayPasswordContainerUseDisplayInput.style.color = "white";
  throwAwayPasswordContainerUseDisplayInput.style.backgroundColor = "transparent";
  throwAwayPasswordContainerUseDisplayInput.style.fontSize = "12.5px";
  throwAwayPasswordContainerUseDisplayInput.style.fontFamily = "system-ui";
  throwAwayPasswordContainerUseDisplayInput.style.marginBottom = "0.75px";
  throwAwayPasswordContainerUseDisplayInput.style.marginRight = "1px";
  throwAwayPasswordContainerUseDisplayInput.addEventListener("input", ({ target }) => {
    throwAwayPasswordContainerUseDisplay.style.width = "calc(72.5px + " + (target.value.length - 1).toString() + "ch)";
    throwAwayPasswordContainerUseDisplayInput.style.width = "calc(" + target.value.length.toString() + "ch + 1px)";
    throwAwayPasswordContainerUseDisplayInput.nextElementSibling.innerText = " use" + ((target.value.length - 1) ? "s" : "") + " left";
  });
  throwAwayPasswordContainerUseDisplayInput.addEventListener("change", ({ target }) => {
    if (!target.value) return;
    localStorage.setItem("throwAwayPasswords", JSON.stringify((JSON.parse(localStorage.getItem("throwAwayPasswords") || "[]") || []).map((throwAwayPassword) => [
      throwAwayPassword[0],
      (throwAwayPassword[0] === throwAwayPasswordCode) ? Number(target.value) : throwAwayPassword[1]
    ])));
  });
  let throwAwayPasswordContainerUseDisplayText = document.createElement("span");
  throwAwayPasswordContainerUseDisplayText.style.fontSize = "12.25px";
  throwAwayPasswordContainerUseDisplayText.style.marginBottom = "2px";
  throwAwayPasswordContainerUseDisplayText.style.marginRight = "calc(1.5px + 0.25ch)";
  throwAwayPasswordContainerUseDisplayText.innerText = " use left";
  let throwAwayPasswordContainerButtonSeparationLine = document.createElement("div");
  throwAwayPasswordContainerButtonSeparationLine.style.width = "1px";
  throwAwayPasswordContainerButtonSeparationLine.style.height = "30.5px";
  throwAwayPasswordContainerButtonSeparationLine.style.backgroundColor = "rgba(191, 191, 191, 0.85)";
  throwAwayPasswordContainerButtonSeparationLine.style.opacity = "0.75";
  throwAwayPasswordContainerButtonSeparationLine.style.marginLeft = "5px";
  let throwAwayPasswordContainerCopyButton = document.createElement("div");
  throwAwayPasswordContainerCopyButton.className = "throwAwayPasswordContainerButton";
  throwAwayPasswordContainerCopyButton.style.cursor = "pointer";
  throwAwayPasswordContainerCopyButton.style.width = "30.5px";
  throwAwayPasswordContainerCopyButton.style.height = "30.5px";
  throwAwayPasswordContainerCopyButton.style.backgroundColor = "rgb(21, 155, 225)";
  throwAwayPasswordContainerCopyButton.style.borderRadius = "7.5px";
  throwAwayPasswordContainerCopyButton.style.marginLeft = "7.5px";
  throwAwayPasswordContainerCopyButton.style.display = "flex";
  throwAwayPasswordContainerCopyButton.style.justifyContent = "center";
  throwAwayPasswordContainerCopyButton.style.alignItems = "center";
  throwAwayPasswordContainerCopyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(throwAwayPasswordContainerCode.value);
  });
  let throwAwayPasswordContainerCopyButtonIcon = document.createElement("i");
  throwAwayPasswordContainerCopyButtonIcon.className = "fa fa-clipboard";
  throwAwayPasswordContainerCopyButtonIcon.ariaHidden = true;
  throwAwayPasswordContainerCopyButtonIcon.style.color = "white";
  throwAwayPasswordContainerCopyButtonIcon.style.fontSize = "14px";
  throwAwayPasswordContainerCopyButtonIcon.style.marginLeft = "1px";
  let throwAwayPasswordContainerDeleteButton = document.createElement("div");
  throwAwayPasswordContainerDeleteButton.className = "throwAwayPasswordContainerButton";
  throwAwayPasswordContainerDeleteButton.style.cursor = "pointer";
  throwAwayPasswordContainerDeleteButton.style.width = "30.5px";
  throwAwayPasswordContainerDeleteButton.style.height = "30.5px";
  throwAwayPasswordContainerDeleteButton.style.backgroundColor = "rgb(21, 155, 225)";
  throwAwayPasswordContainerDeleteButton.style.borderRadius = "7.5px";
  throwAwayPasswordContainerDeleteButton.style.marginLeft = "5px";
  throwAwayPasswordContainerDeleteButton.style.display = "flex";
  throwAwayPasswordContainerDeleteButton.style.justifyContent = "center";
  throwAwayPasswordContainerDeleteButton.style.alignItems = "center";
  throwAwayPasswordContainerDeleteButton.addEventListener("click", () => {
    if (!confirm("Are you sure you want to irreversibly delete this throw-away password?")) return;
    throwAwayPasswordContainer.remove();
    if (!document.getElementById("throwAwayPasswordContainer").children.length) {
      document.getElementById("throwAwayPasswordCategoryText").style.display = "none";
      document.getElementById("throwAwayPasswordCategorySeparationLine").style.display = "none";
      document.getElementById("throwAwayPasswordContainer").style.display = "none";
      if (!document.getElementById("discordBotContainer").children.length) {
        let integrationIconPlacementContainer = document.createElement("div");
        integrationIconPlacementContainer.className = "integrationIcon";
        integrationIconPlacementContainer.style.display = "flex";
        integrationIconPlacementContainer.style.justifyContent = "center";
        integrationIconPlacementContainer.style.alignItems = "center";
        integrationIconPlacementContainer.style.marginTop = "37.5px";
        integrationIconPlacementContainer.style.marginBottom = "25px";
        let integrationIconContainer = document.createElement("div");
        integrationIconContainer.style.display = "flex";
        integrationIconContainer.style.justifyContent = "center";
        integrationIconContainer.style.width = "8.75%";
        integrationIconContainer.style.aspectRatio = "1/1";
        integrationIconContainer.style.borderRadius = "15px";
        integrationIconContainer.style.backgroundColor = "#1de19e";
        let integrationIcon = document.createElement("i");
        integrationIcon.className = "fa fa-chain-broken";
        integrationIcon.ariaHidden = true;
        integrationIcon.style.fontSize = "3.675vw";
        integrationIcon.style.color = "white";
        integrationIcon.style.margin = "auto 0";
        integrationIconContainer.appendChild(integrationIcon);
        integrationIconPlacementContainer.appendChild(integrationIconContainer);
        document.getElementById("integrationContainer").insertBefore(integrationIconPlacementContainer, document.getElementById("throwAwayPasswordCategoryText"));
      };
    };
    localStorage.setItem("throwAwayPasswords", JSON.stringify((JSON.parse(localStorage.getItem("throwAwayPasswords") || "[]") || []).filter((throwAwayPassword) => throwAwayPassword[0] !== throwAwayPasswordCode)));
  });
  let throwAwayPasswordContainerDeleteButtonIcon = document.createElement("i");
  throwAwayPasswordContainerDeleteButtonIcon.className = "fa fa-trash";
  throwAwayPasswordContainerDeleteButtonIcon.ariaHidden = true;
  throwAwayPasswordContainerDeleteButtonIcon.style.color = "white";
  throwAwayPasswordContainerDeleteButtonIcon.style.fontSize = "19px";
  throwAwayPasswordContainerUseDisplay.appendChild(throwAwayPasswordContainerUseDisplayInput);
  throwAwayPasswordContainerUseDisplay.appendChild(throwAwayPasswordContainerUseDisplayText);
  throwAwayPasswordContainerCopyButton.appendChild(throwAwayPasswordContainerCopyButtonIcon);
  throwAwayPasswordContainerDeleteButton.appendChild(throwAwayPasswordContainerDeleteButtonIcon);
  throwAwayPasswordContainerButtonBox.appendChild(throwAwayPasswordContainerUseDisplay);
  throwAwayPasswordContainerButtonBox.appendChild(throwAwayPasswordContainerButtonSeparationLine);
  throwAwayPasswordContainerButtonBox.appendChild(throwAwayPasswordContainerCopyButton);
  throwAwayPasswordContainerButtonBox.appendChild(throwAwayPasswordContainerDeleteButton);
  throwAwayPasswordContainer.appendChild(throwAwayPasswordContainerCode);
  throwAwayPasswordContainer.appendChild(throwAwayPasswordContainerButtonBox);
  document.getElementById("throwAwayPasswordContainer").appendChild(throwAwayPasswordContainer);
});

document.getElementById("connectToDiscordBotButton").addEventListener("click", () => {
  if (document.getElementById("integrationContainer").getElementsByClassName("integrationIcon").length) document.getElementById("integrationContainer").getElementsByClassName("integrationIcon")[0].remove();
  document.getElementById("discordBotCategoryText").style.display = "block";
  document.getElementById("discordBotCategorySeparationLine").style.display = "block";
  document.getElementById("discordBotContainer").style.display = "block";
  let discordBotId = crypto.randomBytes(4).toString("hex");
  localStorage.setItem("discordBots", JSON.stringify([
    ...JSON.parse(localStorage.getItem("discordBots") || "[]") || [],
    ...[
      [
        discordBotId,
        "Discord Bot",
        [
          [
            "TOKEN",
            "YOUR TOKEN"
          ],
          [
            "CLIENT_ID",
            "YOUR CLIENT ID"
          ]
        ]
      ]
    ]
  ]));
  fs.writeFileSync(path.join(parent.process.resourcesPath, "discordBots/" + discordBotId + ".js"), "/* Default Parameters include:\n  - window\n  - electron\n  - robotjs\n  - alert\n  - prompt\n  - confirm\n  - runPython\n  - executeInMainProcess\n  - createAppStartupCodeFile\n  - deleteAppStartupCodeFile\n*/", "utf8");
  let discordBotContainer = document.createElement("div");
  discordBotContainer.dataset.id = discordBotId;
  discordBotContainer.style.display = "flex";
  discordBotContainer.style.flexDirection = "row";
  discordBotContainer.style.alignItems = "center";
  discordBotContainer.style.width = "calc(100% - 30px)";
  discordBotContainer.style.height = "47.5px";
  discordBotContainer.style.marginTop = "7.5px";
  discordBotContainer.style.marginLeft = "15px";
  discordBotContainer.style.backgroundColor = "white";
  discordBotContainer.style.borderRadius = "7.5px";
  discordBotContainer.style.fontFamily = "system-ui";
  let discordBotContainerName = document.createElement("input");
  discordBotContainerName.value = "Discord Bot";
  discordBotContainerName.style.marginLeft = "6.5px";
  discordBotContainerName.style.fontSize = "15px";
  discordBotContainerName.style.fontWeight = "400";
  discordBotContainerName.style.border = "none";
  discordBotContainerName.style.padding = "8.5px";
  discordBotContainerName.style.width = "calc(11ch - 5px)";
  discordBotContainerName.addEventListener("input", ({ target }) => {
    discordBotContainerName.style.width = "calc(" + target.value.length.toString() + "ch - 5px)";
  });
  discordBotContainerName.addEventListener("change", ({ target }) => {
    if (!target.value) return;
    localStorage.setItem("discordBots", JSON.stringify((JSON.parse(localStorage.getItem("discordBots") || "[]") || []).map((discordBot) => [
      discordBot[0],
      (discordBot[0] === discordBotId) ? target.value : discordBot[1],
      discordBot[2]
    ])));
  });
  let discordBotContainerButtonBox = document.createElement("div");
  discordBotContainerButtonBox.style.display = "flex";
  discordBotContainerButtonBox.style.flexDirection = "row";
  discordBotContainerButtonBox.style.position = "absolute";
  discordBotContainerButtonBox.style.right = "52.5px";
  let discordBotContainerEditButton = document.createElement("div");
  discordBotContainerEditButton.className = "discordBotContainerButton";
  discordBotContainerEditButton.style.cursor = "pointer";
  discordBotContainerEditButton.style.width = "75px";
  discordBotContainerEditButton.style.height = "30.5px";
  discordBotContainerEditButton.style.color = "white";
  discordBotContainerEditButton.style.backgroundColor = "#159be1";
  discordBotContainerEditButton.style.borderRadius = "7.5px";
  discordBotContainerEditButton.style.marginRight = "5px";
  discordBotContainerEditButton.style.textAlign = "center";
  discordBotContainerEditButton.addEventListener("click", () => {
    document.getElementById("discordBotEditorContainer").dataset.id = discordBotId;
    document.getElementById("discordBotEditorContainerName").innerText = (discordBotContainerName.value.split(" ").join("")) ? discordBotContainerName.value : " ";
    if ((JSON.parse(localStorage.getItem("discordBots") || "[]") || []).find((discordBot) => discordBot[0] === discordBotId)[2].length < (document.getElementById("discordBotEditorContainerSecrets").children[0].children.length - 1)) {
      Array.from(document.getElementById("discordBotEditorContainerSecrets").children[0].children).slice(0, -1).forEach((discordBotEditorContainerSecret, index) => {
        if (!index || (index > (JSON.parse(localStorage.getItem("discordBots") || "[]") || []).find((discordBot) => discordBot[0] === discordBotId)[2].length)) return ((index) ? discordBotEditorContainerSecret.remove() : null);
        discordBotEditorContainerSecret.children[0].children[0].value = (JSON.parse(localStorage.getItem("discordBots") || "[]") || []).find((discordBot) => discordBot[0] === discordBotId)[2][index - 1][0];
        discordBotEditorContainerSecret.children[1].children[0].value = (JSON.parse(localStorage.getItem("discordBots") || "[]") || []).find((discordBot) => discordBot[0] === discordBotId)[2][index - 1][1];
      });
    } else {
      Array.from(document.getElementById("discordBotEditorContainerSecrets").children[0].children).slice(0, -1).forEach((discordBotEditorContainerSecret, index) => {
        if (!index) return;
        discordBotEditorContainerSecret.children[0].children[0].value = (JSON.parse(localStorage.getItem("discordBots") || "[]") || []).find((discordBot) => discordBot[0] === discordBotId)[2][index - 1][0];
        discordBotEditorContainerSecret.children[1].children[0].value = (JSON.parse(localStorage.getItem("discordBots") || "[]") || []).find((discordBot) => discordBot[0] === discordBotId)[2][index - 1][1];
      });
      Object.entries((JSON.parse(localStorage.getItem("discordBots") || "[]") || []).find((discordBot) => discordBot[0] === discordBotId)[2]).slice(2).forEach((discordBotSecret) => {
        let discordBotEditorContainerSecret = document.createElement("tr");
        let discordBotEditorContainerSecretName = document.createElement("td");
        discordBotEditorContainerSecretName.style.border = "1px solid #dddddd";
        let discordBotEditorContainerSecretNameInput = document.createElement("input");
        discordBotEditorContainerSecretNameInput.value = discordBotSecret[0];
        discordBotEditorContainerSecretNameInput.style.width = "calc(100% - 15px)";
        discordBotEditorContainerSecretNameInput.style.border = "none";
        discordBotEditorContainerSecretNameInput.style.backgroundColor = "transparent";
        discordBotEditorContainerSecretNameInput.style.padding = "8px";
        discordBotEditorContainerSecretNameInput.style.fontFamily = "system-ui";
        discordBotEditorContainerSecretNameInput.addEventListener("change", ({ target }) => {
          localStorage.setItem("discordBots", JSON.stringify((JSON.parse(localStorage.getItem("discordBots") || "[]") || []).map((discordBot) => (discordBot[0] === document.getElementById("discordBotEditorContainer").dataset.id) ? discordBot.map((discordBotItem, index) => (index === 2) ? discordBotItem.map((discordBotSecret, index) => (index === (Array.from(document.getElementById("discordBotEditorContainerSecrets").children[0].children).indexOf(discordBotEditorContainerSecret) - 1)) ? [
            target.value,
            discordBotSecret[1]
          ] : discordBotSecret) : discordBotItem) : discordBot)));
        });
        let discordBotEditorContainerSecretValue = document.createElement("td");
        discordBotEditorContainerSecretValue.style.border = "1px solid #dddddd";
        let discordBotEditorContainerSecretValueInput = document.createElement("input");
        discordBotEditorContainerSecretValueInput.value = discordBotSecret[0];
        discordBotEditorContainerSecretValueInput.style.width = "calc(100% - 15px)";
        discordBotEditorContainerSecretValueInput.style.border = "none";
        discordBotEditorContainerSecretValueInput.style.backgroundColor = "transparent";
        discordBotEditorContainerSecretValueInput.style.padding = "8px";
        discordBotEditorContainerSecretValueInput.style.fontFamily = "system-ui";
        discordBotEditorContainerSecretValueInput.addEventListener("change", ({ target }) => {
          localStorage.setItem("discordBots", JSON.stringify((JSON.parse(localStorage.getItem("discordBots") || "[]") || []).map((discordBot) => (discordBot[0] === document.getElementById("discordBotEditorContainer").dataset.id) ? discordBot.map((discordBotItem, index) => (index === 2) ? discordBotItem.map((discordBotSecret, index) => (index === (Array.from(document.getElementById("discordBotEditorContainerSecrets").children[0].children).indexOf(discordBotEditorContainerSecret) - 1)) ? [
            target.value,
            discordBotSecret[1]
          ] : discordBotSecret) : discordBotItem) : discordBot)));
        });
        let discordBotEditorContainerSecretDeleteButton = document.createElement("td");
        discordBotEditorContainerSecretDeleteButton.style.cursor = "pointer";
        discordBotEditorContainerSecretDeleteButton.style.border = "1px solid #dddddd";
        discordBotEditorContainerSecretDeleteButton.addEventListener("click", () => {
          if (!confirm("Are you sure you want to irreversibly delete this secret containing its value?")) return;
          discordBotEditorContainerSecret.remove();
          localStorage.setItem("discordBots", JSON.stringify((JSON.parse(localStorage.getItem("discordBots") || "[]") || []).map((discordBot) => (discordBot[0] === document.getElementById("discordBotEditorContainer").dataset.id) ? discordBot.map((discordBotItem, index) => (index === 2) ? discordBotItem.filter((_, index) => (index !== (Array.from(document.getElementById("discordBotEditorContainerSecrets").children[0].children).indexOf(discordBotEditorContainerSecret) - 1))) : discordBotItem) : discordBot)));
        });
        let discordBotEditorContainerSecretDeleteButtonIcon = document.createElement("i");
        discordBotEditorContainerSecretDeleteButtonIcon.className = "fa fa-trash";
        discordBotEditorContainerSecretDeleteButtonIcon.ariaHidden = true;
        discordBotEditorContainerSecretDeleteButtonIcon.style.width = "6.5px";
        discordBotEditorContainerSecretDeleteButtonIcon.style.fontSize = "20px";
        discordBotEditorContainerSecretDeleteButtonIcon.style.marginLeft = "7.5px";
        discordBotEditorContainerSecretName.appendChild(discordBotEditorContainerSecretNameInput);
        discordBotEditorContainerSecretValue.appendChild(discordBotEditorContainerSecretValueInput);
        discordBotEditorContainerSecretDeleteButton.appendChild(discordBotEditorContainerSecretDeleteButtonIcon);
        discordBotEditorContainerSecret.appendChild(discordBotEditorContainerSecretName);
        discordBotEditorContainerSecret.appendChild(discordBotEditorContainerSecretValue);
        discordBotEditorContainerSecret.appendChild(discordBotEditorContainerSecretDeleteButton);
        document.getElementById("discordBotEditorContainerSecrets").children[0].insertBefore(discordBotEditorContainerSecret, Array.from(document.getElementById("discordBotEditorContainerSecrets").children).at(-1));
      });
    };
    discordBotEditor.setValue(fs.readFileSync(path.join(parent.process.resourcesPath, "discordBots/" + discordBotId + ".js"), "utf8"));
    document.getElementById("integrationContainer").style.display = "none";
    document.getElementById("discordBotEditorContainer").style.display = "block";
  });
  let discordBotContainerEditButtonText = document.createElement("p");
  discordBotContainerEditButtonText.style.fontSize = "15.25px";
  discordBotContainerEditButtonText.style.marginTop = "5px";
  discordBotContainerEditButtonText.innerText = "Edit";
  let discordBotContainerInviteButton = document.createElement("div");
  discordBotContainerInviteButton.className = "discordBotContainerButton";
  discordBotContainerInviteButton.style.cursor = "pointer";
  discordBotContainerInviteButton.style.width = "75px";
  discordBotContainerInviteButton.style.height = "30.5px";
  discordBotContainerInviteButton.style.color = "white";
  discordBotContainerInviteButton.style.backgroundColor = "#159be1";
  discordBotContainerInviteButton.style.borderRadius = "7.5px";
  discordBotContainerInviteButton.style.marginRight = "5px";
  discordBotContainerInviteButton.style.textAlign = "center";
  discordBotContainerInviteButton.addEventListener("click", () => {
    shell.openExternal("https://discord.com/oauth2/authorize?client_id=" + (JSON.parse((localStorage.getItem("discordBots") || "[]") || []).find((discordBot) => discordBot[0] === discordBotId)[2].CLIENT_ID || "") + "&permissions=8&scope=bot");
  });
  let discordBotContainerInviteButtonText = document.createElement("p");
  discordBotContainerInviteButtonText.style.fontSize = "15.25px";
  discordBotContainerInviteButtonText.style.marginTop = "5px";
  discordBotContainerInviteButtonText.innerText = "Invite";
  let discordBotContainerButtonSeparationLine = document.createElement("div");
  discordBotContainerButtonSeparationLine.style.width = "1px";
  discordBotContainerButtonSeparationLine.style.height = "30.5px";
  discordBotContainerButtonSeparationLine.style.backgroundColor = "rgba(191, 191, 191, 0.85)";
  discordBotContainerButtonSeparationLine.style.opacity = "0.75";
  discordBotContainerButtonSeparationLine.style.marginLeft = "5px";
  let discordBotContainerDeleteButton = document.createElement("div");
  discordBotContainerDeleteButton.className = "discordBotContainerButton";
  discordBotContainerDeleteButton.style.cursor = "pointer";
  discordBotContainerDeleteButton.style.width = "30.5px";
  discordBotContainerDeleteButton.style.height = "30.5px";
  discordBotContainerDeleteButton.style.backgroundColor = "rgb(21, 155, 225)";
  discordBotContainerDeleteButton.style.borderRadius = "7.5px";
  discordBotContainerDeleteButton.style.marginLeft = "7.5px";
  discordBotContainerDeleteButton.style.display = "flex";
  discordBotContainerDeleteButton.style.justifyContent = "center";
  discordBotContainerDeleteButton.style.alignItems = "center";
  discordBotContainerDeleteButton.addEventListener("click", () => {
    if (!confirm("Are you sure you want to irreversibly delete this Discord Bot containing its code?")) return;
    discordBotContainer.remove();
    if (!document.getElementById("discordBotContainer").children.length) {
      document.getElementById("discordBotCategoryText").style.display = "none";
      document.getElementById("discordBotCategorySeparationLine").style.display = "none";
      document.getElementById("discordBotContainer").style.display = "none";
      if (!document.getElementById("throwAwayPasswordContainer").children.length) {
        let integrationIconPlacementContainer = document.createElement("div");
        integrationIconPlacementContainer.className = "integrationIcon";
        integrationIconPlacementContainer.style.display = "flex";
        integrationIconPlacementContainer.style.justifyContent = "center";
        integrationIconPlacementContainer.style.alignItems = "center";
        integrationIconPlacementContainer.style.marginTop = "37.5px";
        integrationIconPlacementContainer.style.marginBottom = "25px";
        let integrationIconContainer = document.createElement("div");
        integrationIconContainer.style.display = "flex";
        integrationIconContainer.style.justifyContent = "center";
        integrationIconContainer.style.width = "8.75%";
        integrationIconContainer.style.aspectRatio = "1/1";
        integrationIconContainer.style.borderRadius = "15px";
        integrationIconContainer.style.backgroundColor = "#1de19e";
        let integrationIcon = document.createElement("i");
        integrationIcon.className = "fa fa-chain-broken";
        integrationIcon.ariaHidden = true;
        integrationIcon.style.fontSize = "3.675vw";
        integrationIcon.style.color = "white";
        integrationIcon.style.margin = "auto 0";
        integrationIconContainer.appendChild(integrationIcon);
        integrationIconPlacementContainer.appendChild(integrationIconContainer);
        document.getElementById("integrationContainer").insertBefore(integrationIconPlacementContainer, document.getElementById("throwAwayPasswordCategoryText"));
      };
    };
    localStorage.setItem("discordBots", JSON.stringify((JSON.parse(localStorage.getItem("discordBots") || "[]") || []).filter((discordBot) => discordBot[0] !== discordBotId)));
    try {
      fs.unlinkSync(path.join(parent.process.resourcesPath, "discordBots/" + discordBotId + ".js"));
    } catch {};
  });
  let discordBotContainerDeleteButtonIcon = document.createElement("i");
  discordBotContainerDeleteButtonIcon.className = "fa fa-trash";
  discordBotContainerDeleteButtonIcon.ariaHidden = true;
  discordBotContainerDeleteButtonIcon.style.color = "white";
  discordBotContainerDeleteButtonIcon.style.fontSize = "19px";
  discordBotContainerEditButton.appendChild(discordBotContainerEditButtonText);
  discordBotContainerInviteButton.appendChild(discordBotContainerInviteButtonText);
  discordBotContainerDeleteButton.appendChild(discordBotContainerDeleteButtonIcon);
  discordBotContainerButtonBox.appendChild(discordBotContainerEditButton);
  discordBotContainerButtonBox.appendChild(discordBotContainerInviteButton);
  discordBotContainerButtonBox.appendChild(discordBotContainerButtonSeparationLine);
  discordBotContainerButtonBox.appendChild(discordBotContainerDeleteButton);
  discordBotContainer.appendChild(discordBotContainerName);
  discordBotContainer.appendChild(discordBotContainerButtonBox);
  document.getElementById("discordBotContainer").appendChild(discordBotContainer);
});

document.getElementById("discordBotEditorContainerBackButton").addEventListener("click", () => {
  document.getElementById("discordBotEditorContainer").style.display = "none";
  document.getElementById("integrationContainer").style.display = "block";
});

document.getElementById("discordBotEditorContainerRunButton").addEventListener("click", () => {
  document.getElementById("discordBotEditorContainerRunButtonIcon").className = (document.getElementById("discordBotEditorContainerRunButtonIcon").className === "fa fa-play") ? "fa fa-stop-circle" : "fa fa-play";
  parent.postMessage({
    type: (document.getElementById("discordBotEditorContainerRunButtonIcon").className === "fa fa-play") ? "stopDiscordBot" : "runDiscordBot",
    discordBotId: document.getElementById("discordBotEditorContainer").dataset.id,
    immediateExecution: true
  });
});

Array.from(document.getElementById("discordBotEditorContainerSecrets").children[0].children).slice(0, -1).forEach((discordBotEditorContainerSecret, discordBotSecretIndex) => {
  if (!discordBotSecretIndex) return;
  discordBotEditorContainerSecret.children[0].children[0].addEventListener("change", ({ target }) => {
    localStorage.setItem("discordBots", JSON.stringify((JSON.parse(localStorage.getItem("discordBots") || "[]") || []).map((discordBot) => (discordBot[0] === document.getElementById("discordBotEditorContainer").dataset.id) ? discordBot.map((discordBotItem, index) => (index === 2) ? discordBotItem.map((discordBotSecret, index) => (index === (discordBotSecretIndex - 1)) ? [
      target.value,
      discordBotSecret[1]
    ] : discordBotSecret) : discordBotItem) : discordBot)));
  });
  discordBotEditorContainerSecret.children[1].children[0].addEventListener("change", ({ target }) => {
    localStorage.setItem("discordBots", JSON.stringify((JSON.parse(localStorage.getItem("discordBots") || "[]") || []).map((discordBot) => (discordBot[0] === document.getElementById("discordBotEditorContainer").dataset.id) ? discordBot.map((discordBotItem, index) => (index === 2) ? discordBotItem.map((discordBotSecret, index) => (index === (discordBotSecretIndex - 1)) ? [
      discordBotSecret[0],
      target.value
    ] : discordBotSecret) : discordBotItem) : discordBot)));
  });
  discordBotEditorContainerSecret.children[2].addEventListener("click", () => {
    if (!confirm("Are you sure you want to irreversibly delete this secret containing its value?")) return;
    discordBotEditorContainerSecret.remove();
    localStorage.setItem("discordBots", JSON.stringify((JSON.parse(localStorage.getItem("discordBots") || "[]") || []).map((discordBot) => (discordBot[0] === document.getElementById("discordBotEditorContainer").dataset.id) ? discordBot.map((discordBotItem, index) => (index === 2) ? discordBotItem.filter((_, index) => (index !== (discordBotSecretIndex - 1))) : discordBotItem) : discordBot)));
  });
});

let addEventListenersToNewSecretDataCell; (addEventListenersToNewSecretDataCell = () => {
  let abortController = new AbortController();
  Array.from(Array.from(document.getElementById("discordBotEditorContainerSecrets").children[0].children).at(-1).children).forEach((newSecretDataCell, index) => {
    ((index === 2) ? newSecretDataCell : newSecretDataCell.children[0]).addEventListener((index === 2) ? "click" : "focus", () => {
      localStorage.setItem("discordBots", JSON.stringify((JSON.parse(localStorage.getItem("discordBots") || "[]") || []).map((discordBot) => (discordBot[0] === document.getElementById("discordBotEditorContainer").dataset.id) ? discordBot.map((discordBotItem, index) => (index === 2) ? [
        ...discordBotItem || [],
        ...[
          "New Secret",
          "New Value"
        ]
      ] : discordBotItem) : discordBot)));
      document.getElementById("discordBotEditorContainerSecrets").children[0].appendChild(Array.from(document.getElementById("discordBotEditorContainerSecrets").children[0].children).at(-1).cloneNode(true));
      addEventListenersToNewSecretDataCell();
      abortController.abort();
      Array.from(Array.from(document.getElementById("discordBotEditorContainerSecrets").children[0].children).at(-2).children).forEach((newSecretDataCellChild, index) => {
        newSecretDataCellChild.children[0].style.removeProperty("color");
      });
      Array.from(document.getElementById("discordBotEditorContainerSecrets").children[0].children).at(-2).children[0].children[0].addEventListener("change", ({ target }) => {
        localStorage.setItem("discordBots", JSON.stringify((JSON.parse(localStorage.getItem("discordBots") || "[]") || []).map((discordBot) => (discordBot[0] === document.getElementById("discordBotEditorContainer").dataset.id) ? discordBot.map((discordBotItem, index) => (index === 2) ? discordBotItem.map((discordBotSecret, index) => (index === (Array.from(document.getElementById("discordBotEditorContainerSecrets").children).indexOf(newSecretDataCell.parentElement) - 1)) ? [
          target.value,
          discordBotSecret[1]
        ] : discordBotSecret) : discordBotItem) : discordBot)));
      });
      Array.from(document.getElementById("discordBotEditorContainerSecrets").children[0].children).at(-2).children[1].children[0].addEventListener("change", ({ target }) => {
        localStorage.setItem("discordBots", JSON.stringify((JSON.parse(localStorage.getItem("discordBots") || "[]") || []).map((discordBot) => (discordBot[0] === document.getElementById("discordBotEditorContainer").dataset.id) ? discordBot.map((discordBotItem, index) => (index === 2) ? discordBotItem.map((discordBotSecret, index) => (index === (Array.from(document.getElementById("discordBotEditorContainerSecrets").children).indexOf(newSecretDataCell.parentElement) - 1)) ? [
          discordBotSecret[0],
          target.value
        ] : discordBotSecret) : discordBotItem) : discordBot)));
      });
      Array.from(document.getElementById("discordBotEditorContainerSecrets").children[0].children).at(-2).children[2].addEventListener("click", () => {
        if (!confirm("Are you sure you want to irreversibly delete this secret containing its value?")) return;
        newSecretDataCell.parentElement.remove();
        localStorage.setItem("discordBots", JSON.stringify((JSON.parse(localStorage.getItem("discordBots") || "[]") || []).map((discordBot) => (discordBot[0] === document.getElementById("discordBotEditorContainer").dataset.id) ? discordBot.map((discordBotItem, index) => (index === 2) ? discordBotItem.filter((_, index) => (index !== (Array.from(document.getElementById("discordBotEditorContainerSecrets")).indexOf(newSecretDataCell) - 1))) : discordBotItem) : discordBot)));
      });
    }, {
      signal: abortController.signal
    });
  });
})();

window.addEventListener("beforeunload", () => {
  (JSON.parse(localStorage.getItem("discordBots") || "[]") || []).forEach(([discordBotId]) => {
    parent.postMessage({
      type: "runDiscordBot",
      discordBotId,
      immediateExecution: false
    });
  });
});