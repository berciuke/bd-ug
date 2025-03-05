const fs = require("fs");
const path = require("path");

let products = readProducts();


function readProducts() {
  return require("../data/products.js");
}

function writeProducts() {
  const filePath = path.join(__dirname, "../data/products.js");
  const productsFiltered = products.filter((o) => Object.keys(o).length > 0);
  const content = `const products = ${JSON.stringify(
    productsFiltered,
    null,
    2
  )};\n\nmodule.exports = products;`;
  fs.writeFileSync(filePath, content, "utf8");
}

function downloadAllProducts() {
  products = readProducts()
  return products;
}
function downloadProduct(searchId) {
  products = readProducts()
  return products.find(({ id }) => id == searchId);
}

function addProduct(product) {
  products = readProducts()
  products.push(product);
  writeProducts();
}

function modifyProduct(productId, newObj) {
  products = readProducts()
  const i = products.findIndex(({ id }) => id == productId);
  if (i > -1) {
    products[i] = { ...products[i], ...newObj };
    writeProducts()
  }
}

function deleteProduct(productId) {
  products = readProducts()
  const i = products.findIndex(({ id }) => id == productId);
  if (i > -1) {
    products[i] = {};
    writeProducts()
  }
}

module.exports = {
  downloadAllProducts,
  downloadProduct,
  addProduct,
  modifyProduct,
  deleteProduct,
};
