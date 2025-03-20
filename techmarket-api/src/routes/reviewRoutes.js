const express = require("express");
const router = express.Router();
const {
  getAllReviews,
  getReview,
  getProductReviews,
  createReview,
  updateReview,
  removeReview,
} = require("../controllers/reviewController");

router.get("/", getAllReviews);
router.get("/:id", getReview);
router.get("/product/:productId", getProductReviews);
router.post("/", createReview);
router.patch("/:id", updateReview);
router.delete("/:id", removeReview);

module.exports = router;
