import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  deleteUserAPI,
  getUserAPI,
  updatePasswordAPI,
  updateUserAPI,
} from "../../services/userService";

// Async thunks
export const getUser = createAsyncThunk(
  "user/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserAPI();
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ userData }, { rejectWithValue }) => {
    try {
      const data = await updateUserAPI(userData._id, userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (password, { rejectWithValue }) => {
    try {
      const data = await updatePasswordAPI(password);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "user/deleteAccount",
  async (id, { rejectWithValue }) => {
    try {
      const data = await deleteUserAPI(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get User
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload.user;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch user data";
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload.updatedUser;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update user";
      })
      // Update Password
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update password";
      })
      // Delete Account
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.loading = false;
        state.userData = null;
        state.error = null;
        localStorage.removeItem("token");
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete account";
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
