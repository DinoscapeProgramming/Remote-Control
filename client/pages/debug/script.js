parent.postMessage({
  type: "requestDebugLogs"
});

window.addEventListener("message", ({ data: { type, debugLogs } }) => {
  if (!type.startsWith("debugLog")) return;
  document.getElementById("debugLogInput").value = (type === "debugLog") ? (document.getElementById("debugLogInput").value + ((document.getElementById("debugLogInput").value.length) ? "\n" : "") + "[" + (document.getElementById("debugLogInput").value.split("\n").length + 1).toString() + "] " + debugLogs[0]) : debugLogs.map((debugLog, index) => "[" + (index + 1).toString() + "] " + debugLog).join("\n");
});