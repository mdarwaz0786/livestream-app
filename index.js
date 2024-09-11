const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const dotenv = require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static(path.join(__dirname, "public")));
let adminSocket = null;

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("is-admin", () => {
    adminSocket = socket;
    console.log("Admin connected");
  });

  socket.on("offer", (offer) => {
    console.log("Broadcasting offer", offer);
    socket.broadcast.emit("offer", offer);
  });

  socket.on("answer", (answer) => {
    console.log("Broadcasting answer", answer);
    socket.broadcast.emit("answer", answer);
  });

  socket.on("ice-candidate", (candidate) => {
    console.log("Broadcasting ICE candidate", candidate);
    socket.broadcast.emit("ice-candidate", candidate);
  });

  socket.on("mute-audio", (mute) => {
    console.log("Broadcasting mute audio", mute);
    socket.broadcast.emit("mute-audio", mute);
  });

  socket.on("stop-video", (stop) => {
    console.log("Broadcasting stop video", stop);
    socket.broadcast.emit("stop-video", stop);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });

  socket.on("user-reconnected", () => {
    if (adminSocket) {
      console.log("Resending offer to reconnected user");
      adminSocket.emit("resend-offer");
    };
  });
});

// Home route to go live streaming
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

// Admin route to start live streaming
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// User route to watch live streaming
app.get("/user", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "user.html"));
});

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log("Server is running on port number 8080 on the base url (http://localhost:8080)");
});
