localStorage.setItem("translucenceThemeId", createAppStartupCodeFile(() => {
  const fs = require("fs");
  
  document.body.style.backgroundSize = "100% 100%";
  document.body.style.backgroundImage = "url(https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg?auto=compress&cs=tinysrgb&w=1280)";
  document.body.children[0].style.opacity = "0.965";
  document.body.children[0].style.backgroundColor = "#159be1";
  document.getElementById("pageEmbed").style.backgroundColor = "black";
  document.getElementById("pageEmbed").style.opacity = "0.85";
  document.getElementById("pageEmbed").style.borderTopLeftRadius = "0";
  document.getElementById("pageEmbed").style.borderBottomLeftRadius = "0";
  if ((JSON.parse(localStorage.getItem("settings")) || {}).darkMode) {
    localStorage.setItem("settings", JSON.stringify({
      ...JSON.parse(localStorage.getItem("settings")) || {},
      ...{
        darkMode: false
      }
    }));
    document.styleSheets[2].media.deleteMedium("(prefers-color-scheme: dark)");
    document.styleSheets[2].media.appendMedium("(prefers-color-scheme: white)");
  };
  document.getElementById("pageEmbed").addEventListener("load", () => {
    document.getElementById("pageEmbed").contentWindow.document.body.style.color = "white";
    document.getElementById("pageEmbed").contentWindow.document.body.children[0].children[0].style.color = "white";
    if (document.getElementById("pageEmbed").src.endsWith("/scripts/index.html")) {
      document.getElementById("pageEmbed").contentWindow.document.body.children[2].children[0].children[1].style.color = "white"; 
      document.getElementById("pageEmbed").contentWindow.document.getElementById("scriptEditor").style.filter = "none";
      document.getElementById("pageEmbed").contentWindow.document.getElementById("scriptEditor").style.width = "calc(100% + 2px)";
      document.getElementById("pageEmbed").contentWindow.document.getElementById("scriptEditor").style.marginLeft = "-1px";
      document.getElementById("pageEmbed").contentWindow.document.getElementById("scriptEditor").style.marginBottom = "-1px";
    };
    if (document.getElementById("pageEmbed").src.endsWith("/debug/index.html")) {
      document.getElementById("pageEmbed").contentWindow.document.getElementById("debugLogInput").style.color = "white";
      document.getElementById("pageEmbed").contentWindow.document.getElementById("debugCodeExecutionInput").style.borderTopLeftRadius = "2.5px";
      document.getElementById("pageEmbed").contentWindow.document.getElementById("debugCodeExecutionInput").style.borderBottomLeftRadius = "2.5px";
    };
    if (document.getElementById("pageEmbed").src.endsWith("/settings/index.html")) {
      document.getElementById("pageEmbed").contentWindow.document.body.children[2].children[0].style.display = "none";
      document.getElementById("pageEmbed").contentWindow.document.body.children[2].children[1].style.display = "none";
    };
    if (document.getElementById("pageEmbed").src.endsWith("/help/index.html")) {
      document.getElementById("pageEmbed").contentWindow.document.getElementById("markdownEmbed").style.filter = "invert(95%) hue-rotate(180deg)";
      document.getElementById("pageEmbed").contentWindow.document.getElementById("markdownEmbed").src = ((Object.keys(JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8"))).length) ? (JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).resourceProtocol + "//" + JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).resourceHostname + ((JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).resourcePort) ? (":" + JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).resourcePort) : "")) : (process.env.DEFAULT_RESOURCE_SERVER_PROTOCOL + "//" + process.env.DEFAULT_RESOURCE_SERVER_HOSTNAME + ((process.env.DEFAULT_RESOURCE_SERVER_PORT) ? (":" + process.env.DEFAULT_RESOURCE_SERVER_PORT) : ""))) + "/help/?darkMode=true";
    };
  });
}));

document.getElementById("pageEmbed").contentWindow.document.body.style.color = "white";
  document.getElementById("pageEmbed").contentWindow.document.body.children[0].children[0].style.color = "white";
  if (document.getElementById("pageEmbed").src.endsWith("/scripts/index.html")) {
    document.getElementById("pageEmbed").contentWindow.document.body.children[2].children[0].children[1].style.color = "white";
    document.getElementById("pageEmbed").contentWindow.document.getElementById("scriptEditor").style.filter = "none";
    document.getElementById("pageEmbed").contentWindow.document.getElementById("scriptEditor").style.width = "calc(100% + 2px)";
    document.getElementById("pageEmbed").contentWindow.document.getElementById("scriptEditor").style.marginLeft = "-1px";
    document.getElementById("pageEmbed").contentWindow.document.getElementById("scriptEditor").style.marginBottom = "-1px";
  };
  if (document.getElementById("pageEmbed").src.endsWith("/integrations/index.html")) {
    document.getElementById("pageEmbed").contentWindow.document.getElementById("discordBotEditor").style.filter = "none";
    document.getElementById("pageEmbed").contentWindow.document.getElementById("discordBotEditor").style.width = "calc(100% + 2px)";
    document.getElementById("pageEmbed").contentWindow.document.getElementById("discordBotEditor").style.marginLeft = "-1px";
    document.getElementById("pageEmbed").contentWindow.document.getElementById("discordBotEditor").style.marginBottom = "-1px";
  };
  if (document.getElementById("pageEmbed").src.endsWith("/debug/index.html")) {
    document.getElementById("pageEmbed").contentWindow.document.getElementById("debugLogInput").style.color = "white";
    document.getElementById("pageEmbed").contentWindow.document.getElementById("debugCodeExecutionInput").style.borderTopLeftRadius = "2.5px";
    document.getElementById("pageEmbed").contentWindow.document.getElementById("debugCodeExecutionInput").style.borderBottomLeftRadius = "2.5px";
  };
  if (document.getElementById("pageEmbed").src.endsWith("/settings/index.html")) {
    document.getElementById("pageEmbed").contentWindow.document.body.children[2].children[0].style.display = "none";
    document.getElementById("pageEmbed").contentWindow.document.body.children[2].children[1].style.display = "none";
  };
  if (document.getElementById("pageEmbed").src.endsWith("/help/index.html")) {
    document.getElementById("pageEmbed").contentWindow.document.getElementById("markdownEmbed").style.filter = "invert(95%) hue-rotate(180deg)";
    document.getElementById("pageEmbed").contentWindow.document.getElementById("markdownEmbed").src = ((Object.keys(JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8"))).length) ? (JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).resourceProtocol + "//" + JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).resourceHostname + ((JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).resourcePort) ? (":" + JSON.parse(fs.readFileSync(path.join(process.resourcesPath, "customServer.json"), "utf8")).resourcePort) : "")) : (process.env.DEFAULT_RESOURCE_SERVER_PROTOCOL + "//" + process.env.DEFAULT_RESOURCE_SERVER_HOSTNAME + ((process.env.DEFAULT_RESOURCE_SERVER_PORT) ? (":" + process.env.DEFAULT_RESOURCE_SERVER_PORT) : ""))) + "/help/?darkMode=true";
  };