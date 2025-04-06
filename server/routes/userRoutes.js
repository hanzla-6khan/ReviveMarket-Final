const express = require("express");
const userController = require("../controllers/userController");
const { verifyToken } = require("../middlewares/verifyToken");

const router = express.Router();

// Route to get all users
router.get("/all", verifyToken, userController.getAllUsers);

// Route to get a single user by ID
router.get("/", verifyToken, userController.getUser);

// Route to update a user's password
router.put("/update-password", verifyToken, userController.updatePassword);

// Route to update an existing user by ID
router.put("/:id", verifyToken, userController.updateUser);

// Route to delete a user by ID
router.delete("/:id", verifyToken, userController.deleteUser);

module.exports = router;
