document.getElementById("markdownEmbed").addEventListener("load", () => {
  let markdownStylesheet = document.createElement("style");
  markdownStylesheet.innerHTML = ".crossnote { filter: hue-rotate(45deg); } ::selection { color: white; background-color: #00738b; } img { filter: hue-rotate(-40deg); } @media (prefers-color-scheme: dark) { img { filter: invert(95%) hue-rotate(140deg); } }";
  document.getElementById("markdownEmbed").contentWindow.document.head.appendChild(markdownStylesheet);
  document.getElementById("markdownEmbed").contentWindow.document.getElementById("sidebar-toc-btn")?.click();
});

window.addEventListener("message", ({ data: darkMode }) => {
  document.styleSheets[1].media.appendMedium("(prefers-color-scheme: " + ((darkMode) ? "dark" : "white") + ")");
});