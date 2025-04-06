import axios from "axios";

// Create an Axios instance for the Orders API
const api = axios.create({
  baseURL: "http://localhost:5000/api/orders",
});

// Add a request interceptor to include the Authorization token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Create a new order
export const createOrder = async (orderData) => {
  const response = await api.post("/", orderData);
  return response.data;
};

// Fetch an order by ID
export const fetchOrderById = async (orderId) => {
  const response = await api.get(`/${orderId}`);
  return response.data;
};

// Fetch all orders (admin only)
export const fetchAllOrders = async () => {
  const response = await api.get("/my-orders");
  return response.data;
};

// Fetch orders for a specific seller
export const fetchUserOrders = async () => {
  const response = await api.get("/all");
  return response.data;
};

// Fetch orders for the current user
export const fetchMyOrders = async () => {
  const response = await api.get("/my-orders");
  return response.data;
};

// Update an order status (admin only)
export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/${orderId}`, { status });
  return response.data;
};

// Delete an order (admin only)
export const deleteOrder = async (orderId) => {
  const response = await api.delete(`/${orderId}`);
  return response.data;
};
