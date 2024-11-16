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
  Array.from(document.getElementById("markdownEmbed").contentWindow.document.getElementsByClassName("crossnote")[0].getElementsByTagName("a")).filter((anchor) => (new URL(anchor)).hostname !== location.hostname).forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      event.preventDefault();
      if (confirm("Are you sure you want to open this page possibly corrupting your computer?")) {
        let link = document.createElement("a");
        link.href = anchor.href;
        link.click();
      };
    });
  });
});

if ("serviceWorker" in navigator) navigator.serviceWorker.register("/serviceWorker.js");