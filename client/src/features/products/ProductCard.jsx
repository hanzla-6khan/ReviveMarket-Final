import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Chip,
  Rating,
  Fade,
  useTheme,
  Stack,
  IconButton,
  Tooltip,
  Skeleton,
  Divider,
  Collapse,
  Badge,
  Zoom,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TimerIcon from "@mui/icons-material/Timer";
import CategoryIcon from "@mui/icons-material/Category";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../cart/cartSlice";

const ProductCard = ({ product, index }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Get userType from auth slice
  const { userType } = useSelector((state) => state.auth);
  const isSeller = userType === "seller";

  const discountedPrice = product.discount
    ? product.price - product.discount
    : product.price;
  const discountPercentage = product.discount
    ? Math.round((product.discount / product.price) * 100)
    : 0;

  useEffect(() => {
    if (addedToCart) {
      const timer = setTimeout(() => setAddedToCart(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [addedToCart]);

  const calculateDiscount = (price, discount) => {
    if (!discount) return price;
    return price - (price * discount) / 100;
  };

  const getRemainingTime = () => {
    if (!product.limitedTimeOffer?.end) return null;
    const end = new Date(product.limitedTimeOffer.end);
    const now = new Date();
    const diff = end - now;
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${days}d ${hours}h ${minutes}m`;
  };

  const handleAddToCart = () => {
    if (isSeller) return;
    const price = calculateDiscount(product.price, product.discount);
    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        price,
        image: product.image,
      })
    );
    setAddedToCart(true);
  };

  return (
    <Fade in={true} style={{ transitionDelay: `${index * 50}ms` }}>
      <Card
        elevation={isHovered ? 8 : 1}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          height: "100%",
          borderRadius: 4,
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isHovered ? "translateY(-8px)" : "none",
          backgroundColor: theme.palette.background.paper,
          position: "relative",
          overflow: "visible",
          "&:hover": {
            boxShadow: `0 16px 32px -12px ${theme.palette.primary.main}40`,
          },
        }}
      >
        <Box sx={{ position: "relative" }}>
          {!imageLoaded && (
            <Skeleton
              variant="rectangular"
              height={300}
              animation="wave"
              sx={{ borderRadius: "16px 16px 0 0" }}
            />
          )}
          <CardMedia
            component="img"
            height={300}
            image={product.image || "/placeholder.jpg"}
            onLoad={() => setImageLoaded(true)}
            sx={{
              transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: isHovered ? "scale(1.02)" : "scale(1)",
              display: imageLoaded ? "block" : "none",
              borderRadius: "16px 16px 0 0",
              filter: isHovered ? "brightness(1.1)" : "brightness(1)",
            }}
          />

          <Zoom in={product.discount > 0}>
            <Box
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                color: "white",
                borderRadius: "24px",
                px: 2,
                py: 1,
                fontWeight: "bold",
                boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                transform: isHovered ? "scale(1.05)" : "scale(1)",
                transition: "all 0.3s ease",
              }}
            >
              -{product.discount}% off
            </Box>
          </Zoom>
        </Box>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  height: "3em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {product.name}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setShowDetails(!showDetails)}
                sx={{
                  ml: 1,
                  transform: showDetails ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              >
                <InfoOutlinedIcon />
              </IconButton>
            </Box>

            <Collapse in={showDetails}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {product.description}
              </Typography>
            </Collapse>

            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              <Chip
                icon={<CategoryIcon sx={{ fontSize: "1rem" }} />}
                label={product.category}
                size="small"
                sx={{
                  bgcolor: `${theme.palette.primary.main}15`,
                  "& .MuiChip-label": { fontWeight: 500 },
                }}
              />
              {getRemainingTime() && (
                <Chip
                  icon={<TimerIcon sx={{ fontSize: "1rem" }} />}
                  label={getRemainingTime()}
                  color="warning"
                  size="small"
                  sx={{
                    "& .MuiChip-label": { fontWeight: 500 },
                    animation: "pulse 2s infinite",
                    "@keyframes pulse": {
                      "0%": { transform: "scale(1)" },
                      "50%": { transform: "scale(1.05)" },
                      "100%": { transform: "scale(1)" },
                    },
                  }}
                />
              )}
              <Chip
                icon={<InventoryIcon sx={{ fontSize: "1rem" }} />}
                label={`Stock: ${product.stock || "Available"}`}
                size="small"
                color={product.stock > 10 ? "success" : "warning"}
                sx={{ "& .MuiChip-label": { fontWeight: 500 } }}
              />
            </Stack>

            {/* <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Rating
                value={product.rating || 4}
                precision={0.5}
                readOnly
                size="small"
                sx={{ color: theme.palette.warning.main }}
              />
              <Typography variant="body2" color="text.secondary">
                ({product.rating || 4.0})
              </Typography>
            </Box> */}
            {/* <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Rating
                value={product.rating || 4}
                precision={0.5}
                readOnly
                size="small"
                sx={{ color: theme.palette.warning.main }}
              />
              <Typography variant="body2" color="text.secondary">
                ({product.rating || 4.0})
              </Typography>
            </Box> */}

            <Stack direction="row" alignItems="baseline" spacing={1}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                PKR{" "}
                {calculateDiscount(product.price, product.discount).toFixed(2)}
              </Typography>
              {product.discount > 0 && (
                <Typography
                  variant="body1"
                  sx={{
                    textDecoration: "line-through",
                    color: "red",
                    opacity: 0.7,
                  }}
                >
                  PKR {product.price.toFixed(2)}
                </Typography>
              )}
            </Stack>

            <Tooltip
              title="Free shipping on orders over 2000"
              arrow
              placement="top"
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: theme.palette.success.main,
                  cursor: "pointer",
                }}
              >
                <LocalShippingIcon sx={{ fontSize: "1rem" }} />
                <Typography variant="body2" fontWeight={500}>
                  Free Shipping
                </Typography>
              </Box>
            </Tooltip>
          </Stack>
        </CardContent>
        <Divider sx={{ mx: 3, opacity: 0.7 }} />{" "}
        <CardActions sx={{ p: 3, pt: 2 }}>
          <Stack direction="row" spacing={1} width="100%">
            {!isSeller && (
              <Button
                variant="contained"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={addedToCart}
                sx={{
                  flex: 2,
                  background: addedToCart
                    ? theme.palette.success.main
                    : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  color: "white",
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 16px -4px ${theme.palette.primary.main}40`,
                  },
                }}
              >
                {addedToCart ? "Added!" : "Add to Cart"}
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={() => navigate(`/product/${product._id}`)}
              sx={{
                flex: isSeller ? 1 : 1,
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  borderColor: theme.palette.primary.dark,
                  bgcolor: `${theme.palette.primary.main}10`,
                  transform: "translateY(-2px)",
                },
              }}
            >
              Details
            </Button>
          </Stack>
        </CardActions>
      </Card>
    </Fade>
  );
};

export default ProductCard;
