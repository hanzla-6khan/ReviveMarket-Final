import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, CircularProgress, Container } from "@mui/material";
import { useEffect, useState } from "react";

// List of routes that only sellers can access
const SELLER_ONLY_ROUTES = [
  "/products",
  "/orders",
  "/promotion",
  "/dashboard",
  "/events",
];

// Routes that any authenticated user can access
const SHARED_ROUTES = ["/profile", "/messages"];

// list of routes that only users can access
const USER_ROUTES = ["/my-orders"];

function ProtectedRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const {
    isAuthenticated,
    isLoading: authLoading,
    userType,
  } = useSelector((state) => state.auth);

  // Add a slight delay before redirect to prevent flash of content
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Show loading spinner while checking auth state
  if (authLoading || isLoading) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Get the current path
  const currentPath = "/" + location.pathname.split("/")[1];

  // Check route types
  const isSellerRoute = SELLER_ONLY_ROUTES.includes(currentPath);
  const isUserRoute = USER_ROUTES.includes(currentPath);
  const isSharedRoute = SHARED_ROUTES.includes(currentPath);

  // Handle seller routes
  if (isSellerRoute && userType !== "seller") {
    // Redirect non-sellers to my-orders (if they're a regular user) or login
    return (
      <Navigate to={userType === "user" ? "/my-orders" : "/login"} replace />
    );
  }

  // Handle user-only routes
  if (isUserRoute && userType !== "user") {
    // Redirect sellers to their dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Handle shared routes - no additional checks needed as they're accessible
  // to all authenticated users

  // Handle unknown routes - redirect to appropriate default page based on user type
  if (!isSellerRoute && !isUserRoute && !isSharedRoute) {
    return (
      <Navigate
        to={userType === "seller" ? "/dashboard" : "/my-orders"}
        replace
      />
    );
  }

  // Render protected content if all checks pass
  return children;
}

export default ProtectedRoute;
