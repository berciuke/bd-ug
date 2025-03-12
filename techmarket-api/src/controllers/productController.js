const Product = require('../models/productModel');

async function getAllProducts(req, res) {
  try {
    const filters = {
      available: req.query.available,
      sort: req.query.sort
    };

    const products = await Product.getAll(filters);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Błąd podczas pobierania produktów",
      error: error.message,
    });
  }
}

async function getProduct(req, res) {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produkt nie został znaleziony" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Błąd podczas pobierania produktu",
      error: error.message,
    });
  }
}

async function createProduct(req, res) {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    if (error.code === '23505') { 
      return res.status(400).json({
        message: "Produkt o takiej nazwie już istnieje",
        error: error.message,
      });
    }
    
    res.status(400).json({
      message: "Błąd podczas dodawania produktu",
      error: error.message,
    });
  }
}

async function updateProduct(req, res) {
  try {
    const updatedProduct = await Product.update(req.params.id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ message: "Produkt nie został znaleziony" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({
      message: "Błąd podczas aktualizacji produktu",
      error: error.message,
    });
  }
}

async function removeProduct(req, res) {
  try {
    const deleted = await Product.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Produkt nie został znaleziony" });
    }
    res.status(200).json({ message: "Produkt został usunięty" });
  } catch (error) {
    res.status(500).json({
      message: "Błąd podczas usuwania produktu",
      error: error.message,
    });
  }
}

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  removeProduct
};
