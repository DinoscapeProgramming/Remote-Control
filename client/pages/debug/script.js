const { ipcRenderer } = parent.require("electron");
const worker = new Worker(URL.createObjectURL(new Blob([
  `
    self.addEventListener("message", ({ data }) => {
      self.postMessage(data);
    });
  `
], { type: "application/javascript" })));

worker.addEventListener("message", ({ data }) => {
  ipcRenderer.send("executeDebugCode", data);
});

parent.postMessage({
  type: "requestDebugLogs"
});

window.addEventListener("message", ({ data: { type, debugLogs } }) => {
  if (!type.startsWith("debugLog")) return;
  document.getElementById("debugLogInput").value = (type === "debugLog") ? (document.getElementById("debugLogInput").value + ((document.getElementById("debugLogInput").value.length) ? "\n" : "") + "[" + (document.getElementById("debugLogInput").value.split("\n").filter((debugLog) => debugLog).length + 1).toString() + "] " + JSON.stringify(debugLogs[0])) : debugLogs.map((debugLog, index) => "[" + (index + 1).toString() + "] " + JSON.stringify(debugLog)).join("\n");
});

document.getElementById("debugCodeExecutionButton").addEventListener("click", () => {
  if (!document.getElementById("debugCodeExecutionInput").value || !confirm("Are you sure you want to execute this code possibly corrupting your computer?")) return;
  worker.postMessage(document.getElementById("debugCodeExecutionInput").value);
  document.getElementById("debugCodeExecutionInput").value = "";
});

document.getElementById("debugCodeExecutionInput").addEventListener("keydown", ({ key }) => {
  if ((key !== "Enter") || !document.getElementById("debugCodeExecutionInput").value || !confirm("Are you sure you want to execute this code possibly corrupting your computer?")) return;
  worker.postMessage(document.getElementById("debugCodeExecutionInput").value);
  document.getElementById("debugCodeExecutionInput").value = "";
});