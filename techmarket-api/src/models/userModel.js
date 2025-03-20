const pool = require("../../config/db");
const bcrypt = require("bcryptjs");

const User = {
  getAll: async () => {
    const { rows } = await pool.query(
      "SELECT id, username, email, first_name, last_name, created_at, updated_at FROM users ORDER BY username"
    );
    return rows;
  },

  getById: async (id) => {
    const { rows } = await pool.query(
      "SELECT id, username, email, first_name, last_name, created_at, updated_at FROM users WHERE id = $1",
      [id]
    );
    return rows[0];
  },

  getByUsername: async (username) => {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    return rows[0];
  },

  create: async (userData) => {
    const { username, email, password, first_name, last_name } = userData;
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const { rows } = await pool.query(
      "INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, first_name, last_name, created_at, updated_at",
      [username, email, password_hash, first_name || "", last_name || ""]
    );
    return rows[0];
  },

  update: async (id, userData) => {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    if (rows.length === 0) {
      return null;
    }

    const currentUser = rows[0];
    let updates = { ...currentUser, ...userData };

    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password_hash = await bcrypt.hash(userData.password, salt);
      delete updates.password;
    }

    const { rows: updatedRows } = await pool.query(
      "UPDATE users SET username = $1, email = $2, password_hash = $3, first_name = $4, last_name = $5, updated_at = $6 WHERE id = $7 RETURNING id, username, email, first_name, last_name, created_at, updated_at",
      [
        updates.username,
        updates.email,
        updates.password_hash,
        updates.first_name || "",
        updates.last_name || "",
        new Date(),
        id,
      ]
    );

    return updatedRows[0];
  },

  delete: async (id) => {
    const { rowCount } = await pool.query("DELETE FROM users WHERE id = $1", [
      id,
    ]);
    return rowCount > 0;
  },

  authenticate: async (username, password) => {
    const user = await User.getByUsername(username);
    if (!user) return null;

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) return null;

    delete user.password_hash;
    return user;
  },

  getReviews: async (userId) => {
    const { rows } = await pool.query(
      "SELECT r.*, p.name as product_name FROM reviews r JOIN products p ON r.product_id = p.id WHERE r.user_id = $1 ORDER BY r.created_at DESC",
      [userId]
    );
    return rows;
  },
};

module.exports = User;
