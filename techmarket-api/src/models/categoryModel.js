const pool = require("../../config/db");

const Category = {
  getAll: async () => {
    const { rows } = await pool.query("SELECT * FROM categories ORDER BY name");
    return rows;
  },

  getById: async (id) => {
    const { rows } = await pool.query(
      "SELECT * FROM categories WHERE id = $1",
      [id]
    );
    return rows[0];
  },

  create: async (categoryData) => {
    const { name, description } = categoryData;
    const { rows } = await pool.query(
      "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *",
      [name, description || ""]
    );
    return rows[0];
  },

  update: async (id, categoryData) => {
    const { rows } = await pool.query(
      "SELECT * FROM categories WHERE id = $1",
      [id]
    );
    if (rows.length === 0) {
      return null;
    }

    const currentCategory = rows[0];
    const updates = { ...currentCategory, ...categoryData };

    const { rows: updatedRows } = await pool.query(
      "UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *",
      [updates.name, updates.description, id]
    );

    return updatedRows[0];
  },

  delete: async (id) => {
    const { rowCount } = await pool.query(
      "DELETE FROM categories WHERE id = $1",
      [id]
    );
    return rowCount > 0;
  },

  getProductsByCategory: async (categoryId) => {
    const { rows } = await pool.query(
      "SELECT p.* FROM products p WHERE p.category_id = $1 ORDER BY p.name",
      [categoryId]
    );
    return rows;
  },
};

module.exports = Category;
