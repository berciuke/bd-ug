const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const { connectMongo } = require("../config/mongo");

// Importujemy routery
const productsRouter = require("../routes/productRoutes");
const reviewRouter = require("../routes/reviewRoutes");
const userRouter = require("../routes/userRoutes");
const {
  errorHandlerMiddleware,
  notFoundMiddleware,
} = require("../middleware/errorHandlingMiddleware");

const app = express();
app.use(bodyParser.json());
app.use("/products", productsRouter);
app.use("/reviews", reviewRouter);
app.use("/users", userRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

beforeAll(async () => {
  await connectMongo();
});

describe("API Integration Tests", () => {
  let testUserId;
  let testReviewId;

  test("Register a new user", async () => {
    const res = await request(app).post("/users").send({
      username: "testuser",
      email: "testuser@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("userId");
    testUserId = res.body.userId;
  });

  test("Get list of users", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test("Create a new review", async () => {
    const res = await request(app)
      .post("/reviews")
      .send({
        productId: "1", // zakładamy, że produkt o id "1" istnieje
        userId: testUserId,
        rating: 5,
        title: "Świetny produkt",
        content: "Jestem bardzo zadowolony z zakupu. Polecam!",
        pros: ["Jakość", "Wydajność"],
        cons: ["Cena"],
        verifiedPurchase: true,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("reviewId");
    testReviewId = res.body.reviewId;
  });

  test("Get reviews for a product", async () => {
    const res = await request(app).get("/reviews/product/1?page=1&limit=10");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test("Search reviews", async () => {
    const res = await request(app).get("/reviews/search?text=świetny");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test("Update review", async () => {
    const res = await request(app)
      .patch(`/reviews/${testReviewId}`)
      .send({ rating: 4 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toMatch(/zaktualizowana/);
  });

  test("Vote helpful on review", async () => {
    const res = await request(app).patch(`/reviews/vote/${testReviewId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toMatch(/Głos został zarejestrowany/);
  });

  test("Delete review", async () => {
    const res = await request(app).delete(`/reviews/${testReviewId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toMatch(/usunięta/);
  });
});
