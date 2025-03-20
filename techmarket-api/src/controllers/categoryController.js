const Category = require("../models/categoryModel");

async function getAllCategories(req, res) {
  try {
    const categories = await Category.getAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Błąd podczas pobierania kategorii",
      error: error.message,
    });
  }
}

async function getCategory(req, res) {
  try {
    const category = await Category.getById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ message: "Kategoria nie została znaleziona" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({
      message: "Błąd podczas pobierania kategorii",
      error: error.message,
    });
  }
}

async function getCategoryProducts(req, res) {
  try {
    const category = await Category.getById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ message: "Kategoria nie została znaleziona" });
    }

    const products = await Category.getProductsByCategory(req.params.id);
    res.status(200).json({
      category,
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Błąd podczas pobierania produktów z kategorii",
      error: error.message,
    });
  }
}

async function createCategory(req, res) {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        message: "Kategoria o takiej nazwie już istnieje",
        error: error.message,
      });
    }

    res.status(400).json({
      message: "Błąd podczas dodawania kategorii",
      error: error.message,
    });
  }
}

async function updateCategory(req, res) {
  try {
    const updatedCategory = await Category.update(req.params.id, req.body);
    if (!updatedCategory) {
      return res
        .status(404)
        .json({ message: "Kategoria nie została znaleziona" });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({
      message: "Błąd podczas aktualizacji kategorii",
      error: error.message,
    });
  }
}

async function removeCategory(req, res) {
  try {
    const deleted = await Category.delete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Kategoria nie została znaleziona" });
    }
    res.status(200).json({ message: "Kategoria została usunięta" });
  } catch (error) {
    res.status(500).json({
      message: "Błąd podczas usuwania kategorii",
      error: error.message,
    });
  }
}

module.exports = {
  getAllCategories,
  getCategory,
  getCategoryProducts,
  createCategory,
  updateCategory,
  removeCategory,
};
