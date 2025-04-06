import axios from "axios";

// Create an Axios instance for the Orders API
const api = axios.create({
  baseURL: "http://localhost:5000/api/users",
});

// Add a request interceptor to include the Authorization token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
