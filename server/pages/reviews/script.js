(async () => {
  new Chart(document.getElementById("reviewChart"), {
    type: "bar",
    data: {
      labels: Array.apply(null, Array(5)).map((_, index) => (index + 1).toString() + " Star" + ((!index) ? "" : "s")),
      datasets: [
        {
          label: "Reviews",
          data: await (await fetch("/api/v1/feedback/get")).json().then(({ feedback }) => feedback).catch(() => {}),
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(201, 203, 207, 0.2)",
          ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(255, 159, 64)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(54, 162, 235)",
            "rgb(153, 102, 255)",
            "rgb(201, 203, 207)",
          ],
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    }
  });

  if ("serviceWorker" in navigator) navigator.serviceWorker.register("/serviceWorker.js");
})();