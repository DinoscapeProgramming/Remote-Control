const crypto = parent.require("crypto");

if (!fs.readdirSync(parent.process.resourcesPath).includes("discordBots")) fs.mkdirSync(path.join(parent.process.resourcesPath, "discordBots"));

(JSON.parse(localStorage.getItem("throwAwayPasswords")) || []).forEach(([throwAwayPasswordCode, throwAwayPasswordUses]) => {
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
    localStorage.setItem("throwAwayPasswords", JSON.stringify((JSON.parse(localStorage.getItem("throwAwayPasswords")) || []).map((throwAwayPassword) => [
      [
        (throwAwayPassword[0] === throwAwayPasswordCode) ? target.value : throwAwayPassword[0],
        throwAwayPassword[1]
      ]
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
  throwAwayPasswordContainerUseDisplay.style.width = "82.5px";
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
  throwAwayPasswordContainerUseDisplayInput.style.width = "calc(1ch + 1px)";
  throwAwayPasswordContainerUseDisplayInput.style.border = "none";
  throwAwayPasswordContainerUseDisplayInput.style.color = "white";
  throwAwayPasswordContainerUseDisplayInput.style.backgroundColor = "transparent";
  throwAwayPasswordContainerUseDisplayInput.style.fontSize = "12.5px";
  throwAwayPasswordContainerUseDisplayInput.style.fontFamily = "system-ui";
  throwAwayPasswordContainerUseDisplayInput.style.marginBottom = "0.75px";
  throwAwayPasswordContainerUseDisplayInput.style.marginRight = "1px";
  throwAwayPasswordContainerUseDisplayInput.addEventListener("input", ({ target }) => {
    throwAwayPasswordContainerUseDisplayInput.style.width = "calc(" + target.value.length.toString() + "ch + 1px)";
    throwAwayPasswordContainerUseDisplayInput.nextElementSibling.innerText = " use" + ((target.value.length - 1) ? "s" : "") + " left";
  });
  throwAwayPasswordContainerUseDisplayInput.addEventListener("change", ({ target }) => {
    if (!target.value) return;
    localStorage.setItem("throwAwayPasswords", JSON.stringify((JSON.parse(localStorage.getItem("throwAwayPasswords")) || []).map((throwAwayPassword) => [
      [
        throwAwayPassword[0],
        (throwAwayPassword[0] === throwAwayPasswordCode) ? Number(target.value) : throwAwayPassword[1]
      ]
    ])));
  });
  let throwAwayPasswordContainerUseDisplayText = document.createElement("span");
  throwAwayPasswordContainerUseDisplayText.style.fontSize = "12.25px";
  throwAwayPasswordContainerUseDisplayText.style.marginBottom = "2px";
  throwAwayPasswordContainerUseDisplayText.style.marginRight = "0.5px";
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
    if (!document.getElementById("throwAwayPasswordContainer").children.length && !document.getElementById("discordBotContainer").children.length) {
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
    localStorage.setItem("throwAwayPasswords", JSON.stringify((JSON.parse(localStorage.getItem("throwAwayPasswords")) || []).filter((throwAwayPassword) => throwAwayPassword[0] !== throwAwayPasswordCode)));
  });
  let throwAwayPasswordContainerDeleteButtonIcon = document.createElement("i");
  throwAwayPasswordContainerDeleteButtonIcon.className = "fa fa-clipboard";
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

document.getElementById("createThrowAwayPasswordButton").addEventListener("click", () => {
  if (document.getElementById("integrationContainer").getElementsByClassName("integrationIcon").length) document.getElementById("integrationContainer").getElementsByClassName("integrationIcon")[0].remove();
  document.getElementById("throwAwayPasswordCategoryText").style.display = "block";
  document.getElementById("throwAwayPasswordCategorySeparationLine").style.display = "block";
  document.getElementById("throwAwayPasswordContainer").style.display = "block";
  let throwAwayPasswordCode = crypto.randomBytes(4).toString("hex");
  localStorage.setItem("throwAwayPasswords", JSON.stringify([
    ...JSON.parse(localStorage.getItem("throwAwayPasswords")) || [],
    ...[
      [
        throwAwayPasswordCode,
        0
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
    localStorage.setItem("throwAwayPasswords", JSON.stringify((JSON.parse(localStorage.getItem("throwAwayPasswords")) || []).map((throwAwayPassword) => [
      [
        (throwAwayPassword[0] === throwAwayPasswordCode) ? target.value : throwAwayPassword[0],
        throwAwayPassword[1]
      ]
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
  throwAwayPasswordContainerUseDisplay.style.width = "82.5px";
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
  throwAwayPasswordContainerUseDisplayInput.style.width = "calc(1ch + 1px)";
  throwAwayPasswordContainerUseDisplayInput.style.border = "none";
  throwAwayPasswordContainerUseDisplayInput.style.color = "white";
  throwAwayPasswordContainerUseDisplayInput.style.backgroundColor = "transparent";
  throwAwayPasswordContainerUseDisplayInput.style.fontSize = "12.5px";
  throwAwayPasswordContainerUseDisplayInput.style.fontFamily = "system-ui";
  throwAwayPasswordContainerUseDisplayInput.style.marginBottom = "0.75px";
  throwAwayPasswordContainerUseDisplayInput.style.marginRight = "1px";
  throwAwayPasswordContainerUseDisplayInput.addEventListener("input", ({ target }) => {
    throwAwayPasswordContainerUseDisplayInput.style.width = "calc(" + target.value.length.toString() + "ch + 1px)";
    throwAwayPasswordContainerUseDisplayInput.nextElementSibling.innerText = " use" + ((target.value.length - 1) ? "s" : "") + " left";
  });
  throwAwayPasswordContainerUseDisplayInput.addEventListener("change", ({ target }) => {
    if (!target.value) return;
    localStorage.setItem("throwAwayPasswords", JSON.stringify((JSON.parse(localStorage.getItem("throwAwayPasswords")) || []).map((throwAwayPassword) => [
      [
        throwAwayPassword[0],
        (throwAwayPassword[0] === throwAwayPasswordCode) ? Number(target.value) : throwAwayPassword[1]
      ]
    ])));
  });
  let throwAwayPasswordContainerUseDisplayText = document.createElement("span");
  throwAwayPasswordContainerUseDisplayText.style.fontSize = "12.25px";
  throwAwayPasswordContainerUseDisplayText.style.marginBottom = "2px";
  throwAwayPasswordContainerUseDisplayText.style.marginRight = "0.5px";
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
    if (!document.getElementById("throwAwayPasswordContainer").children.length && !document.getElementById("discordBotContainer").children.length) {
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
    localStorage.setItem("throwAwayPasswords", JSON.stringify((JSON.parse(localStorage.getItem("throwAwayPasswords")) || []).filter((throwAwayPassword) => throwAwayPassword[0] !== throwAwayPasswordCode)));
  });
  let throwAwayPasswordContainerDeleteButtonIcon = document.createElement("i");
  throwAwayPasswordContainerDeleteButtonIcon.className = "fa fa-clipboard";
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
  document.getElementById("throwAwayPasswordCategoryText").style.display = "block";
  document.getElementById("throwAwayPasswordCategorySeparationLine").style.display = "block";
  document.getElementById("throwAwayPasswordContainer").style.display = "block";
  let throwAwayPasswordCode = crypto.randomBytes(4).toString("hex");
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
  throwAwayPasswordContainerCode.style.marginLeft = "6.5px";
  throwAwayPasswordContainerCode.style.fontSize = "15px";
  throwAwayPasswordContainerCode.style.fontWeight = "400";
  throwAwayPasswordContainerCode.style.border = "none";
  throwAwayPasswordContainerCode.style.padding = "8.5px";
  throwAwayPasswordContainerCode.style.width = "calc(6ch - 5px)";
  let throwAwayPasswordContainerButtonBox = document.createElement("div");
  throwAwayPasswordContainerButtonBox.style.display = "flex";
  throwAwayPasswordContainerButtonBox.style.flexDirection = "row";
  throwAwayPasswordContainerButtonBox.style.position = "absolute";
  throwAwayPasswordContainerButtonBox.style.right = "52.5px";
  let throwAwayPasswordContainerUseDisplay = document.createElement("div");
  throwAwayPasswordContainerUseDisplay.style.display = "flex";
  throwAwayPasswordContainerUseDisplay.style.justifyContent = "center";
  throwAwayPasswordContainerUseDisplay.style.alignItems = "center";
  throwAwayPasswordContainerUseDisplay.style.width = "82.5px";
  throwAwayPasswordContainerUseDisplay.style.height = "30.5px";
  throwAwayPasswordContainerUseDisplay.style.color = "white";
  throwAwayPasswordContainerUseDisplay.style.backgroundColor = "rgb(21, 155, 225)";
  throwAwayPasswordContainerUseDisplay.style.borderRadius = "7.5px";
  throwAwayPasswordContainerUseDisplay.style.marginRight = "5px";
  throwAwayPasswordContainerUseDisplay.style.textAlign = "center";
  throwAwayPasswordContainerUseDisplay.style.border = "none";
  let throwAwayPasswordContainerUseDisplayInput = document.createElement("input");
  throwAwayPasswordContainerUseDisplayInput.style.width = "calc(1ch + 1px)";
  throwAwayPasswordContainerUseDisplayInput.style.border = "none";
  throwAwayPasswordContainerUseDisplayInput.style.color = "white";
  throwAwayPasswordContainerUseDisplayInput.style.backgroundColor = "transparent";
  throwAwayPasswordContainerUseDisplayInput.style.fontSize = "12.5px";
  throwAwayPasswordContainerUseDisplayInput.style.fontFamily = "system-ui";
  throwAwayPasswordContainerUseDisplayInput.style.marginBottom = "0.75px";
  throwAwayPasswordContainerUseDisplayInput.style.marginRight = "1px";
  throwAwayPasswordContainerUseDisplayInput.addEventListener("input", () => {
    throwAwayPasswordContainerUseDisplayInput.style.width = "calc(" + throwAwayPasswordContainerUseDisplayInput.value.length.toString() + "ch + 1px)";
    throwAwayPasswordContainerUseDisplayInput.nextElementSibling.innerText = " use" + ((throwAwayPasswordContainerUseDisplayInput.value.length - 1) ? "s" : "") + " left";
  });
  let throwAwayPasswordContainerUseDisplayText = document.createElement("span");
  throwAwayPasswordContainerUseDisplayText.style.fontSize = "12.25px";
  throwAwayPasswordContainerUseDisplayText.style.marginBottom = "2px";
  throwAwayPasswordContainerUseDisplayText.style.marginRight = "0.5px";
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
  let throwAwayPasswordContainerDeleteButtonIcon = document.createElement("i");
  throwAwayPasswordContainerDeleteButtonIcon.className = "fa fa-clipboard";
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