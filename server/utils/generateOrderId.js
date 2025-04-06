const Order = require("../models/orderModel");

exports.generateOrderId = async () => {
  // Prefix for the order
  const prefix = "RM2180";

  // Fetch the latest order by creation time
  const latestOrder = await Order.findOne()
    .sort({ createdAt: -1 })
    .select("orderId");

  // Generate the next order number
  let nextNumber = 1;
  if (latestOrder && latestOrder.orderId) {
    const currentNumber = parseInt(latestOrder.orderId.split("-")[1], 10); // Extract the number part
    nextNumber = currentNumber + 1;
  }

  // Format the order ID (e.g., RM2180-0001)
  const orderNumber = String(nextNumber).padStart(4, "0");
  return `${prefix}-${orderNumber}`;
};
