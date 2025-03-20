const pool = require("../../config/db");

const Review = {
  getAll: async () => {
    const { rows } = await pool.query(`
      SELECT r.*, 
             p.name as product_name, 
             u.username as user_username
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `);
    return rows;
  },

  getById: async (id) => {
    const { rows } = await pool.query(
      `
      SELECT r.*, 
             p.name as product_name, 
             u.username as user_username
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      JOIN users u ON r.user_id = u.id
      WHERE r.id = $1
    `,
      [id]
    );
    return rows[0];
  },

  getByProductId: async (productId) => {
    const { rows } = await pool.query(
      `
      SELECT r.*, 
             u.username as user_username,
             u.first_name as user_first_name,
             u.last_name as user_last_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = $1
      ORDER BY r.created_at DESC
    `,
      [productId]
    );
    return rows;
  },

  create: async (reviewData) => {
    const { product_id, user_id, rating, comment } = reviewData;

    const productCheck = await pool.query(
      "SELECT 1 FROM products WHERE id = $1",
      [product_id]
    );
    if (productCheck.rows.length === 0) {
      throw new Error("Produkt nie został znaleziony");
    }

    const userCheck = await pool.query("SELECT 1 FROM users WHERE id = $1", [
      user_id,
    ]);
    if (userCheck.rows.length === 0) {
      throw new Error("Użytkownik nie został znaleziony");
    }

    const { rows } = await pool.query(
      "INSERT INTO reviews (product_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *",
      [product_id, user_id, rating, comment || ""]
    );
    return rows[0];
  },

  update: async (id, reviewData) => {
    const { rows } = await pool.query("SELECT * FROM reviews WHERE id = $1", [
      id,
    ]);
    if (rows.length === 0) {
      return null;
    }

    const currentReview = rows[0];
    const updates = {
      ...currentReview,
      ...reviewData,
      updated_at: new Date(),
    };

    const { rows: updatedRows } = await pool.query(
      "UPDATE reviews SET rating = $1, comment = $2, updated_at = $3 WHERE id = $4 RETURNING *",
      [updates.rating, updates.comment || "", updates.updated_at, id]
    );

    return updatedRows[0];
  },

  delete: async (id) => {
    const { rowCount } = await pool.query("DELETE FROM reviews WHERE id = $1", [
      id,
    ]);
    return rowCount > 0;
  },

  getAverageRatingForProduct: async (productId) => {
    const { rows } = await pool.query(
      "SELECT AVG(rating) as average_rating, COUNT(*) as review_count FROM reviews WHERE product_id = $1",
      [productId]
    );
    return {
      averageRating: parseFloat(rows[0].average_rating) || 0,
      reviewCount: parseInt(rows[0].review_count),
    };
  },
};

module.exports = Review;
