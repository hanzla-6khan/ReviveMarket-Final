import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./ui/AppLayout";
import PublicLayout from "./ui/PublicLayout";

import ProtectedRoute from "./ui/ProtectedRoute";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Orders from "./pages/Orders";

import { setUser } from "./features/auth/authSlice";
import Profile from "./pages/Profile";
import NotFoundPage from "./ui/NotFoundPage";
import ProductPage from "./features/products/ProductPage";
import ForgotPassword from "./features/auth/ForgotPassword";
import ResetPassword from "./features/auth/ResetPassword";
import EmailVerification from "./features/auth/EmailVerification";
import PromotionPage from "./features/products/PromotionPage";
import MyOrders from "./pages/MyOrders";
import Events from "./pages/Events";
import EventsPage from "./features/events/EventsPage";
import EventDetail from "./features/events/EventDetail";
import Messages from "./pages/Messages";

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, userType } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setUser({ token }));
    }
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route
            path="login"
            element={
              isAuthenticated ? (
                <Navigate
                  to={userType === "seller" ? "/dashboard" : "/my-orders"}
                  replace
                />
              ) : (
                <LoginPage />
              )
            }
          />
          <Route
            path="register"
            element={
              isAuthenticated ? (
                <Navigate
                  to={userType === "seller" ? "/dashboard" : "/my-orders"}
                  replace
                />
              ) : (
                <RegisterPage />
              )
            }
          />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="auth/resetPassword/:token" element={<ResetPassword />} />
          <Route
            path="auth/verifyEmail/:token"
            element={<EmailVerification />}
          />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="events-page" element={<EventsPage />} />
          <Route path="events/:id" element={<EventDetail />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <Navigate
                replace
                to={userType === "seller" ? "dashboard" : "my-orders"}
              />
            }
          />
          {/* Seller-only routes */}
          <Route path="dashboard" element={<Products />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="promotion" element={<PromotionPage />} />
          <Route path="events" element={<Events />} />

          {/* Shared routes */}
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
          <Route path="my-orders" element={<MyOrders />} />
          {/* <Route path="settings" element={<>Settings</>} />
          <Route path="logout" element={<>Logout</>} /> */}
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
