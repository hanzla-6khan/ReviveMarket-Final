import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  styled,
  useTheme,
  alpha,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import {
  Close as CloseIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  ArrowForward as ArrowForwardIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon,
  LocationOn as LocationOnIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import { clearCart } from "../cart/cartSlice";
import { createNewOrder } from "../orders/orderSlice";

// Styled Components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 20,
    background: `linear-gradient(145deg, ${alpha(
      theme.palette.background.default,
      0.95
    )}, ${alpha(theme.palette.background.paper, 0.95)})`,
    backdropFilter: "blur(20px)",
    boxShadow: `0 8px 40px ${alpha(theme.palette.primary.main, 0.12)}`,
  },
}));

const FormTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor: alpha(theme.palette.background.paper, 0.6),
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: alpha(theme.palette.background.paper, 0.8),
      boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
    "&.Mui-focused": {
      backgroundColor: alpha(theme.palette.background.paper, 1),
      boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.9rem",
  },
  "& .MuiOutlinedInput-input": {
    padding: "14px 16px",
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "12px 24px",
  textTransform: "none",
  fontSize: "1rem",
  fontWeight: 600,
  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
  "&:hover": {
    boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.35)}`,
    transform: "translateY(-2px)",
  },
  transition: "all 0.3s ease",
}));

const OrderSummaryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  backgroundColor: alpha(theme.palette.background.paper, 0.4),
  backdropFilter: "blur(10px)",
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
  "& .MuiStepLabel-label": {
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  "& .MuiStepIcon-root": {
    color: theme.palette.primary.main,
    "&.Mui-completed": {
      color: theme.palette.success.main,
    },
  },
}));

const CheckoutPopup = ({ open, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // States
  const [activeStep, setActiveStep] = useState(0);
  const [orderData, setOrderData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Selectors
  const { isAuthenticated, userType } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);

  // Form handling
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      phoneNumber: "",
      shippingAddress: "",
    },
  });

  const steps = ["Order Details", "Review & Confirm", "Complete"];

  // Check authentication on mount and when popup opens
  useEffect(() => {
    if (open) {
      if (!isAuthenticated) {
        setSnackbar({
          open: true,
          message: "Please log in to place an order",
          severity: "warning",
        });
        onClose();
        navigate("/login");
        return;
      }

      if (userType === "seller") {
        setSnackbar({
          open: true,
          message: "Sellers cannot place orders",
          severity: "error",
        });
        onClose();
        return;
      }

      // Check if cart is empty
      if (cartItems.length === 0) {
        setSnackbar({
          open: true,
          message: "Your cart is empty",
          severity: "info",
        });
        onClose();
        return;
      }
    }
  }, [open, isAuthenticated, userType, navigate, onClose, cartItems]);

  // Calculate total amount
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Handle form submission
  const onSubmit = (data) => {
    if (!isAuthenticated || userType === "seller") return;

    const orderProducts = cartItems.map((item) => ({
      product: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    setOrderData({
      ...data,
      products: orderProducts,
      totalAmount: calculateTotal(),
    });
    setActiveStep(1);
  };

  // Handle order confirmation
  const handleOrderConfirmation = async () => {
    if (!isAuthenticated || userType === "seller") return;

    setIsSubmitting(true);
    try {
      await dispatch(createNewOrder(orderData)).unwrap();
      await dispatch(clearCart());
      setActiveStep(2);
      reset();
      setSnackbar({
        open: true,
        message: "Order placed successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to create order: ${error.message}`,
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle dialog close
  const handleClose = (event, reason) => {
    if (reason === "backdropClick" && activeStep !== 2) {
      return;
    }
    onClose();
  };

  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Render order details form
  const renderOrderForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      <Stack spacing={3}>
        <FormTextField
          label="Full Name"
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
          })}
          error={!!errors.name}
          helperText={errors.name?.message}
          InputProps={{
            startAdornment: (
              <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
            ),
          }}
        />

        <FormTextField
          label="Phone Number"
          {...register("phoneNumber", {
            required: "Phone number is required",
            pattern: {
              value: /^[0-9]{11}$/,
              message: "Please enter a valid phone number (e.g., 03xxxxxxxxx)",
            },
          })}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber?.message}
          InputProps={{
            startAdornment: (
              <PhoneIcon sx={{ mr: 1, color: "text.secondary" }} />
            ),
          }}
        />

        <FormTextField
          label="Shipping Address"
          multiline
          rows={3}
          {...register("shippingAddress", {
            required: "Shipping address is required",
            minLength: {
              value: 10,
              message: "Please enter a complete address",
            },
          })}
          error={!!errors.shippingAddress}
          helperText={errors.shippingAddress?.message}
          InputProps={{
            startAdornment: (
              <LocationOnIcon sx={{ mr: 1, mt: 1, color: "text.secondary" }} />
            ),
          }}
        />

        <ActionButton
          type="submit"
          variant="contained"
          disabled={!isValid}
          endIcon={<ArrowForwardIcon />}
        >
          Continue to Review
        </ActionButton>
      </Stack>
    </form>
  );

  // Render order review
  const renderOrderReview = () => (
    <Stack spacing={3} width="100%">
      <OrderSummaryCard>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Stack spacing={3}>
          {/* Delivery Details */}
          <Box>
            <Typography color="text.secondary" gutterBottom>
              Delivery Details
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body1">
                <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                {orderData.name}
              </Typography>
              <Typography variant="body1">
                <PhoneIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                {orderData.phoneNumber}
              </Typography>
              <Typography variant="body1">
                <LocationOnIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                {orderData.shippingAddress}
              </Typography>
            </Stack>
          </Box>

          {/* Order Items */}
          <Box>
            <Typography color="text.secondary" gutterBottom>
              Items
            </Typography>
            <Stack spacing={1}>
              {orderData.products.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography>
                    <ShoppingCartIcon
                      sx={{
                        mr: 1,
                        verticalAlign: "middle",
                        fontSize: "0.9rem",
                      }}
                    />
                    {item.name}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Typography color="text.secondary">
                      x{item.quantity}
                    </Typography>
                    <Typography fontWeight={500}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Total */}
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Total Amount</Typography>
              <Typography variant="h6" color="primary" fontWeight={600}>
                ${orderData.totalAmount.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </OrderSummaryCard>

      <ActionButton
        variant="contained"
        onClick={handleOrderConfirmation}
        disabled={isSubmitting}
        endIcon={
          isSubmitting ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <CheckCircleOutlineIcon />
          )
        }
      >
        {isSubmitting ? "Processing..." : "Confirm Order"}
      </ActionButton>
    </Stack>
  );

  // Render order completion
  const renderOrderComplete = () => (
    <Stack spacing={4} alignItems="center" py={4}>
      <CheckCircleOutlineIcon
        sx={{
          fontSize: 64,
          color: theme.palette.success.main,
          animation: "pop 0.5s ease-out",
          "@keyframes pop": {
            "0%": { transform: "scale(0)" },
            "70%": { transform: "scale(1.2)" },
            "100%": { transform: "scale(1)" },
          },
        }}
      />

      <Stack spacing={1} textAlign="center">
        <Typography variant="h5" fontWeight={600}>
          Thank You for Your Order!
        </Typography>
        <Typography color="text.secondary">
          Your order has been successfully placed. You will receive a
          confirmation email shortly.
        </Typography>
      </Stack>

      <Box sx={{ display: "flex", gap: 2 }}>
        <ActionButton
          variant="outlined"
          onClick={() => navigate("/orders")}
          startIcon={<ShoppingCartIcon />}
        >
          View Orders
        </ActionButton>
        <ActionButton
          variant="contained"
          onClick={onClose}
          startIcon={<CloseIcon />}
        >
          Close
        </ActionButton>
      </Box>
    </Stack>
  );

  // Render step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderOrderForm();
      case 1:
        return renderOrderReview();
      case 2:
        return renderOrderComplete();
      default:
        return null;
    }
  };

  return (
    <>
      <StyledDialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown={activeStep !== 2}
      >
        <Box sx={{ position: "relative", p: { xs: 2, sm: 3 } }}>
          {/* Close button */}
          {activeStep === 2 && (
            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: theme.palette.text.secondary,
                "&:hover": {
                  color: theme.palette.text.primary,
                  transform: "rotate(90deg)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <CloseIcon />
            </IconButton>
          )}

          {/* Progress Stepper */}
          <Stepper
            activeStep={activeStep}
            sx={{
              mb: 4,
              "& .MuiStepLabel-label": {
                fontSize: "0.875rem",
                [theme.breakpoints.down("sm")]: {
                  fontSize: "0.75rem",
                },
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StyledStepLabel>{label}</StyledStepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Main Content */}
          <DialogContent
            sx={{
              p: 0,
              "&.MuiDialogContent-root": {
                overflowY: "visible",
              },
            }}
          >
            {renderStepContent()}
          </DialogContent>

          {/* Shipping Info */}
          {activeStep === 0 && (
            <Box
              sx={{
                mt: 3,
                pt: 3,
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <LocalShippingIcon fontSize="small" />
                Free shipping on orders over $50
              </Typography>
            </Box>
          )}
        </Box>
      </StyledDialog>

      {/* Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.15)}`,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CheckoutPopup;
