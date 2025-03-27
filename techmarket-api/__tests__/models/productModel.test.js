const pool = require("../../config/db");
const Product = require("../../src/models/productModel");
const Category = require("../../src/models/categoryModel");

const clearProductTestData = async () => {
  await pool.query("DELETE FROM products WHERE name LIKE 'Test%'");
};

const clearCategoryTestData = async () => {
  await pool.query("DELETE FROM categories WHERE name LIKE 'Test%'");
};

describe("Model Produktu", () => {
  let testCategoryId;

  beforeAll(async () => {
    await clearProductTestData();
    await clearCategoryTestData();

    const category = await Category.create({
      name: "Testowa Kategoria Produktów",
      description: "Kategoria do testów produktów",
    });
    testCategoryId = category.id;
  });

  afterEach(async () => {
    await clearProductTestData();
  });

  afterAll(async () => {
    await clearProductTestData();
    await clearCategoryTestData();
    await pool.end();
  });

  it("powinien utworzyć produkt z poprawnymi danymi", async () => {
    const productData = {
      name: "Testowy Produkt",
      description: "Opis testowego produktu",
      price: 99.99,
      stock_quantity: 10,
      category_id: testCategoryId,
    };

    const product = await Product.create(productData);
    expect(product.id).toBeDefined();
    expect(product.name).toBe(productData.name);
    expect(product.description).toBe(productData.description);
    expect(parseFloat(product.price)).toBe(productData.price);
    expect(product.stock_quantity).toBe(productData.stock_quantity);
    expect(product.category_id).toBe(testCategoryId);
  });

  it("powinien zwrócić błąd przy próbie utworzenia produktu o istniejącej nazwie", async () => {
    const productData = {
      name: "Testowy Produkt Unikalny",
      description: "Opis testowego produktu",
      price: 99.99,
      stock_quantity: 10,
      category_id: testCategoryId,
    };

    await Product.create(productData);

    await expect(Product.create(productData)).rejects.toThrow();
  });

  it("powinien filtrować produkty po dostępności", async () => {
    await Product.create({
      name: "Testowy Produkt Dostępny",
      description: "Produkt na stanie",
      price: 99.99,
      stock_quantity: 10,
      category_id: testCategoryId,
    });

    await Product.create({
      name: "Testowy Produkt Niedostępny",
      description: "Produkt niedostępny",
      price: 199.99,
      stock_quantity: 0,
      category_id: testCategoryId,
    });

    const availableProducts = await Product.getAll({ available: "true" });
    const testAvailableProducts = availableProducts.filter((p) =>
      p.name.startsWith("Testowy Produkt")
    );

    expect(testAvailableProducts.length).toBe(1);
    expect(testAvailableProducts[0].name).toBe("Testowy Produkt Dostępny");
  });

  it("powinien zaktualizować produkt", async () => {
    const product = await Product.create({
      name: "Testowy Produkt do aktualizacji",
      description: "Stary opis produktu",
      price: 99.99,
      stock_quantity: 10,
      category_id: testCategoryId,
    });

    const updateData = {
      price: 149.99,
      stock_quantity: 20,
    };

    const updatedProduct = await Product.update(product.id, updateData);

    expect(updatedProduct.id).toBe(product.id);
    expect(updatedProduct.name).toBe(product.name);
    expect(parseFloat(updatedProduct.price)).toBe(updateData.price);
    expect(updatedProduct.stock_quantity).toBe(updateData.stock_quantity);
  });
});
