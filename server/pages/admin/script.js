let newsletterContentEditor = ace.edit("newsletterContentEditor");
newsletterContentEditor.setTheme("ace/theme/monokai");
newsletterContentEditor.session.setMode(new (ace.require("ace/mode/html").Mode)());
newsletterContentEditor.setOption("tabSize", 2);
newsletterContentEditor.setValue(`<!DOCTYPE PUBLIC “-//W3C//DTD XHTML 1.0 Transitional//EN” “https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd”>\n<html xmlns="http://www.w3.org/1999/xhtml">  <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width,initial-scale=1.0">\n    <title></title>\n  </head>\n  <body></body>\n</html>`);

fetch("/api/v1/admin/verify")
.then((response) => response.json())
.then(({ valid }) => {
  if (!valid) return;
  document.body.style.backgroundColor = "white";
  document.getElementById("adminLoginContainer").style.display = "none";
  document.getElementById("adminPortalContainer").style.display = "block";
});

document.getElementById("adminLoginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  fetch("/api/v1/admin/login", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(Object.fromEntries(new FormData(document.getElementById("adminLoginForm")).entries()))
  })
  .then((response) => response.json())
  .then(({ err }) => {
    if (err) return;
    document.body.style.backgroundColor = "white";
    document.getElementById("adminLoginContainer").style.display = "none";
    document.getElementById("adminPortalContainer").style.display = "block";
  });
});

document.querySelectorAll(".sidebar a").forEach((link) => {
  link.addEventListener("click", ({ target }) => {
    document.querySelectorAll(".mainContent > div").forEach((section) => (section.style.display = "none"));
    document.querySelectorAll(".sidebar a").forEach((link) => link.classList.remove("active"));
    target.classList.add("active");
    document.querySelector(target.getAttribute("href")).style.display = "block";
  });
});

document.getElementById("newsletterContentTypeSelect").addEventListener("change", () => {
  document.getElementById("newsletterContentLabel").htmlFor = ((document.getElementById("newsletterContentTypeSelect").value === "text") ? "newsletterContentInput" : "newsletterContentEditor");
  ((document.getElementById("newsletterContentTypeSelect").value === "text") ? document.getElementById("newsletterContentEditor") : document.getElementById("newsletterContentInput")).style.display = "none";
  ((document.getElementById("newsletterContentTypeSelect").value === "text") ? document.getElementById("newsletterContentInput") : document.getElementById("newsletterContentEditor")).style.display = "block";
});

document.getElementById("newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  document.getElementById("newsletterHiddenContentInput").value = ((document.getElementById("newsletterContentTypeSelect").value === "text") ? document.getElementById("newsletterContentInput").value : newsletterContentEditor.getValue());
  event.target.submit();
});

if ("serviceWorker" in navigator) navigator.serviceWorker.register("/serviceWorker.js");