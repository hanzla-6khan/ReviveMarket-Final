import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/profile/userSlice";
import productReducer from "../features/products/productSlice";
import orderReducer from "../features/orders/orderSlice";
import cartReducer from "../features/cart/cartSlice";
import eventReducer from "../features/events/eventSlice";
import messageReducer from "../features/message/messageSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    products: productReducer,
    orders: orderReducer,
    cart: cartReducer,
    events: eventReducer,
    messages: messageReducer,
  },
});

export default store;
