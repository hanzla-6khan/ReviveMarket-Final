const express = require("express");
const productController = require("../controllers/productController");
const { verifyToken } = require("../middlewares/verifyToken");

const router = express.Router();

router
  .route("/")
  .post(verifyToken, productController.createProduct)
  .get(productController.getProducts);

router.route("/sellers").get(verifyToken, productController.getSellerProducts);
router.route("/featured").get(productController.getFeaturedProducts);

router
  .route("/:id")
  .get(productController.getProduct)
  .put(verifyToken, productController.updateProduct)
  .delete(verifyToken, productController.deleteProduct);

router.route("/:id/feature").put(verifyToken, productController.markAsFeatured);

router.route("/:id/discount").put(verifyToken, productController.applyDiscount);

router
  .route("/:id/offer")
  .put(verifyToken, productController.setLimitedTimeOffer);

router.route("/:id/share").get(productController.generateSocialMediaLinks);

module.exports = router;
