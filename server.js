const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const messageRoutes = require("./messages");
const Message = require("./Message");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

mongoose.connect("mongodb://localhost:27017/chatApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use("/api/messages", messageRoutes);

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("chatMessage", async (data) => {
    const msg = new Message({ username: data.username, message: data.message });
    await msg.save();
    io.emit("chatMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server listening on port 5000");
});
