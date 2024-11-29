const fs = parent.require("fs");
const path = parent.require("path");
window.process = {
  env: fs.readFileSync(path.join(parent.process.resourcesPath, "app.asar/.env"), "utf8").split("\n").filter((line) => !line.startsWith("#") && (line.split("=").length > 1)).map((line) => line.trim().split("#")[0].split("=")).reduce((data, accumulator) => ({
    ...data,
    ...{
      [accumulator[0]]: JSON.parse(accumulator[1].trim())
    }
  }), {})
};

document.getElementById("markdownEmbed").src = ((Object.keys(JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8"))).length) ? (JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8")).resourceProtocol + "//" + JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8")).resourceHostname + ((JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8")).resourcePort) ? (":" + JSON.parse(fs.readFileSync(path.join(parent.process.resourcesPath, "customServer.json"), "utf8")).resourcePort) : "")) : (process.env.DEFAULT_RESOURCE_SERVER_PROTOCOL + "//" + process.env.DEFAULT_RESOURCE_SERVER_HOSTNAME + ((process.env.DEFAULT_RESOURCE_SERVER_PORT) ? (":" + process.env.DEFAULT_RESOURCE_SERVER_PORT) : ""))) + "/help/?darkMode=" + ((JSON.parse(localStorage.getItem("settings")) || {}).darkMode ?? false).toString();
document.getElementById("markdownEmbed").addEventListener("error", () => {
  let errorImage = document.createElement("img");
  errorImage.src = "../../assets/errorImage.webp";
  document.getElementById("markdownEmbed").contentWindow.document.body.style.display = "flex";
  document.getElementById("markdownEmbed").contentWindow.document.body.style.justifyContent = "center";
  document.getElementById("markdownEmbed").contentWindow.document.body.style.alignItems = "center";
  document.getElementById("markdownEmbed").contentWindow.document.body.style.marginBottom = "20px";
  document.getElementById("markdownEmbed").contentWindow.document.appendChild(errorImage);
});