const express = require("express");
const orderController = require("../controllers/orderController");
const { verifyToken } = require("../middlewares/verifyToken");

const router = express.Router();

// seller Routes
router.post("/", verifyToken, orderController.createOrder);
router.get("/my-orders", verifyToken, orderController.getAllOrders);

router.get("/all", verifyToken, orderController.getSellerOrders);
router.get("/:id", verifyToken, orderController.getOrderById);

// Admin Routes
router.put("/:id", verifyToken, orderController.updateOrderStatus);
router.delete("/:id", verifyToken, orderController.deleteOrder);

module.exports = router;
