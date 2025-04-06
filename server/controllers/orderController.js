const Order = require("../models/orderModel");
const createError = require("../utils/appError");
const { generateOrderId } = require("../utils/generateOrderId");

// Create a new order
exports.createOrder = async (req, res, next) => {
  try {
    const { name, shippingAddress, phoneNumber, products, totalAmount } =
      req.body;

    if (!products || products.length === 0) {
      return next(
        new createError("Products are required to create an order", 400)
      );
    }

    // Generate the custom Order ID
    const customOrderId = await generateOrderId();

    // Create the order
    const newOrder = await Order.create({
      user: req.user._id,
      name,
      shippingAddress,
      phoneNumber,
      products,
      totalAmount,
      orderId: customOrderId,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    next(error);
  }
};

// get order by id
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "products.product"
    );

    if (!order) {
      return next(new createError("Order not found", 404));
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// Get all orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const orders = await Order.find({ user: userID }).populate(
      "products.product"
    );
    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// Get orders for a specific user
exports.getSellerOrders = async (req, res, next) => {
  try {
    const sellerId = req.user._id; // Get seller's ID from the authenticated user

    // Fetch orders and populate product details
    const orders = await Order.find().populate({
      path: "products.product",
      match: { seller: sellerId }, // Match only products where the seller matches
      select: "name price seller", // Select specific fields to return
    });

    // Filter orders where at least one product matches the seller
    const filteredOrders = orders.filter((order) =>
      order.products.some((item) => item.product !== null)
    );

    res.status(200).json({
      success: true,
      orders: filteredOrders,
    });
  } catch (error) {
    next(error);
  }
};

// Update order status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return next(new createError("Order status is required", 400));
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return next(new createError("Order not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// Delete an order (admin only)
exports.deleteOrder = async (req, res, next) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return next(new createError("Order not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
