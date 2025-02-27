const products = require("../data/products");
// Pobieranie wszystkich produktów
addProduct({ test: "SRE" });
modifyProduct(5, {category: "Headphones", brand: "Huawei"});
deleteProduct(4)
console.log(downloadAllProducts());

function downloadAllProducts() {
  return products;
}
// Pobieranie pojedynczego produktu po ID
function downloadProduct(searchId) {
  return products.find(({ id }) => id == searchId);
}
// Dodawanie nowego produktu
function addProduct(product) {
  products.push(product);
}
// Aktualizacja produktu
function modifyProduct(productId, newObj) {
  const i = products.findIndex(({ id }) => id == productId);
  if (i > -1) {
    products[i] = { ...products[i], ...newObj };
  }
}
// Usuwanie produktu
function deleteProduct(productId) {
  const i = products.findIndex(({ id }) => id == productId);
  if (i > -1) {
    products[i] = {};
  }
}
