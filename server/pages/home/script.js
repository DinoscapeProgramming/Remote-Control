document.getElementById("newsletterButton").addEventListener("click", () => {
  document.getElementById("newsletterInput").reportValidity();
  if (document.getElementById("newsletterInput").checkValidity()) {
    fetch("/api/v1/newsletter/register", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: document.getElementById("newsletterInput").value
      })
    })
    .then((res) => res.json())
    .then(({ err }) => {
      if (err) return;
      document.getElementById("newsletterInput").value = "";
    });
  };
});

if (!["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) && !navigator.userAgent.includes("Mac") && !("ontouchend" in document)) {
  let serviceWorkerRegistration = document.createElement("script");
  serviceWorkerRegistration.setAttribute("defer", "");
  serviceWorkerRegistration.setAttribute("src", "/serviceWorker.js");
  document.head.appendChild(serviceWorkerRegistration);
};