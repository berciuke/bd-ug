const { getDb } = require("../config/mongo");
const { ObjectId } = require("mongodb");
const Joi = require("joi");
const reviewSchema = require("../models/reviewModel");

const addReview = async (req, res) => {
  const { error, value } = reviewSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: "Błąd walidacji", error: error.details });
  }
  const db = getDb();
  try {
    const result = await db.collection("reviews").insertOne(value);
    res
      .status(201)
      .json({ message: "Recenzja dodana", reviewId: result.insertedId });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Błąd podczas dodawania recenzji", error: err.message });
  }
};

const getReviews = async (req, res) => {
  const db = getDb();
  const { productId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Sortowanie – domyślnie według daty (najnowsze jako pierwsze)
  let sort = {};
  if (req.query.sortBy) {
    const order = req.query.order === "desc" ? -1 : 1;
    sort[req.query.sortBy] = order;
  } else {
    sort = { createdAt: -1 };
  }
  try {
    const reviews = await db
      .collection("reviews")
      .find({ productId: productId })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();
    res.status(200).json(reviews);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Błąd podczas pobierania recenzji",
        error: err.message,
      });
  }
};

const updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const { error, value } = reviewSchema.validate(req.body, {
    presence: "optional",
  });
  if (error) {
    return res
      .status(400)
      .json({ message: "Błąd walidacji", error: error.details });
  }
  const db = getDb();
  try {
    const result = await db
      .collection("reviews")
      .updateOne(
        { _id: new ObjectId(reviewId) },
        { $set: { ...value, updatedAt: new Date() } }
      );
    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: "Recenzja nie została znaleziona" });
    }
    res.status(200).json({ message: "Recenzja zaktualizowana" });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Błąd podczas aktualizacji recenzji",
        error: err.message,
      });
  }
};

const deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  const db = getDb();
  try {
    const result = await db
      .collection("reviews")
      .deleteOne({ _id: new ObjectId(reviewId) });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Recenzja nie została znaleziona" });
    }
    res.status(200).json({ message: "Recenzja usunięta" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Błąd podczas usuwania recenzji", error: err.message });
  }
};

const getReviewStats = async (req, res) => {
  const { productId } = req.params;
  const db = getDb();
  try {
    const stats = await db
      .collection("reviews")
      .aggregate([
        { $match: { productId: productId } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
            count: { $sum: 1 },
            ratings: { $push: "$rating" },
          },
        },
      ])
      .toArray();

    if (stats.length === 0) {
      return res.status(200).json({ averageRating: 0, distribution: {} });
    }
    // Obliczenie rozkładu ocen
    const distribution = {};
    stats[0].ratings.forEach((r) => {
      distribution[r] = (distribution[r] || 0) + 1;
    });
    res.status(200).json({
      averageRating: stats[0].averageRating,
      count: stats[0].count,
      distribution,
    });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Błąd podczas pobierania statystyk recenzji",
        error: err.message,
      });
  }
};

const searchReviews = async (req, res) => {
  const db = getDb();
  const { text, rating, verified } = req.query;
  const filter = {};

  if (text) {
    filter.$or = [
      { title: { $regex: text, $options: "i" } },
      { content: { $regex: text, $options: "i" } },
    ];
  }
  if (rating) {
    filter.rating = parseInt(rating);
  }
  if (verified !== undefined) {
    filter.verifiedPurchase = verified === "true";
  }

  let sort = {};
  if (req.query.sortBy) {
    const order = req.query.order === "desc" ? -1 : 1;
    sort[req.query.sortBy] = order;
  } else {
    sort = { createdAt: -1 };
  }
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const reviews = await db
      .collection("reviews")
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();
    res.status(200).json(reviews);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Błąd podczas wyszukiwania recenzji",
        error: err.message,
      });
  }
};

const voteHelpful = async (req, res) => {
  const reviewId = req.params.id;
  const db = getDb();
  try {
    const result = await db
      .collection("reviews")
      .updateOne(
        { _id: new ObjectId(reviewId) },
        { $inc: { helpfulVotes: 1 } }
      );
    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: "Recenzja nie została znaleziona" });
    }
    res.status(200).json({ message: "Głos został zarejestrowany" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Błąd podczas głosowania", error: err.message });
  }
};

module.exports = {
  addReview,
  getReviews,
  updateReview,
  deleteReview,
  getReviewStats,
  searchReviews,
  voteHelpful,
};
