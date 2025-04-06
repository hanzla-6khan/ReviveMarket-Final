import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/products",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Create a new product
export const createProduct = async (productData) => {
  const response = await api.post("/", productData);
  return response.data;
};

// Fetch all products
export const fetchProducts = async () => {
  const response = await api.get("/");
  return response.data;
};

// Fetch all products by a seller
export const fetchSellerProducts = async () => {
  const response = await api.get("/sellers");
  return response.data;
};

// Fetch all featured products
export const fetchFeaturedProducts = async () => {
  const response = await api.get("/featured");
  return response.data;
};

// Fetch a single product by ID
export const fetchProductById = async (productId) => {
  const response = await api.get(`/${productId}`);
  return response.data;
};

// Update a product
export const updateProduct = async (productId, productData) => {
  const response = await api.put(`/${productId}`, productData);
  return response.data;
};

// Delete a product
export const deleteProduct = async (productId) => {
  const response = await api.delete(`/${productId}`);
  return response.data;
};

// Apply Discount and Coupon Code
export const applyDiscount = async ({ productId, discount, couponCode }) => {
  const response = await api.put(`/${productId}/discount`, {
    discount,
    couponCode,
  });
  return response.data;
};

// Set Limited-Time Offer
export const setLimitedTimeOffer = async ({ productId, start, end }) => {
  const response = await api.put(`/${productId}/offer`, { start, end });
  return response.data;
};

// Mark Product as Featured
export const markAsFeatured = async (productId) => {
  const response = await api.put(`/${productId}/feature`);
  return response.data;
};
