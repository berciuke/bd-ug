const pool = require("../config/db");

const clearTestData = async () => {
  await pool.query("BEGIN");
  await pool.query("DELETE FROM reviews WHERE comment LIKE 'Test%'");
  await pool.query("DELETE FROM products WHERE name LIKE 'Test%'");
  await pool.query("DELETE FROM categories WHERE name LIKE 'Test%'");
  await pool.query("DELETE FROM users WHERE username LIKE 'testuser%'");
  await pool.query("COMMIT");
};

module.exports = { clearTestData };
