import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
  useTheme,
  alpha,
  styled,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "./cartSlice";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CheckoutPopup from "./CheckoutPopup";

// Custom styled components
const CartItem = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
  background: alpha(theme.palette.background.paper, 0.6),
  backdropFilter: "blur(10px)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 24px " + alpha(theme.palette.primary.main, 0.15),
  },
}));

const QuantityButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  borderRadius: theme.spacing(1),
  padding: theme.spacing(0.5),
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  },
}));

const CartDrawer = ({ open, onClose }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const [openPopup, setOpenPopup] = useState(false);

  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 450 },
          background: `linear-gradient(145deg, ${alpha(
            theme.palette.background.default,
            0.95
          )}, ${alpha(theme.palette.background.paper, 0.95)})`,
          backdropFilter: "blur(20px)",
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <ShoppingBagOutlinedIcon
              sx={{
                fontSize: 28,
                color: theme.palette.primary.main,
              }}
            />
            <Stack>
              <Typography variant="h6" fontWeight="600">
                Shopping Cart
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </Typography>
            </Stack>
          </Stack>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Cart Items */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: 3,
          }}
        >
          {items.length === 0 ? (
            <Stack
              spacing={2}
              alignItems="center"
              justifyContent="center"
              sx={{ height: "100%", opacity: 0.7 }}
            >
              <ShoppingBagOutlinedIcon sx={{ fontSize: 64 }} />
              <Typography variant="h6" color="text.secondary">
                Your cart is empty
              </Typography>
            </Stack>
          ) : (
            items.map((item) => (
              <CartItem key={item.id}>
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight="600"
                        gutterBottom
                      >
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        PKR{item.price} each
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => dispatch(removeFromCart(item.id))}
                      sx={{
                        opacity: 0.6,
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <QuantityButton
                        size="small"
                        onClick={() => dispatch(decreaseQuantity(item.id))}
                      >
                        <RemoveIcon fontSize="small" />
                      </QuantityButton>
                      <Typography
                        sx={{
                          minWidth: 32,
                          textAlign: "center",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {item.quantity}
                      </Typography>
                      <QuantityButton
                        size="small"
                        onClick={() => dispatch(increaseQuantity(item.id))}
                      >
                        <AddIcon fontSize="small" />
                      </QuantityButton>
                    </Stack>
                    <Typography
                      variant="subtitle1"
                      fontWeight="600"
                      sx={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      PKR{(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Stack>
                </Stack>
              </CartItem>
            ))
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 3,
            background: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: "blur(20px)",
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle1" color="text.secondary">
                Total Amount
              </Typography>
              <Typography variant="h5" fontWeight="600">
                PKR {totalAmount.toFixed(2)}
              </Typography>
            </Stack>
            <Button
              variant="contained"
              size="large"
              disabled={items.length === 0}
              onClick={() => setOpenPopup(true)}
              sx={{
                py: 2,
                borderRadius: 3,
                textTransform: "none",
                fontSize: "1.1rem",
                fontWeight: 600,
                boxShadow: `0 8px 24px ${alpha(
                  theme.palette.primary.main,
                  0.25
                )}`,
                "&:hover": {
                  boxShadow: `0 12px 32px ${alpha(
                    theme.palette.primary.main,
                    0.35
                  )}`,
                },
              }}
            >
              Checkout Now
            </Button>
            {items.length > 0 && (
              <Button
                color="inherit"
                onClick={() => dispatch(clearCart())}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                }}
              >
                Clear Cart
              </Button>
            )}
          </Stack>
        </Box>
      </Box>
      <CheckoutPopup open={openPopup} onClose={() => setOpenPopup(false)} />
    </Drawer>
  );
};

export default CartDrawer;
