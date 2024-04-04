let windowClicked = false;

window.addEventListener("click", () => {
  if (windowClicked) return;
  windowClicked = true;

  const socket = io("/");
  const peer = new Peer(null, {
    path: "/peer",
    host: "/",
    port: "3000",
  });

  peer.on("open", (peerId) => {
    socket.emit("peerId", peerId);
  });

  peer.on("call", (call) => {
    call.answer(new MediaStream());
    call.on("stream", (videoStream) => {
      document.getElementById("screenVideo").srcObject = videoStream;
    });
  });

  socket.emit("joinRoom", {
    type: "server",
    roomId: prompt("Please enter your room id:"),
    password: prompt("Now the password please:")
  });

  document
    .getElementById("screenVideo")
    .addEventListener("loadedmetadata", () => {
      document.getElementById("screenVideo").play();
    });

  socket.on("validPassword", ({ screenWidth, screenHeight } = {}) => {
    document
      .getElementById("screenVideo")
      .addEventListener("mousemove", ({ clientX, clientY } = {}) => {
        socket.emit("mouseMove", {
          x:
            ((screenWidth/* + 244*/) / 100) *
              (((clientX - document.getElementById("screenVideo").offsetLeft) /
                /*document.getElementById("screenVideo").videoWidth*/ 1280) *
                100)/* -
            167.5*/,
          y:
            (screenHeight / 100) *
              (((clientY - document.getElementById("screenVideo").offsetTop) /
                /*document.getElementById("screenVideo").videoHeight*/720) *
                100)/* +
            21,*/
        });
      });

    document.getElementById("screenVideo").addEventListener("mousedown", () => {
      socket.emit("mouseClick");
    });

    window.addEventListener("keyup", ({ key }) => {
      socket.emit("keyTap", key);
    });
  });
});
