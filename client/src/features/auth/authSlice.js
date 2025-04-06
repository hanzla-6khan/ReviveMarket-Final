import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  forgotPasswordAPI,
  loginUserAPI,
  loginWithGoogleAPI,
  registerUserAPI,
  resetPasswordAPI,
  verifyEmailAPI,
} from "../../services/authService";
import axios from "axios";

// Base API URL

// Async Actions for Login and Register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await registerUserAPI(userData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData, { rejectWithValue }) => {
    try {
      const data = await loginUserAPI(loginData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Verify Email
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token, { rejectWithValue }) => {
    try {
      const data = await verifyEmailAPI(token);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Email verification failed"
      );
    }
  }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const data = await forgotPasswordAPI(email);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to send password reset email",
        }
      );
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const data = await resetPasswordAPI(token, newPassword);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Password reset failed" }
      );
    }
  }
);

// Login with Google
export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (tokenId, { rejectWithValue }) => {
    try {
      const data = await loginWithGoogleAPI(tokenId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Google login failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    isLoading: false,
    isAuthenticated: !!localStorage.getItem("token") || false,
    userType: localStorage.getItem("userType") || null,
    userID: localStorage.getItem("userID") || null,
    message: null,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.userType = null;
      state.userID = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      localStorage.removeItem("userID");
    },
    setUser: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    clearMessages: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.message = action.payload.message;
        state.userType = action.payload.userType;
        state.userID = action.payload.userID;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("userType", action.payload.userType);
        localStorage.setItem("userID", action.payload.userID);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Register cases
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        state.isLoading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        console.log("action.payload", action.payload);
        state.isLoading = false;
        state.error = action.payload;
        state.message = null;
      });

    // Forgot Password cases
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      });

    // Reset Password cases
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        state.isLoading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        console.log("action.payload", action.payload);
        state.isLoading = false;
        state.error = action.payload.message;
        state.message = null;
      });

    // Verify Email cases
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        console.log("action.payload", action.payload);
        state.isLoading = false;
        state.error = action.payload;
      });

    // Google Login cases
    builder
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.message = action.payload.message;
        state.token = action.payload.token;
        state.userType = action.payload.userType;
        state.userID = action.payload.userID;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("userType", action.payload.userType);
        localStorage.setItem("userID", action.payload.userID);
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.error = action.payload.message;
      });
  },
});
export const { logout, setUser, clearMessages } = authSlice.actions;
export default authSlice.reducer;
