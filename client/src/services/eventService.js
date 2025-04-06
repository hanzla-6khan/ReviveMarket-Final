import axios from "axios";

// Create an Axios instance for the Events API
const api = axios.create({
  baseURL: "http://localhost:5000/api/events",
});

// Add a request interceptor to include the Authorization token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Create a new event
export const createEvent = async (eventData) => {
  const response = await api.post("/", eventData);
  return response.data;
};

// Get all events
export const fetchAllEvents = async () => {
  const response = await api.get("/");
  return response.data;
};

// Get user's events
export const fetchUserEvents = async () => {
  const response = await api.get("/my-events");
  return response.data;
};

// Get an event by ID
export const fetchEventById = async (eventId) => {
  const response = await api.get(`/${eventId}`);
  return response.data;
};

// Update an event
export const updateEvent = async (eventId, eventData) => {
  const response = await api.patch(`/${eventId}`, eventData);
  return response.data;
};

// Join an event
export const joinEvent = async (eventId) => {
  const response = await api.patch(`/${eventId}/join`);
  return response.data;
};
