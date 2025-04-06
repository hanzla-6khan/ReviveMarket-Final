import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: JSON.parse(localStorage.getItem("cart")) || [], // Persisted state
};

const saveToLocalStorage = (state) => {
  localStorage.setItem("cart", JSON.stringify(state.items));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += 1; // Increment quantity for existing items
      } else {
        state.items.push({ ...action.payload, quantity: 1 }); // Add new item
      }
      saveToLocalStorage(state);
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) item.quantity += 1;
      saveToLocalStorage(state);
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.quantity -= 1;
        if (item.quantity === 0) {
          state.items = state.items.filter(
            (item) => item.id !== action.payload
          );
        }
      }
      saveToLocalStorage(state);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveToLocalStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      saveToLocalStorage(state);
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
