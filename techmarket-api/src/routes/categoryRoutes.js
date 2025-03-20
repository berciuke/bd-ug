const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  getCategory,
  getCategoryProducts,
  createCategory,
  updateCategory,
  removeCategory,
} = require("../controllers/categoryController");

router.get("/", getAllCategories);
router.get("/:id", getCategory);
router.get("/:id/products", getCategoryProducts);
router.post("/", createCategory);
router.patch("/:id", updateCategory);
router.delete("/:id", removeCategory);

module.exports = router;
