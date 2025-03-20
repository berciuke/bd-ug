const Review = require("../models/reviewModel");

async function getAllReviews(req, res) {
  try {
    const reviews = await Review.getAll();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      message: "Błąd podczas pobierania recenzji",
      error: error.message,
    });
  }
}

async function getReview(req, res) {
  try {
    const review = await Review.getById(req.params.id);
    if (!review) {
      return res
        .status(404)
        .json({ message: "Recenzja nie została znaleziona" });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({
      message: "Błąd podczas pobierania recenzji",
      error: error.message,
    });
  }
}

async function getProductReviews(req, res) {
  try {
    const reviews = await Review.getByProductId(req.params.productId);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      message: "Błąd podczas pobierania recenzji produktu",
      error: error.message,
    });
  }
}

async function createReview(req, res) {
  try {
    const reviewData = {
      product_id: req.body.product_id,
      user_id: req.body.user_id,
      rating: req.body.rating,
      comment: req.body.comment,
    };

    const newReview = await Review.create(reviewData);
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({
      message: "Błąd podczas dodawania recenzji",
      error: error.message,
    });
  }
}

async function updateReview(req, res) {
  try {
    const updatedReview = await Review.update(req.params.id, req.body);
    if (!updatedReview) {
      return res
        .status(404)
        .json({ message: "Recenzja nie została znaleziona" });
    }
    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(400).json({
      message: "Błąd podczas aktualizacji recenzji",
      error: error.message,
    });
  }
}

async function removeReview(req, res) {
  try {
    const deleted = await Review.delete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Recenzja nie została znaleziona" });
    }
    res.status(200).json({ message: "Recenzja została usunięta" });
  } catch (error) {
    res.status(500).json({
      message: "Błąd podczas usuwania recenzji",
      error: error.message,
    });
  }
}

module.exports = {
  getAllReviews,
  getReview,
  getProductReviews,
  createReview,
  updateReview,
  removeReview,
};
