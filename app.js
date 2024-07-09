const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const users = [];

io.on("connection", (socket) => {
  // Send the socket id to the newly connected client
  socket.emit("getID", socket.id);

  // Add the new user's socket id to the list
  users.push(socket.id);

  console.log("====================================");
  console.log(users);
  console.log("====================================");

  // Emit the updated users list to all connected clients
  io.emit("users", users);

  socket.on("disconnect", () => {
    console.log("Client disconnected with id ", socket.id);
    // Remove the disconnected user's socket id from the list
    const index = users.indexOf(socket.id);
    if (index !== -1) {
      users.splice(index, 1);
    }
    // Emit the updated users list to all connected clients
    io.emit("users", users);
  });

  socket.on("newMessage", (msg) => {
    io.emit("newMessage", msg);
  });

  socket.on("privateMessage", (obj) => {

    console.log('====================================');
    console.log(obj);
    console.log('====================================');
    // { senderId, receiverId, message }
    io.to(obj.receiverId).to(obj.senderId).emit("privateMessage", obj.message);
  });
});

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
  console.log(`http://localhost:3000/`);
});
