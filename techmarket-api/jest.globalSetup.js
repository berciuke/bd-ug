// jest.globalSetup.js
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

module.exports = async () => {
  // Załaduj zmienne środowiskowe (upewnij się, że plik .env znajduje się w katalogu głównym)
  require("dotenv").config({ path: path.join(__dirname, ".env") });

  const pool = new Pool({
    user: process.env.DB_USERNAME || "postgres",
    host: process.env.DB_HOST || "127.0.0.1",
    database: process.env.DB_DATABASE || "db",
    password: process.env.DB_PASSWORD || "root",
    port: process.env.DB_PORT || 5432,
  });

  // Wczytaj skrypt inicjalizujący (init.sql) – pamiętaj, by ścieżka była poprawna
  const initScript = fs.readFileSync(path.join(__dirname, "config", "init.sql"), "utf-8");
  try {
    await pool.query(initScript);
    console.log("Global setup: baza danych została zresetowana.");
  } catch (err) {
    console.error("Global setup: błąd inicjalizacji bazy danych:", err);
    throw err;
  } finally {
    await pool.end();
  }
};
