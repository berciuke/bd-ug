const pool = require("../../config/db");
const Category = require("../../src/models/categoryModel");
const { clearTestData } = require("../testUtils");

describe("Model Kategorii", () => {
  beforeEach(async () => {
    await clearTestData();
  });

  afterAll(async () => {
    await clearTestData();
    await pool.end();
  });

  it("powinien utworzyć kategorię z poprawnymi danymi", async () => {
    const categoryData = {
      name: "Testowa Kategoria",
      description: "Opis testowej kategorii",
    };

    const category = await Category.create(categoryData);
    expect(category.id).toBeDefined();
    expect(category.name).toBe(categoryData.name);
    expect(category.description).toBe(categoryData.description);
  });

  it("powinien zwrócić błąd przy próbie utworzenia kategorii o istniejącej nazwie", async () => {
    const categoryData = {
      name: "Testowa Kategoria Unikalna",
      description: "Opis testowej kategorii",
    };

    await Category.create(categoryData);
    // Druga próba dodania tej samej kategorii – oczekujemy błędu unikalności (kod 23505)
    await expect(Category.create(categoryData)).rejects.toThrow();
  });

  it("powinien pobrać wszystkie kategorie", async () => {
    await Category.create({
      name: "Testowa Kategoria 1",
      description: "Opis 1",
    });
    await Category.create({
      name: "Testowa Kategoria 2",
      description: "Opis 2",
    });

    const categories = await Category.getAll();
    const testCategories = categories.filter((cat) =>
      cat.name.startsWith("Testowa Kategoria")
    );

    expect(testCategories.length).toBe(2);
    expect(testCategories.map((c) => c.name)).toContain("Testowa Kategoria 1");
    expect(testCategories.map((c) => c.name)).toContain("Testowa Kategoria 2");
  });

  it("powinien zaktualizować kategorię", async () => {
    const category = await Category.create({
      name: "Testowa Kategoria do aktualizacji",
      description: "Stary opis",
    });

    const updateData = { description: "Nowy zaktualizowany opis" };
    const updatedCategory = await Category.update(category.id, updateData);

    expect(updatedCategory.id).toBe(category.id);
    expect(updatedCategory.name).toBe(category.name);
    expect(updatedCategory.description).toBe(updateData.description);
  });

  it("powinien usunąć kategorię", async () => {
    const category = await Category.create({
      name: "Testowa Kategoria do usunięcia",
      description: "Opis",
    });

    const result = await Category.delete(category.id);
    expect(result).toBe(true);

    const deletedCategory = await Category.getById(category.id);
    expect(deletedCategory).toBeUndefined();
  });
});
