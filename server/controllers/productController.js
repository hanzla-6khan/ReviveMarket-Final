const Product = require("../models/productModel");
const createError = require("../utils/appError");

// Create Product
exports.createProduct = async (req, res, next) => {
  try {
    // Check if all required fields are provided
    const { name, description, price, category, condition, image } = req.body;
    if (!name || !price || !category) {
      return next(
        new createError("Name, Price, and Category are required", 400)
      );
    }

    // Create a new product
    const newProduct = await Product.create({
      name,
      description,
      price,
      image,
      category,
      condition,
      seller: req.user.id,
    });

    res.status(201).json({
      status: "success",
      product: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Products
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      status: "success",
      results: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// Get Seller's Products
exports.getSellerProducts = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const products = await Product.find({ seller: userID });

    res.status(200).json({
      status: "success",
      results: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// Get Featured Products
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true });

    res.status(200).json({
      status: "success",
      results: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Product
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new createError("Product not found", 404));
    }

    res.status(200).json({
      status: "success",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// Update Product
exports.updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return next(new createError("Product not found", 404));
    }

    res.status(200).json({
      status: "success",
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Product
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return next(new createError("Product not found", 404));
    }

    res.status(202).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// **Mark Product as Featured**
exports.markAsFeatured = async (req, res, next) => {
  try {
    // Find the product by ID
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new createError("Product not found", 404));
    }

    // Toggle the `isFeatured` status
    product.isFeatured = !product.isFeatured;

    // Save the updated product
    await product.save();

    res.status(200).json({
      status: "success",
      message: `Product ${
        product.isFeatured ? "marked" : "unmarked"
      } as featured successfully`,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// **Apply Discount and Coupon**
exports.applyDiscount = async (req, res, next) => {
  try {
    const { discount, couponCode } = req.body;

    // Validate discount
    if (discount < 0 || discount > 100) {
      return next(new createError("Discount must be between 0 and 100", 400));
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { discount, couponCode },
      { new: true }
    );

    if (!product) {
      return next(new createError("Product not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Discount and coupon applied successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// **Set Limited-Time Offer**
exports.setLimitedTimeOffer = async (req, res, next) => {
  try {
    const { start, end } = req.body;

    // Validate dates
    if (new Date(start) >= new Date(end)) {
      return next(new createError("Start date must be before end date", 400));
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { limitedTimeOffer: { start, end } },
      { new: true }
    );

    if (!product) {
      return next(new createError("Product not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Limited-time offer set successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// **Generate Social Media Links**
exports.generateSocialMediaLinks = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new createError("Product not found", 404));
    }

    const baseUrl = `https://yourstore.com/product/${product._id}`;
    const links = [
      {
        platform: "facebook",
        link: `https://facebook.com/share?u=${baseUrl}`,
      },
      {
        platform: "twitter",
        link: `https://twitter.com/share?u=${baseUrl}`,
      },
      {
        platform: "whatsapp",
        link: `https://wa.me/?text=${baseUrl}`,
      },
    ];

    res.status(200).json({
      status: "success",
      message: "Social media links generated successfully",
      links,
    });
  } catch (error) {
    next(error);
  }
};
