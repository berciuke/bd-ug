const fs = require("fs");
const path = require("path");

let products = readProducts();

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
  try {
    products = readProducts();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Błąd podczas pobierania produktów",
        error: error.message,
      });
  }
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

module.exports = {
  downloadAllProducts,
  downloadProduct,
  addProduct,
  modifyProduct,
  deleteProduct,
};
