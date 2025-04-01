const pool = require("../../config/db");
const Review = require("../../src/models/reviewModel");
const Product = require("../../src/models/productModel");
const User = require("../../src/models/userModel");
const Category = require("../../src/models/categoryModel");
const { clearTestData } = require("../testUtils");

describe("Model Recenzji", () => {
  let testProductId, testUserId;

  beforeAll(async () => {
    // Czyścimy dane testowe
    await clearTestData();

    // Utwórz kategorię oraz produkt do testów recenzji – nazwy muszą się zaczynać od "Test"
    const category = await Category.create({
      name: "Testowa Kategoria",
      description: "Kategoria do testów",
    });

    const product = await Product.create({
      name: "Testowy Produkt Recenzje",
      description: "Produkt do testów recenzji",
      price: 99.99,
      stock_quantity: 10,
      category_id: category.id,
    });
    testProductId = product.id;

    // Utwórz użytkownika testowego
    const user = await User.create({
      username: "testuser_review",
      email: "testuser_review@example.com",
      password: "password123",
      first_name: "Test",
      last_name: "User",
    });
    testUserId = user.id;
  });

  afterAll(async () => {
    await clearTestData();
    await pool.end();
  });

  it("powinien utworzyć recenzję z poprawnymi danymi", async () => {
    const reviewData = {
      product_id: testProductId,
      user_id: testUserId,
      rating: 4,
      comment: "Testowa recenzja produktu",
    };

    const review = await Review.create(reviewData);
    expect(review.id).toBeDefined();
    expect(review.product_id).toBe(reviewData.product_id);
    expect(review.user_id).toBe(reviewData.user_id);
    expect(review.rating).toBe(reviewData.rating);
    expect(review.comment).toBe(reviewData.comment);
  });

  it("powinien pobrać recenzje dla danego produktu", async () => {
    for (let i = 1; i <= 3; i++) {
      await Review.create({
        product_id: testProductId,
        user_id: testUserId,
        rating: i + 2,
        comment: `Testowa recenzja ${i}`,
      });
    }

    const reviews = await Review.getByProductId(testProductId);
    const testReviews = reviews.filter((r) =>
      r.comment.startsWith("Testowa recenzja")
    );

    expect(testReviews.length).toBeGreaterThanOrEqual(3);
    expect(testReviews.map((r) => r.rating)).toContain(3);
    expect(testReviews.map((r) => r.rating)).toContain(4);
    expect(testReviews.map((r) => r.rating)).toContain(5);
  });

  it("powinien obliczyć średnią ocenę dla produktu", async () => {
    const { averageRating, reviewCount } =
      await Review.getAverageRatingForProduct(testProductId);

    expect(reviewCount).toBeGreaterThanOrEqual(3);
    expect(averageRating).toBeGreaterThanOrEqual(3);
    expect(averageRating).toBeLessThanOrEqual(5);
  });
});
