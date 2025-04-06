import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/chat",
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Start a new conversation with a seller about a product
export const startConversation = async (productId) => {
  const response = await api.post("/conversations", { productId });
  return response.data;
};

// Send a message in a conversation
export const sendMessage = async ({ conversationId, content }) => {
  const response = await api.post("/messages", {
    conversationId,
    content,
  });
  return response.data;
};

// Get all messages in a conversation
export const getConversationMessages = async (conversationId) => {
  const response = await api.get(`/conversations/${conversationId}/messages`);
  return response.data;
};

// Get all conversations for the current user
export const getUserConversations = async () => {
  const response = await api.get("/conversations");
  return response.data;
};
