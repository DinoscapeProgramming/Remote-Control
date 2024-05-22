const { ipcRenderer } = parent.require("electron");

parent.postMessage({
  type: "requestDebugLogs"
});

window.addEventListener("message", ({ data: { type, debugLogs } }) => {
  if (!type.startsWith("debugLog")) return;
  document.getElementById("debugLogInput").value = (type === "debugLog") ? (document.getElementById("debugLogInput").value + ((document.getElementById("debugLogInput").value.length) ? "\n" : "") + "[" + (document.getElementById("debugLogInput").value.split("\n").length + 1).toString() + "] " + debugLogs[0]) : debugLogs.map((debugLog, index) => "[" + (index + 1).toString() + "] " + debugLog).join("\n");
});

document.getElementById("debugCodeExecutionButton").addEventListener("click", () => {
  if (!confirm("Are you sure you want to execute this code possibly corrupting your computer?")) return;
  ipcRenderer.send("executeDebugCode", document.getElementById("debugCodeExecutionInput").value);
  document.getElementById("debugCodeExecutionInput").value = "";
});

document.getElementById("debugCodeExecutionInput").addEventListener("keydown", ({ key }) => {
  if ((key !== "Enter") || !confirm("Are you sure you want to execute this code possibly corrupting your computer?")) return;
  ipcRenderer.send("executeDebugCode", document.getElementById("debugCodeExecutionInput").value);
  document.getElementById("debugCodeExecutionInput").value = "";
});