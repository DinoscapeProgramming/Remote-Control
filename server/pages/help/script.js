document.getElementById("markdownEmbed").addEventListener("load", () => {
  let markdownStylesheet = document.createElement("style");
  markdownStylesheet.innerHTML = ".crossnote { filter: hue-rotate(45deg); } ::selection { color: white; background-color: #00738b; }";
  document.getElementById("markdownEmbed").contentWindow.document.head.appendChild(markdownStylesheet);
  document.getElementById("markdownEmbed").contentWindow.document.getElementById("sidebar-toc-btn")?.click();
});