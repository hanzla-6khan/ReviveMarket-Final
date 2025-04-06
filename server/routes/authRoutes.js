const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", authController.signup);
router.post("/login", authController.login);
router.post("/loginWithGoogle", authController.loginWithGoogle);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch("/verifyEmail/:token", authController.verifyEmail);

module.exports = router;
