const { Pool } = require("pg");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const pool = new Pool({
  user: process.env.TEST_DB_USERNAME || process.env.DB_USERNAME || "postgres",
  host: process.env.TEST_DB_HOST || process.env.DB_HOST || "127.0.0.1",
  database: process.env.TEST_DB_DATABASE || "techmarket_test",
  password: process.env.TEST_DB_PASSWORD || process.env.DB_PASSWORD || "root",
  port: process.env.TEST_DB_PORT || process.env.DB_PORT || 5432,
});

describe('Test połączenia z bazą danych', () => {
  it('powinno połączyć się z bazą danych', async () => {
    const client = await pool.connect();
    expect(client).toBeDefined();
    client.release();
  });
});


module.exports = pool;