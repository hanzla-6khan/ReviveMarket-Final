import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeaturedProducts } from "./productSlice";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  useTheme,
  Container,
  Paper,
  Fade,
} from "@mui/material";
import {
  LocalOffer as LocalOfferIcon,
  Verified as VerifiedIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
} from "@mui/icons-material";

const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { featuredProducts, isLoading: loading } = useSelector(
    (state) => state.products || {}
  );

  useEffect(() => {
    dispatch(getFeaturedProducts());
  }, [dispatch]);

  const calculateDiscount = (price, discount) => {
    if (!discount) return price;
    return price - (price * discount) / 100;
  };

  const isLimitedTimeOffer = (product) => {
    if (!product?.limitedTimeOffer) return false;
    const now = new Date();
    const start = new Date(product.limitedTimeOffer.start);
    const end = new Date(product.limitedTimeOffer.end);
    return now >= start && now <= end;
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
          <Grid container spacing={4}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Skeleton
                  variant="rounded"
                  height={400}
                  sx={{
                    borderRadius: 4,
                    transform: "scale(0.98)",
                    transition: "transform 0.3s ease",
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        py: 10,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: `linear-gradient(180deg, ${theme.palette.primary.main}15 0%, transparent 100%)`,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Stack
          direction="column"
          alignItems="center"
          spacing={2}
          sx={{ mb: 8 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 1,
              px: 3,
              borderRadius: 8,
              bgcolor: theme.palette.primary.main + "10",
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <StarIcon
              sx={{ color: theme.palette.primary.main, fontSize: 20 }}
            />
            <Typography
              variant="subtitle2"
              sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
            >
              Sponsored Products
            </Typography>
          </Paper>

          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 800,
              color: theme.palette.text.primary,
              position: "relative",
              mb: 3,
            }}
          >
            Featured Products
          </Typography>

          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            sx={{ maxWidth: 600 }}
          >
            Discover our handpicked selection of premium products with exclusive
            offers
          </Typography>
        </Stack>

        {!featuredProducts || featuredProducts.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              bgcolor: theme.palette.background.paper + "80",
              backdropFilter: "blur(8px)",
            }}
          >
            <Typography variant="h6" align="center" color="text.secondary">
              No featured products available at the moment.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            {featuredProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Fade
                  in
                  timeout={500}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      borderRadius: 4,
                      backgroundColor: theme.palette.background.paper + "90",
                      backdropFilter: "blur(8px)",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-12px)",
                        boxShadow: `0 20px 40px ${theme.palette.primary.main}15`,
                        "& .product-image": {
                          transform: "scale(1.05)",
                        },
                      },
                    }}
                  >
                    <Box sx={{ position: "relative", overflow: "hidden" }}>
                      <CardMedia
                        component="div"
                        className="product-image"
                        image={product.image || "/placeholder.png"}
                        sx={{
                          height: 260,
                          bgcolor: theme.palette.grey[50],
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "16px 16px 0 0",
                          transition: "transform 0.3s ease-in-out",
                        }}
                      >
                        <Typography color="text.secondary">
                          {product.image ? "" : "No Image"}
                        </Typography>
                      </CardMedia>

                      {product.discount > 0 && (
                        <Chip
                          label={`${product.discount}% OFF`}
                          color="error"
                          size="small"
                          icon={<LocalOfferIcon sx={{ fontSize: 16 }} />}
                          sx={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            borderRadius: 3,
                            px: 1,
                            "& .MuiChip-label": {
                              px: 1,
                              fontWeight: 600,
                            },
                          }}
                        />
                      )}

                      {isLimitedTimeOffer(product) && (
                        <Tooltip title="Limited Time Offer">
                          <IconButton
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 16,
                              left: 16,
                              bgcolor: "background.paper",
                              boxShadow: theme.shadows[2],
                              "&:hover": {
                                bgcolor: "background.paper",
                              },
                            }}
                          >
                            <ScheduleIcon
                              color="warning"
                              sx={{ fontSize: 18 }}
                            />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 700,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          mb: 1,
                          lineHeight: 1.3,
                        }}
                      >
                        {product.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2.5,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          lineHeight: 1.6,
                        }}
                      >
                        {product.description}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="baseline"
                      >
                        <Typography
                          variant="h6"
                          color="primary.main"
                          fontWeight="800"
                        >
                          PKR{" "}
                          {calculateDiscount(
                            product.price,
                            product.discount
                          ).toFixed(2)}
                        </Typography>
                        {product.discount > 0 && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textDecoration: "line-through" }}
                          >
                            PKR {product.price.toFixed(2)}
                          </Typography>
                        )}
                      </Stack>

                      {product.couponCode && (
                        <Chip
                          label={`SAVE: ${product.couponCode}`}
                          size="small"
                          variant="outlined"
                          color="primary"
                          sx={{
                            mt: 2,
                            borderRadius: 2,
                            "& .MuiChip-label": {
                              px: 1,
                              fontWeight: 600,
                            },
                          }}
                        />
                      )}

                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Category:</strong> {product.category}
                        </Typography>
                      </Box>

                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Condition:</strong>{" "}
                          {product.condition === "new" ? (
                            <Chip
                              label="New"
                              icon={<VerifiedIcon sx={{ fontSize: 16 }} />}
                              size="small"
                              color="success"
                            />
                          ) : (
                            <Chip
                              label="Used"
                              icon={<VerifiedIcon sx={{ fontSize: 16 }} />}
                              size="small"
                              color="warning"
                            />
                          )}
                        </Typography>
                      </Box>

                      {/* buttons add to cart and view product */}
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default FeaturedProducts;
