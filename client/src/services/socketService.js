import io from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    this.socket = io("http://localhost:5000");

    this.socket.on("connect", () => {
      console.log("Connected to socket server");
      this.socket.emit("join", userId);
    });

    return this.socket;
  }

  joinConversation(conversationId) {
    if (this.socket) {
      this.socket.emit("joinConversation", conversationId);
    }
  }

  leaveConversation(conversationId) {
    if (this.socket) {
      this.socket.emit("leaveConversation", conversationId);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
