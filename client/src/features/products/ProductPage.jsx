import React, { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
  Stack,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  LocalOffer as LocalOfferIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Chat as ChatIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "./productSlice";
import { addToCart } from "../cart/cartSlice";
import ChatPopup from "../message/ChatPopup";

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = React.useState(false);

  const { product } = useSelector((state) => state.products);
  const { isAuthenticated, userType } = useSelector((state) => state.auth);

  const handleMessageClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setChatOpen(true);
  };

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  const discountedPrice = product?.discount
    ? product?.price - product?.discount
    : product?.price;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        price: discountedPrice,
        image: product.image,
      })
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const placeholderImage = "https://via.placeholder.com/600x400";

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Left Column - Images */}
        <Grid item xs={12} md={7}>
          <Card
            elevation={0}
            sx={{
              backgroundColor: "grey.50",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <CardMedia
              component="img"
              height="500"
              image={product?.image || placeholderImage}
              alt={product?.name || "N/A"}
              sx={{ objectFit: "cover" }}
            />
          </Card>
        </Grid>

        {/* Right Column - Product Details */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, height: "100%" }}>
            <Stack spacing={3}>
              {/* Header */}
              <Box>
                <Typography variant="overline" color="primary">
                  {product?.category}
                </Typography>
                <Typography variant="h4" component="h1" gutterBottom>
                  {product?.name}
                </Typography>
                <Chip
                  icon={<CheckCircleIcon />}
                  label={product?.condition.toUpperCase() || "N/A"}
                  color="primary"
                  size="small"
                  sx={{ mr: 1 }}
                />
              </Box>
              {/* Price */}
              <Box>
                <Typography variant="h3" color="primary" gutterBottom>
                  PKR {product?.price.toLocaleString() || "N/A"}
                </Typography>
              </Box>
              {/* Description */}
              <Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {product?.description || "N/A"}
                </Typography>
              </Box>
              {/* Additional Info */}
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Listed On
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(product?.createdAt || "N/A")}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(product?.updatedAt || "N/A")}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Divider />
              {/* Action Buttons */}
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  fullWidth
                  onClick={handleAddToCart}
                  disabled={userType === "seller"}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ChatIcon />}
                  fullWidth
                  onClick={handleMessageClick}
                  disabled={userType === "seller"}
                >
                  Message Seller
                </Button>
              </Stack>
              {/* Add this at the bottom of your return statement */}
              <ChatPopup
                open={chatOpen}
                onClose={() => setChatOpen(false)}
                productId={id}
              />
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductPage;
