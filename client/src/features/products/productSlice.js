import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createProduct,
  fetchProducts,
  fetchProductById,
  updateProduct,
  deleteProduct,
  applyDiscount,
  setLimitedTimeOffer,
  markAsFeatured,
  fetchSellerProducts,
  fetchFeaturedProducts,
} from "../../services/productService";

// Async Thunks

// Fetch all products
export const fetchAllProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const products = await fetchProducts();
      return products;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const getSellerProducts = createAsyncThunk(
  "products/fetchSellerProducts",
  async (_, { rejectWithValue }) => {
    try {
      const products = await fetchSellerProducts();
      return products;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch seller products"
      );
    }
  }
);

// Fetch all featured products
export const getFeaturedProducts = createAsyncThunk(
  "products/fetchFeatured",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchFeaturedProducts();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch featured products"
      );
    }
  }
);

// Fetch a single product by ID
export const getProductById = createAsyncThunk(
  "products/fetchSingle",
  async (productId, { rejectWithValue }) => {
    try {
      const product = await fetchProductById(productId);
      return product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

// Create a new product
export const createNewProduct = createAsyncThunk(
  "products/create",
  async ({ productData }, { rejectWithValue }) => {
    try {
      const product = await createProduct(productData);
      return product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product"
      );
    }
  }
);

// Update a product
export const updateExistingProduct = createAsyncThunk(
  "products/update",
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const product = await updateProduct(productId, productData);
      return product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

// Delete a product
export const deleteExistingProduct = createAsyncThunk(
  "products/delete",
  async ({ productId }, { rejectWithValue }) => {
    console.log("Delete Product Thunk Hit");
    console.log("Product ID:", productId);
    try {
      const response = await deleteProduct(productId);
      return { productId, response }; // Returning productId to remove it from the state
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

// Apply Discount
export const applyProductDiscount = createAsyncThunk(
  "products/applyDiscount",
  async ({ productId, discount, couponCode }, { rejectWithValue }) => {
    try {
      const response = await applyDiscount({ productId, discount, couponCode });
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to apply discount"
      );
    }
  }
);

// Set Limited-Time Offer
export const setProductOffer = createAsyncThunk(
  "products/setOffer",
  async ({ productId, start, end }, { rejectWithValue }) => {
    try {
      const response = await setLimitedTimeOffer({ productId, start, end });
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to set offer"
      );
    }
  }
);

// Mark Product as Featured
export const featureProduct = createAsyncThunk(
  "products/featureProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await markAsFeatured(productId.productId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark product as featured"
      );
    }
  }
);

// Initial State
const initialState = {
  products: [],
  featuredProducts: [],
  product: null,
  isLoading: false,
  error: null,
};

// Product Slice
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductState: (state) => {
      state.product = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Products
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Seller Products
      .addCase(getSellerProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSellerProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
      })
      .addCase(getSellerProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Featured Products
      .addCase(getFeaturedProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredProducts = action.payload.products;
      })
      .addCase(getFeaturedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Fetch Single Product
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload.product;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create Product
      .addCase(createNewProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.push(action.payload); // Add new product to the list
      })
      .addCase(createNewProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Product
      .addCase(updateExistingProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateExistingProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedProductIndex = state.products.findIndex(
          (product) => product.id === action.payload.id
        );
        if (updatedProductIndex !== -1) {
          state.products[updatedProductIndex] = action.payload; // Update the product
        }
      })
      .addCase(updateExistingProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete Product
      .addCase(deleteExistingProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteExistingProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = state.products.filter(
          (product) => product.id !== action.payload.productId
        );
      })
      .addCase(deleteExistingProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Apply Discount
      .addCase(applyProductDiscount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(applyProductDiscount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
        const productIndex = state.products.findIndex(
          (product) => product.id === action.payload.product._id
        );
        if (productIndex !== -1) {
          state.products[productIndex] = action.payload.product;
        }
      })
      .addCase(applyProductDiscount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Set Limited-Time Offer
      .addCase(setProductOffer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setProductOffer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
        const productIndex = state.products.findIndex(
          (product) => product.id === action.payload.product._id
        );
        if (productIndex !== -1) {
          state.products[productIndex] = action.payload.product;
        }
      })
      .addCase(setProductOffer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Mark Product as Featured
      .addCase(featureProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(featureProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
        const productIndex = state.products.findIndex(
          (product) => product.id === action.payload.product._id
        );
        if (productIndex !== -1) {
          state.products[productIndex] = action.payload.product;
        }
      })
      .addCase(featureProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;
