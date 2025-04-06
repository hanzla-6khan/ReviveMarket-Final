import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { getMyOrders, getOrderById } from "./orderSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Box,
  Dialog,
  DialogContent,
  Card,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Tooltip,
  useTheme,
  TablePagination,
  Stack,
  alpha,
  useMediaQuery,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  ShoppingBag as ShoppingBagIcon,
} from "@mui/icons-material";
import Invoice from "./Invoice";

// Styled components
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

const SearchTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(2),
    transition: "all 0.2s",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.02),
    },
    "&.Mui-focused": {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
    },
  },
}));

// Mobile Order Card Component
const MobileOrderCard = ({ order, onView, statusConfig }) => {
  const theme = useTheme();

  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Order ID: {order.orderId}
          </Typography>
          <Typography fontWeight={600} color="primary">
            ${Number(order.totalAmount).toFixed(2)}
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {renderStatus(order.status, statusConfig, theme)}
          <IconButton
            size="small"
            onClick={() => onView(order._id)}
            sx={{ color: theme.palette.primary.main }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Box>
      </Stack>
    </Card>
  );
};

const renderStatus = (status, statusConfig, theme) => {
  const config = statusConfig[status] || {
    color: theme.palette.grey[500],
    backgroundColor: theme.palette.grey[100],
    icon: "❓",
  };
  return (
    <Chip
      label={`${config.icon} ${status}`}
      sx={{
        fontWeight: 500,
        minWidth: { xs: 100, sm: 120 },
        color: config.color,
        backgroundColor: config.backgroundColor,
        borderRadius: "16px",
        "& .MuiChip-label": {
          px: { xs: 1, sm: 2 },
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
        },
      }}
    />
  );
};

const UserOrders = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    userOrders: orders,
    isLoading,
    error,
    order,
  } = useSelector((state) => state.orders);

  // State management
  const [openView, setOpenView] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Effects
  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  useEffect(() => {
    const filtered = orders.filter((order) =>
      Object.values(order).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredOrders(filtered);
  }, [orders, searchTerm]);

  // Handlers
  const handleViewOrder = (orderId) => {
    dispatch(getOrderById(orderId));
    setOpenView(true);
  };

  const handleCloseView = () => setOpenView(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => {
    dispatch(getMyOrders());
  };

  // Status configurations
  const statusConfig = {
    pending: {
      color: theme.palette.warning.main,
      backgroundColor: alpha(theme.palette.warning.main, 0.1),
      icon: "🕒",
    },
    shipped: {
      color: theme.palette.primary.main,
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      icon: "🚚",
    },
    delivered: {
      color: theme.palette.success.main,
      backgroundColor: alpha(theme.palette.success.main, 0.1),
      icon: "✅",
    },
    cancelled: {
      color: theme.palette.error.main,
      backgroundColor: alpha(theme.palette.error.main, 0.1),
      icon: "❌",
    },
  };

  return (
    <Box
      sx={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Stack spacing={3}>
        {/* Header */}
        <Stack
          justifyContent="space-between"
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <ShoppingBagIcon
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
                My Orders
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                Track your order history
              </Typography>
            </Stack>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ width: { xs: "100%", sm: "auto" } }}
            alignItems="center"
          >
            <SearchTextField
              size="small"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: "100%", sm: 300 }, mb: { xs: 1, sm: 0 } }}
            />
            <Tooltip title="Refresh Orders">
              <IconButton
                onClick={handleRefresh}
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  borderRadius: 2,
                  alignSelf: { xs: "flex-start", sm: "center" },
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                <RefreshIcon color="primary" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* No Orders Message */}
        {!isLoading && !error && orders.length === 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              gap: 2,
            }}
          >
            <ShoppingBagIcon
              sx={{ fontSize: 48, color: theme.palette.text.secondary }}
            />
            <Typography variant="h6" color="text.secondary">
              No orders found
            </Typography>
          </Box>
        )}

        {/* Orders List */}
        {!isLoading && !error && orders.length > 0 && (
          <StyledCard>
            {isMobile ? (
              <Box sx={{ p: 2 }}>
                {filteredOrders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => (
                    <MobileOrderCard
                      key={order._id}
                      order={order}
                      onView={handleViewOrder}
                      statusConfig={statusConfig}
                    />
                  ))}
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <HeaderCell>Order ID</HeaderCell>
                      <HeaderCell>Status</HeaderCell>
                      <HeaderCell align="right">Total</HeaderCell>
                      <HeaderCell align="center">Actions</HeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredOrders
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((order) => (
                        <StyledTableRow key={order._id}>
                          <TableCell>
                            <Typography fontWeight={500}>
                              {order.orderId}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {renderStatus(order.status, statusConfig, theme)}
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight={600}>
                              ${Number(order.totalAmount).toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="View Details" arrow>
                              <IconButton
                                size="small"
                                onClick={() => handleViewOrder(order._id)}
                                sx={{
                                  color: theme.palette.primary.main,
                                  "&:hover": {
                                    backgroundColor: alpha(
                                      theme.palette.primary.main,
                                      0.1
                                    ),
                                  },
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            <Box sx={{ py: 2, px: 2 }}>
              <TablePagination
                component="div"
                count={filteredOrders.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  ".MuiTablePagination-select": {
                    borderRadius: 1,
                  },
                  ".MuiTablePagination-displayedRows": {
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  },
                }}
              />
            </Box>
          </StyledCard>
        )}

        {/* View Order Dialog */}
        <Dialog
          open={openView}
          onClose={handleCloseView}
          fullWidth
          maxWidth="md"
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)",
              margin: { xs: 2, sm: 4 },
              width: { xs: "calc(100% - 32px)", sm: "100%" },
            },
          }}
        >
          <DialogContent>
            {isLoading ? (
              <Box textAlign="center" my={3}>
                <CircularProgress />
              </Box>
            ) : (
              <Invoice order={order} onClose={handleCloseView} />
            )}
          </DialogContent>
        </Dialog>
      </Stack>
    </Box>
  );
};

export default UserOrders;
