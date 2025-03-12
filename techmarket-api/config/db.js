const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const pool = new Pool({
  user: process.env.DB_USERNAME || "postgres",
  host: process.env.DB_HOST || "127.0.0.1",
  database: process.env.DB_DATABASE || "db",
  password: process.env.DB_PASSWORD || "root",
  port: process.env.DB_PORT || 5432,
});

const initDb = async () => {
  const initScript = fs
    .readFileSync(path.join(__dirname, "init.sql"))
    .toString();
  try {
    await pool.query(initScript);
    console.log("Baza danych została zainicjalizowana.");
  } catch (err) {
    console.error("Błąd inicjalizacji bazy danych:", err);
  }
};

initDb();

module.exports = pool;
