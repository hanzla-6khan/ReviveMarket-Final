import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import {
  createNewProduct,
  updateExistingProduct,
  deleteExistingProduct,
  getSellerProducts,
} from "./productSlice";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  IconButton,
  TablePagination,
  Tooltip,
  Button,
  Card,
  Divider,
  useTheme,
  alpha,
  Stack,
  Chip,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory2 as InventoryIcon,
} from "@mui/icons-material";
import ProductForm from "./ProductForm";

// Styled components with responsive designs
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

const CategoryChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  fontWeight: 500,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(0.5),
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.75rem",
  },
}));

const ConditionChip = styled(Chip)(({ theme, condition }) => ({
  backgroundColor: alpha(
    condition === "New"
      ? theme.palette.success.main
      : theme.palette.warning.main,
    0.1
  ),
  color:
    condition === "New"
      ? theme.palette.success.main
      : theme.palette.warning.main,
  fontWeight: 500,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(0.5),
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.75rem",
  },
}));

// Mobile Card View Component
const MobileProductCard = ({ product, onEdit, onDelete }) => {
  const theme = useTheme();

  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="subtitle1" fontWeight={600}>
          {product.name}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <CategoryChip label={product.category} />
          <Typography fontWeight={600}>${product.price}</Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <ConditionChip
            label={product.condition}
            condition={product.condition}
          />
          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              onClick={() => onEdit(product)}
              sx={{
                color: theme.palette.primary.main,
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(product)}
              sx={{
                color: theme.palette.error.main,
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};

// Delete Confirmation Dialog Component
const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  productName,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete the product "{productName}"?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ProductList = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { products, isLoading, error } = useSelector((state) => state.products);

  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    dispatch(getSellerProducts());
  }, [dispatch]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await dispatch(
          deleteExistingProduct({ productId: productToDelete._id })
        );
        await dispatch(getSellerProducts());
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingProduct) {
        await dispatch(
          updateExistingProduct({
            productId: editingProduct._id,
            productData: data,
          })
        );
      } else {
        await dispatch(createNewProduct({ productData: data }));
      }
      await dispatch(getSellerProducts());
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const formatPrice = (price) => {
    return typeof price === "number" ? price.toFixed(2) : "0.00";
  };

  return (
    <Box
      sx={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Stack spacing={4}>
        {/* Responsive Header */}
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
            <InventoryIcon
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
                Products
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your product inventory
              </Typography>
            </Stack>
          </Stack>
          <Button
            fullWidth={isMobile}
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            sx={{
              backgroundColor: theme.palette.success.main,
              "&:hover": {
                backgroundColor: theme.palette.success.dark,
                transform: "translateY(-1px)",
              },
              borderRadius: 3,
              textTransform: "none",
              px: { xs: 2, sm: 4 },
              py: 1.5,
              transition: "all 0.2s",
              boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.4)}`,
            }}
          >
            Create Product
          </Button>
        </Box>

        {/* Loading State */}
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 8,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
            }}
          >
            <CircularProgress size={40} />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Box sx={{ p: 2, bgcolor: "error.light", borderRadius: 2 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {/* Responsive Product List */}
        {!isLoading && !error && products.length > 0 && (
          <StyledCard>
            {isMobile ? (
              // Mobile View
              <Box sx={{ p: 2 }}>
                {products
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product) => (
                    <MobileProductCard
                      key={product._id}
                      product={{
                        ...product,
                        price: formatPrice(product.price),
                      }}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
              </Box>
            ) : (
              // Desktop View
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <HeaderCell>Product Name</HeaderCell>
                      <HeaderCell>Description</HeaderCell>
                      <HeaderCell>Category</HeaderCell>
                      <HeaderCell align="right">Price</HeaderCell>
                      <HeaderCell>Condition</HeaderCell>
                      <HeaderCell align="center">Actions</HeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((product) => (
                        <StyledTableRow key={product._id}>
                          <TableCell>
                            <Typography fontWeight={500}>
                              {product.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                color: theme.palette.text.secondary,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {product.description}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <CategoryChip label={product.category} />
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight={600}>
                              {formatPrice(product.price)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <ConditionChip
                              label={product.condition}
                              condition={product.condition}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Stack
                              direction="row"
                              spacing={1}
                              justifyContent="center"
                            >
                              <Tooltip title="Edit" arrow>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEdit(product)}
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
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete" arrow>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(product)}
                                  sx={{
                                    color: theme.palette.error.main,
                                    "&:hover": {
                                      backgroundColor: alpha(
                                        theme.palette.error.main,
                                        0.1
                                      ),
                                    },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <Divider />
            <Box sx={{ py: 2, px: 2 }}>
              <TablePagination
                component="div"
                count={products.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  ".MuiTablePagination-select": {
                    borderRadius: 1,
                  },
                }}
              />
            </Box>
          </StyledCard>
        )}

        {/* Product Form Dialog */}
        <ProductForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={editingProduct}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          productName={productToDelete?.name}
        />

        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
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
            <InventoryIcon
              sx={{
                fontSize: 48,
                color: theme.palette.text.secondary,
              }}
            />
            <Typography variant="h6" color="text.secondary">
              No products found
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              sx={{
                mt: 2,
                backgroundColor: theme.palette.success.main,
                "&:hover": {
                  backgroundColor: theme.palette.success.dark,
                },
              }}
            >
              Add your first product
            </Button>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default ProductList;
