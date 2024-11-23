const fs = parent.require("fs");
const path = parent.require("path");
const parsedEnvironmentVariables = parent.require("dotenv").config({ path: parent.require("path").join(parent.process.resourcesPath, "app.asar/.env") }).parsed;

document.getElementById("markdownEmbed").src = ((Object.keys(JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8"))).length) ? (JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8")).resourceProtocol + "//" + JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8")).resourceHostname + ((JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8")).resourcePort) ? (":" + JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8")).resourcePort) : "")) : (parsedEnvironmentVariables.DEFAULT_RESOURCE_SERVER_PROTOCOL + "//" + parsedEnvironmentVariables.DEFAULT_RESOURCE_SERVER_HOSTNAME + ((parsedEnvironmentVariables.DEFAULT_RESOURCE_SERVER_PORT) ? (":" + parsedEnvironmentVariables.DEFAULT_RESOURCE_SERVER_PORT) : ""))) + "/help/?darkMode=" + ((JSON.parse(localStorage.getItem("settings")) || {}).darkMode ?? false).toString();
document.getElementById("markdownEmbed").addEventListener("error", () => {
  let errorImage = document.createElement("img");
  errorImage.src = "../../assets/errorImage.webp";
  document.getElementById("markdownEmbed").contentWindow.document.body.style.display = "flex";
  document.getElementById("markdownEmbed").contentWindow.document.body.style.justifyContent = "center";
  document.getElementById("markdownEmbed").contentWindow.document.body.style.alignItems = "center";
  document.getElementById("markdownEmbed").contentWindow.document.body.style.marginBottom = "20px";
  document.getElementById("markdownEmbed").appendChild(errorImage);
});