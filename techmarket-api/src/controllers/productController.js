const fs = require("fs");
const path = require("path");

let products = readProducts();

// FUNKCJE LOKALNE, DO INGERACJI Z PLIKIEM
function readProducts() {
  const filePath = path.join(__dirname, "../data/products.json");
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

function writeProducts() {
  const filePath = path.join(__dirname, "../data/products.json");
  const productsFiltered = products.filter((o) => Object.keys(o).length > 0);
  fs.writeFileSync(filePath, JSON.stringify(productsFiltered, null, 2), "utf8");
}

function downloadAllProducts() {
  products = readProducts();
  return products;
}

function downloadProduct(searchId) {
  products = readProducts();
  return products.find(({ id }) => id == searchId);
}

function addProduct(product) {
  products = readProducts();
  products.push(product);
  writeProducts();
}

function modifyProduct(productId, newObj) {
  products = readProducts();
  const i = products.findIndex(({ id }) => id == productId);
  if (i > -1) {
    products[i] = { ...products[i], ...newObj };
    writeProducts();
  }
}

function deleteProduct(productId) {
  products = readProducts();
  const i = products.findIndex(({ id }) => id == productId);
  if (i > -1) {
    products[i] = {};
    writeProducts();
  }
}

// FUNKCJE EKSPORTOWANE DO API
function getAllProducts(req, res) {
  try {
    const products = downloadAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Błąd podczas pobierania produktów",
      error: error.message,
    });
  }
}

function getProduct(req, res) {
  try {
    const product = downloadProduct(req.params.id);
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

function createProduct(req, res) {
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
    res.status(400).json({
      message: "Błąd podczas dodawania produktu",
      error: error.message,
    });
  }
}

function updateProduct(req, res) {
  try {
    const product = downloadProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produkt nie został znaleziony" });
    }

    modifyProduct(req.params.id, req.body);
    const updatedProduct = downloadProduct(req.params.id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({
      message: "Błąd podczas aktualizacji produktu",
      error: error.message,
    });
  }
}

function removeProduct(req, res) {
  try {
    const product = downloadProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produkt nie został znaleziony" });
    }

    deleteProduct(req.params.id);
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
