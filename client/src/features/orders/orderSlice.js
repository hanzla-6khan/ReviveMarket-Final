import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createOrder,
  fetchAllOrders,
  fetchUserOrders,
  updateOrderStatus,
  deleteOrder,
  fetchOrderById,
  fetchMyOrders,
} from "../../services/orderService";

// Create a new order
export const createNewOrder = createAsyncThunk(
  "orders/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await createOrder(orderData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create order"
      );
    }
  }
);

// get order by id
export const getOrderById = createAsyncThunk(
  "orders/getOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await fetchOrderById(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order"
      );
    }
  }
);

// Fetch all orders (admin)
export const getAllOrders = createAsyncThunk(
  "orders/getAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAllOrders();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

// Fetch orders for the current seller
export const getUserOrders = createAsyncThunk(
  "orders/getUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchUserOrders();
      return response; // Assuming the API returns an array of orders
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user orders"
      );
    }
  }
);

// Fetch orders for the current user
export const getMyOrders = createAsyncThunk(
  "orders/getMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchMyOrders();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user orders"
      );
    }
  }
);

// Update order status 
export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await updateOrderStatus(orderId, status);
      return response; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order"
      );
    }
  }
);

// Delete an order (admin)
export const removeOrder = createAsyncThunk(
  "orders/removeOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await deleteOrder(orderId);
      return { orderId, message: response.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete order"
      );
    }
  }
);

// Initial state
const initialState = {
  orders: [], // All orders (admin view)
  userOrders: [], // Current user's orders
  order: null, // Selected order for editing
  isLoading: false,
  error: null,
  successMessage: null,
};

// Order Slice
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Create Order
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders.push(action.payload);
        state.successMessage = action.payload.message;
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    //   Get Order by ID
    builder.addCase(getOrderById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getOrderById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.order = action.payload.order;
    });
    builder.addCase(getOrderById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Fetch All Orders (Admin)
    builder
      .addCase(getAllOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch My Orders
    builder
      .addCase(getMyOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload.orders;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch User Orders
    builder
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update Order Status (Admin)
    builder
      .addCase(updateOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.orders.findIndex(
          (order) => order._id === action.payload._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload; // Update the order status in the state
        }
        state.successMessage = "Order status updated successfully!";
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Delete Order (Admin)
    builder
      .addCase(removeOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload.orderId
        );
        state.successMessage = action.payload.message;
      })
      .addCase(removeOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Actions
export const { clearMessages } = orderSlice.actions;

// Reducer
export default orderSlice.reducer;
