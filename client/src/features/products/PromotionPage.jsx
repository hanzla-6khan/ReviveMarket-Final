import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  useTheme,
  alpha,
  useMediaQuery,
  Switch,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  LocalOffer as LocalOfferIcon,
  Percent as PercentIcon,
  Timer as TimerIcon,
  Campaign as CampaignIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";
import {
  getSellerProducts,
  applyProductDiscount,
  setProductOffer,
  featureProduct,
} from "./productSlice";

// Existing styled components remain the same...
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
  overflow: "hidden",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  fontWeight: 600,
  fontSize: "0.875rem",
  borderBottom: `2px solid ${theme.palette.primary.main}`,
  padding: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
    fontSize: "0.75rem",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: alpha(theme.palette.primary.main, 0.02),
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
  transition: "background-color 0.2s",
}));

const PromotionChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
  color: theme.palette.secondary.main,
  fontWeight: 500,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(0.5),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1.5),
    transition: "all 0.2s",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.02),
    },
    "&.Mui-focused": {
      backgroundColor: "white",
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
}));

// New styled component for the feature switch
const FeatureSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: theme.palette.warning.main,
    "&:hover": {
      backgroundColor: alpha(theme.palette.warning.main, 0.08),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: theme.palette.warning.main,
  },
}));

const PromotionPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { products, isLoading, error } = useSelector((state) => state.products);

  // State management
  const [selectedProduct, setSelectedProduct] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch products on mount and after updates
  useEffect(() => {
    dispatch(getSellerProducts());
  }, [dispatch]);

  // Handle feature toggle
  const handleFeatureToggle = async (productId, currentStatus) => {
    console.log(productId, currentStatus);
    try {
      await dispatch(featureProduct({ productId })).unwrap();
      // Refresh the products data
      await dispatch(getSellerProducts());

      setSnackbar({
        open: true,
        message: `Product ${
          currentStatus ? "removed from" : "marked as"
        } featured successfully`,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update feature status: " + error.message,
        severity: "error",
      });
    }
  };

  // Handle discount application
  const handleApplyDiscount = async () => {
    if (!selectedProduct || discount <= 0) {
      setSnackbar({
        open: true,
        message: "Please select a product and provide a valid discount",
        severity: "error",
      });
      return;
    }

    try {
      await dispatch(
        applyProductDiscount({
          productId: selectedProduct,
          discount,
          couponCode,
        })
      ).unwrap();

      // Refresh products data
      await dispatch(getSellerProducts());

      setDiscount(0);
      setCouponCode("");
      setSnackbar({
        open: true,
        message: "Discount applied successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to apply discount: " + error.message,
        severity: "error",
      });
    }
  };

  // Handle time-limited offer
  const handleSetOffer = async () => {
    if (!selectedProduct || !startDate || !endDate) {
      setSnackbar({
        open: true,
        message: "Please select a product and provide valid dates",
        severity: "error",
      });
      return;
    }

    try {
      await dispatch(
        setProductOffer({
          productId: selectedProduct,
          start: startDate,
          end: endDate,
        })
      ).unwrap();

      // Refresh products data
      await dispatch(getSellerProducts());

      setStartDate("");
      setEndDate("");
      setSnackbar({
        open: true,
        message: "Time-limited offer set successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to set time-limited offer: " + error.message,
        severity: "error",
      });
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Rest of the JSX remains the same until the table...
  return (
    <Box
      sx={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: { xs: 2, sm: 3, md: 4 },
        backgroundColor: alpha(theme.palette.primary.main, 0.02),
        minHeight: "100vh",
      }}
    >
      {/* Previous header and form sections remain the same... */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <LocalOfferIcon
            sx={{
              fontSize: { xs: 32, sm: 40 },
              color: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              padding: 1,
              borderRadius: 2,
            }}
          />
          <Stack spacing={0.5}>
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
                fontWeight: 600,
                color: theme.palette.text.primary,
                lineHeight: 1.2,
              }}
            >
              Promotions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your product promotions and offers
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <Grid container spacing={2} mt={1}>
        {/* Left Column - Forms */}
        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            {/* Product Selection */}
            <StyledCard>
              <Box sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <CampaignIcon /> Select Product
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel>Choose a product</InputLabel>
                    <Select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      sx={{
                        borderRadius: 2,
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.02
                          ),
                        },
                      }}
                    >
                      {products.map((product) => (
                        <MenuItem key={product._id} value={product._id}>
                          {product.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Box>
            </StyledCard>

            {/* Discount Form */}
            <StyledCard>
              <Box sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <PercentIcon /> Apply Discount
                  </Typography>
                  <StyledTextField
                    fullWidth
                    label="Discount Percentage"
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    InputProps={{
                      endAdornment: <Typography>%</Typography>,
                    }}
                  />
                  <StyledTextField
                    fullWidth
                    label="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Optional"
                  />
                  <Button
                    variant="contained"
                    onClick={handleApplyDiscount}
                    sx={{
                      py: 1.5,
                      backgroundColor: theme.palette.success.main,
                      borderRadius: 3,
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: theme.palette.success.dark,
                        transform: "translateY(-1px)",
                      },
                      boxShadow: `0 4px 12px ${alpha(
                        theme.palette.success.main,
                        0.4
                      )}`,
                    }}
                  >
                    Apply Discount
                  </Button>
                </Stack>
              </Box>
            </StyledCard>

            {/* Time-Limited Offer */}
            <StyledCard>
              <Box sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <TimerIcon /> Limited-Time Offer
                  </Typography>
                  <StyledTextField
                    fullWidth
                    type="datetime-local"
                    label="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <StyledTextField
                    fullWidth
                    type="datetime-local"
                    label="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSetOffer}
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: "none",
                      "&:hover": {
                        transform: "translateY(-1px)",
                      },
                      boxShadow: `0 4px 12px ${alpha(
                        theme.palette.secondary.main,
                        0.4
                      )}`,
                    }}
                  >
                    Set Time-Limited Offer
                  </Button>
                </Stack>
              </Box>
            </StyledCard>
          </Stack>
        </Grid>
        {/* Updated Table Section */}
        <Grid item xs={12} md={7}>
          <StyledCard>
            <Box sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 3,
                }}
              >
                <LocalOfferIcon /> Active Promotions
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <HeaderCell>Product</HeaderCell>
                      <HeaderCell>Discount</HeaderCell>
                      <HeaderCell>Coupon Code</HeaderCell>
                      <HeaderCell>Valid Period</HeaderCell>
                      <HeaderCell align="center">Featured</HeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <StyledTableRow key={product._id}>
                        <TableCell>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            {product.featured && (
                              <StarIcon
                                sx={{ color: theme.palette.warning.main }}
                                fontSize="small"
                              />
                            )}
                            <Typography fontWeight={500}>
                              {product.name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          {product.discount ? (
                            <PromotionChip label={`${product.discount}% OFF`} />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No discount
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {product.couponCode ? (
                            <Chip
                              label={product.couponCode}
                              color="primary"
                              variant="outlined"
                              size="small"
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No coupon
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {product.limitedTimeOffer ? (
                            <Stack spacing={0.5}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                From:{" "}
                                {new Date(
                                  product.limitedTimeOffer.start
                                ).toLocaleString()}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                To:{" "}
                                {new Date(
                                  product.limitedTimeOffer.end
                                ).toLocaleString()}
                              </Typography>
                            </Stack>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No time limit
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip
                            title={`${
                              product.isFeatured ? "Remove from" : "Mark as"
                            } featured`}
                          >
                            {product.isFeatured}
                            <FeatureSwitch
                              checked={product.isFeatured}
                              onChange={() =>
                                handleFeatureToggle(
                                  product._id,
                                  product.isFeatured
                                )
                              }
                              icon={<StarBorderIcon />}
                              checkedIcon={<StarIcon />}
                            />
                          </Tooltip>
                        </TableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PromotionPage;
