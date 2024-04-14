document.getElementById("markdownEmbed").addEventListener("load", () => {
  document.getElementById("markdownEmbed").contentWindow.document.getElementById("sidebar-toc-btn")?.click();
  let markdownStylesheet = document.createElement("style");
  markdownStylesheet.innerHTML = ".crossnote {\nfilter: hue-rotate(45deg);\n}\n\n::selection {\ncolor: white;\nbackground-color: #00738b;\n}\n\nimg {\nfilter: hue-rotate(-40deg);\n}"
  let markdownMediaStylesheet = document.createElement("style");
  markdownMediaStylesheet.innerHTML = "@media (prefers-color-scheme: dark) {\nimg {\nfilter: invert(95%) hue-rotate(140deg);\n}\n}";
  document.getElementById("markdownEmbed").contentWindow.document.head.appendChild(markdownStylesheet);
  document.getElementById("markdownEmbed").contentWindow.document.head.appendChild(markdownMediaStylesheet);
  document.getElementById("markdownEmbed").contentWindow.document.styleSheets[3].media.appendMedium("(prefers-color-scheme: " + ((location.search.split("?darkMode=")[1] === "true") ? "dark" : "white") + ")");
  document.getElementById("markdownEmbed").contentWindow.document.getElementsByTagName("source")[0].media = "(prefers-color-scheme: " + ((location.search.split("?darkMode=")[1] === "true") ? "dark" : "white") + ")";
});