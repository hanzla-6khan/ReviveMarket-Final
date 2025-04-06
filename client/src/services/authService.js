import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Register User API
export const registerUserAPI = async (userData) => {
  console.log("userData", userData);
  const response = await axios.post(`${API_URL}/register`, userData);
  console.log("response", response);
  return response.data; // Assuming response contains { user, token }
};

// Login User API
export const loginUserAPI = async (loginData) => {
  const response = await axios.post(`${API_URL}/login`, loginData);
  return response.data; // Assuming response contains { user, token }
};

// Verify Email API
export const verifyEmailAPI = async (token) => {
  const response = await axios.patch(`${API_URL}/verifyEmail/${token}`);
  return response.data;
};

// Forgot Password API
export const forgotPasswordAPI = async (email) => {
  const response = await axios.post(`${API_URL}/forgotPassword`, { email });
  return response.data;
};

// Reset Password API
export const resetPasswordAPI = async (token, newPassword) => {
  const response = await axios.patch(`${API_URL}/resetPassword/${token}`, {
    newPassword,
  });
  return response.data;
};

// Login with Google API
export const loginWithGoogleAPI = async (token) => {
  const response = await axios.post(`${API_URL}/loginWithGoogle`, { token });
  return response.data; // Assuming response contains { user, token }
};

// Get Current User API (optional if backend provides it)
export const getCurrentUserAPI = async (token) => {
  const response = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; // Assuming response contains user details
};
