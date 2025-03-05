const express = require("express");
const router = express.Router();
const {
  downloadAllProducts,
  downloadProduct,
  addProduct,
  modifyProduct,
  deleteProduct,
} = require("../controllers/productController");

router.get("/", (req, res) => {
  try {
    const products = downloadAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Błąd podczas pobierania produktów",
        error: error.message,
      });
  }
});

router.get("/:id", (req, res) => {
  try {
    const product = downloadProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produkt nie został znaleziony" });
    }
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Błąd podczas pobierania produktu",
        error: error.message,
      });
  }
});

router.post("/", (req, res) => {
  try {
    const products = downloadAllProducts();
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
      ...req.body,
      createdAt: new Date().toISOString(),

    };
    
    addProduct(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    res
      .status(400)
      .json({
        message: "Błąd podczas dodawania produktu",
        error: error.message,
      });
  }
});

router.put("/:id", (req, res) => {
  try {
    const product = downloadProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produkt nie został znaleziony" });
    }

    modifyProduct(req.params.id, req.body);
    const updatedProduct = downloadProduct(req.params.id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res
      .status(400)
      .json({
        message: "Błąd podczas aktualizacji produktu",
        error: error.message,
      });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const product = downloadProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produkt nie został znaleziony" });
    }

    deleteProduct(req.params.id);
    res.status(200).json({ message: "Produkt został usunięty" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Błąd podczas usuwania produktu",
        error: error.message,
      });
  }
});

module.exports = router;