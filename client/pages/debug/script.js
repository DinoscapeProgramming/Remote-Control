parent.postMessage({
  type: "requestDebugLogs"
});

window.addEventListener("message", ({ data: { type, debugLogs } }) => {
  if (!type.startsWith("debugLog")) return;
  document.getElementById("debugLogInput").innerText = (type === "debugLog") ? (document.getElementById("debugLogInput").innerText + "\n [" + (document.getElementById("debugLogInput").innerText.split("\n").length + 1).toString() + "] " + debugLogs[0]) : debugLogs.map((debugLog, index) => "[" + (index + 1).toString() + "] " + debugLog).join("\n");
});