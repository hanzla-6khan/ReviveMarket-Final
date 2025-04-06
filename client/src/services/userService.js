import api from "./api";

// Get User
export const getUserAPI = async () => {
  const response = await api.get("/");
  return response.data;
};

// Update User
export const updateUserAPI = async (id, userData) => {
  const response = await api.put(`/${id}`, userData);
  return response.data;
};

// Delete User
export const deleteUserAPI = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};

// Update Password
export const updatePasswordAPI = async (password) => {
  const response = await api.put("/update-password", { password });
  return response.data;
};
