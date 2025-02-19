const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const { setSocketServer } = require("./lib/mongodb");  // Adjust the path as necessary

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Set the Socket.IO server
setSocketServer(io);

io.on("connection", (socket: any) => {  // Adding type definition for socket
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
