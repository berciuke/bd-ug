const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  removeProduct
} = require("../controllers/productController");
const { validateProductData } = require("../middleware/validationMiddleware");

router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.post("/", validateProductData(false), createProduct);
router.patch("/:id", validateProductData(true), updateProduct);
router.delete("/:id", removeProduct);

module.exports = router;
