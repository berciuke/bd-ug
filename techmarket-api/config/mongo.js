const { MongoClient } = require("mongodb");
require("dotenv").config();

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
const dbName = process.env.MONGO_DB_NAME || "techmarket";

let db;

const connectMongo = async () => {
  try {
    const client = await MongoClient.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = client.db(dbName);
    console.log("Połączono z MongoDB");
  } catch (error) {
    console.error("Błąd połączenia z MongoDB:", error);
    process.exit(1);
  }
};

const getDb = () => {
  if (!db) throw new Error("MongoDB nie zostało zainicjalizowane");
  return db;
};

module.exports = { connectMongo, getDb };
