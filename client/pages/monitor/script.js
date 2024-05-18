let chartCollection = {};

parent.postMessage({
  type: "requestConnectedDevices"
});

window.addEventListener("message", ({ data: { type, deviceList, usageData } }) => {
  if (type === "connectionData") {
    deviceList.forEach(([deviceId, deviceName]) => {
      if (document.getElementById("collapsibleContainer").children[0].className === "monitorDeviceSearchPlaceholder") document.getElementById("collapsibleContainer").innerHTML = "";
      if (!Object.keys(chartCollection).includes(deviceId)) {
        let collapsibleChartContainer = document.createElement("div");
        collapsibleChartContainer.dataset.id = deviceId;
        let collapsibleChartContainerButton = document.createElement("button");
        collapsibleChartContainerButton.className = "collapsible";
        if ((JSON.parse(localStorage.getItem("settings")) || {}).darkMode) collapsibleChartContainerButton.style.filter = "invert(95%) hue-rotate(180deg) brightness(1.5)";
        if (!document.getElementById("collapsibleContainer").children.length) {
          collapsibleChartContainerButton.style.borderTopLeftRadius = "10px";
          collapsibleChartContainerButton.style.borderTopRightRadius = "10px";
        };
        collapsibleChartContainerButton.innerText = deviceName;
        collapsibleChartContainerButton.addEventListener("click", ({ target }) => {
          target.classList.toggle("openedCollapsible");
          if (target.nextElementSibling.style.maxHeight){
            target.nextElementSibling.style.maxHeight = null;
          } else {
            target.nextElementSibling.style.maxHeight = target.nextElementSibling.scrollHeight + "px";
          };
        });
        let collapsibleChartContainerContent = document.createElement("div");
        collapsibleChartContainerContent.className = "collapsibleContent";
        collapsibleChartContainerContent.style.display = "grid";
        collapsibleChartContainerContent.style.gridAutoFlow = "column";
        let collapsibleChartContainerContentCPUChartHolder = document.createElement("div");
        collapsibleChartContainerContentCPUChartHolder.style.width = "30vw";
        collapsibleChartContainerContentCPUChartHolder.style.paddingTop = "7.5px";
        let collapsibleChartContainerContentCPUChart = document.createElement("canvas");
        chartCollection = {
          ...chartCollection,
          ...{
            [deviceId]: {
              ...chartCollection[deviceId] || {},
              ...{
                cpuUsage: new Chart(collapsibleChartContainerContentCPUChart, {
                  type: "line",
                  data: {
                    labels: [],
                    datasets: [{
                      label: "CPU Usage",
                      data: [],
                      fill: false,
                      borderColor: "rgb(75, 192, 192)",
                      tension: 0.1
                    }]
                  }
                })
              }
            }
          }
        };
        let collapsibleChartContainerContentMemoryChartHolder = document.createElement("div");
        collapsibleChartContainerContentMemoryChartHolder.style.width = "30vw";
        collapsibleChartContainerContentMemoryChartHolder.style.paddingTop = "7.5px";
        let collapsibleChartContainerContentMemoryChart = document.createElement("canvas");
        chartCollection = {
          ...chartCollection,
          ...{
            [deviceId]: {
              ...chartCollection[deviceId] || {},
              ...{
                memoryUsage: new Chart(collapsibleChartContainerContentMemoryChart, {
                  type: "line",
                  data: {
                    labels: [],
                    datasets: [{
                      label: "Memory Usage",
                      data: [],
                      fill: false,
                      borderColor: "rgb(75, 192, 192)",
                      tension: 0.1
                    }]
                  }
                })
              }
            }
          }
        };
        let collapsibleChartContainerContentWLANChartHolder = document.createElement("div");
        collapsibleChartContainerContentWLANChartHolder.style.width = "30vw";
        collapsibleChartContainerContentWLANChartHolder.style.paddingTop = "7.5px";
        let collapsibleChartContainerContentWLANChart = document.createElement("canvas");
        chartCollection = {
          ...chartCollection,
          ...{
            [deviceId]: {
              ...chartCollection[deviceId] || {},
              ...{
                wlanUsage: new Chart(collapsibleChartContainerContentWLANChart, {
                  type: "line",
                  data: {
                    labels: [],
                    datasets: [{
                      label: "WLAN Usage",
                      data: [],
                      fill: false,
                      borderColor: "rgb(75, 192, 192)",
                      tension: 0.1
                    }]
                  }
                })
              }
            }
          }
        };
        collapsibleChartContainerContentCPUChartHolder.appendChild(collapsibleChartContainerContentCPUChart);
        collapsibleChartContainerContentMemoryChartHolder.appendChild(collapsibleChartContainerContentMemoryChart);
        collapsibleChartContainerContentWLANChartHolder.appendChild(collapsibleChartContainerContentWLANChart);
        collapsibleChartContainerContent.appendChild(collapsibleChartContainerContentCPUChartHolder);
        collapsibleChartContainerContent.appendChild(collapsibleChartContainerContentMemoryChartHolder);
        collapsibleChartContainerContent.appendChild(collapsibleChartContainerContentWLANChartHolder);
        collapsibleChartContainer.appendChild(collapsibleChartContainerButton);
        collapsibleChartContainer.appendChild(collapsibleChartContainerContent);
        document.getElementById("collapsibleContainer").appendChild(collapsibleChartContainer);
      };
    });
  } else if (type === "usageData") {
    chartCollection[deviceList[0][0]][usageData[0]].data.labels = Array.apply(null, Array([
      ...chartCollection[deviceList[0][0]][usageData[0]].data.datasets[0].data,
      ...[
        usageData[1]
      ]
    ].slice(-20).length)).map(() => "");
    chartCollection[deviceList[0][0]][usageData[0]].data.datasets[0].data = [
      ...chartCollection[deviceList[0][0]][usageData[0]].data.datasets[0].data,
      ...[
        usageData[1]
      ]
    ].slice(-20);
    chartCollection[deviceList[0][0]][usageData[0]].update();
  } else if (type === "disconnectionData") {
    Array.from(document.getElementById("collapsibleContainer").children).find((collapsibleChartContainer) => collapsibleChartContainer.dataset.id === deviceList[0][0]).remove();
  };
});

