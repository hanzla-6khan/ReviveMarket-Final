import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Container,
  Skeleton,
  useTheme,
  useMediaQuery,
  Stack,
  Paper,
  Fade,
  Chip,
  InputAdornment,
  TextField,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "./productSlice";
import ProductCard from "./ProductCard";
import StoreIcon from "@mui/icons-material/Store";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";

const AllProducts = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // State for filters
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState("default");

  // Get unique categories from products
  const categories = [
    "All",
    ...new Set(products?.map((product) => product.category) || []),
  ];

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // Filter and sort products
  const getFilteredProducts = () => {
    if (!products) return [];

    let filtered = [...products];

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return filtered;
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortSelect = (value) => {
    setSortBy(value);
    handleSortClose();
  };

  const filteredProducts = getFilteredProducts();

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        py: { xs: 6, md: 10 },
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "30%",
          background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, transparent 100%)`,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Stack
          direction="column"
          alignItems="center"
          spacing={2}
          sx={{ mb: { xs: 6, md: 8 } }}
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
            <StoreIcon
              sx={{ color: theme.palette.primary.main, fontSize: 20 }}
            />
            <Typography
              variant="subtitle2"
              sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
            >
              Browse All Products
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
            Our Products Collection
          </Typography>

          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            sx={{ maxWidth: 600 }}
          >
            Explore our wide range of products with great deals and exclusive
            offers
          </Typography>
        </Stack>

        {/* Search and Filter Section */}
        <Box sx={{ mb: 6 }}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              }}
            />

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{
                overflowX: "auto",
                pb: 2,
                px: 1,
                "&::-webkit-scrollbar": {
                  height: 6,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: theme.palette.primary.main + "20",
                  borderRadius: 3,
                },
              }}
            >
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  color={selectedCategory === category ? "primary" : "default"}
                  variant={
                    selectedCategory === category ? "filled" : "outlined"
                  }
                  onClick={() => setSelectedCategory(category)}
                  sx={{
                    px: 1,
                    "& .MuiChip-label": {
                      fontWeight: selectedCategory === category ? 600 : 500,
                    },
                  }}
                />
              ))}

              <IconButton
                onClick={handleSortClick}
                sx={{
                  ml: "auto !important",
                  bgcolor:
                    sortBy !== "default"
                      ? theme.palette.primary.main + "10"
                      : "transparent",
                }}
              >
                <SortIcon />
              </IconButton>

              <Menu
                anchorEl={sortAnchorEl}
                open={Boolean(sortAnchorEl)}
                onClose={handleSortClose}
              >
                <MenuItem onClick={() => handleSortSelect("default")}>
                  Default
                </MenuItem>
                <MenuItem onClick={() => handleSortSelect("price-asc")}>
                  Price: Low to High
                </MenuItem>
                <MenuItem onClick={() => handleSortSelect("price-desc")}>
                  Price: High to Low
                </MenuItem>
                <MenuItem onClick={() => handleSortSelect("name-asc")}>
                  Name: A to Z
                </MenuItem>
                <MenuItem onClick={() => handleSortSelect("name-desc")}>
                  Name: Z to A
                </MenuItem>
              </Menu>
            </Stack>
          </Stack>
        </Box>

        {/* Results Count */}
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
          Showing {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "product" : "products"}
        </Typography>

        <Grid container spacing={3}>
          {loading
            ? Array.from(new Array(6)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Fade
                    in
                    timeout={300}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <Skeleton
                      variant="rounded"
                      height={isMobile ? 300 : 400}
                      sx={{
                        borderRadius: 4,
                        transform: "scale(0.98)",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </Fade>
                </Grid>
              ))
            : filteredProducts.map((product, index) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <Fade
                    in
                    timeout={500}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <Box>
                      <ProductCard product={product} index={index} />
                    </Box>
                  </Fade>
                </Grid>
              ))}
        </Grid>

        {!loading && filteredProducts.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              bgcolor: theme.palette.background.paper + "80",
              backdropFilter: "blur(8px)",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No products found matching your criteria.
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default AllProducts;
