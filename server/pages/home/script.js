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
    })
    .catch(() => {});
  };
});

if ("serviceWorker" in navigator) navigator.serviceWorker.register("/serviceWorker.js");