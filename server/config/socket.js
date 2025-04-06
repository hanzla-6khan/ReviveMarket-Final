// config/socket.js
const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5174",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on("joinConversation", (conversationId) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`Joined conversation: ${conversationId}`);
    });

    socket.on("leaveConversation", (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`Left conversation: ${conversationId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { initializeSocket, getIO };
