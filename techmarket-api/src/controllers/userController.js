const { getDb } = require("../config/mongo");
const { ObjectId } = require("mongodb");
const userSchema = require("../models/userModel");

const registerUser = async (req, res) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: "Błąd walidacji", error: error.details });
  }
  const db = getDb();
  try {
    // Sprawdzamy, czy użytkownik o podanym emailu już istnieje
    const existing = await db
      .collection("users")
      .findOne({ email: value.email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Użytkownik z podanym adresem email już istnieje" });
    }
    const result = await db.collection("users").insertOne(value);
    res
      .status(201)
      .json({
        message: "Użytkownik zarejestrowany",
        userId: result.insertedId,
      });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Błąd podczas rejestracji użytkownika",
        error: err.message,
      });
  }
};

const getUsers = async (req, res) => {
  const db = getDb();
  try {
    const users = await db.collection("users").find().toArray();
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Błąd podczas pobierania użytkowników",
        error: err.message,
      });
  }
};

const getUser = async (req, res) => {
  const db = getDb();
  const { id } = req.params;
  try {
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Użytkownik nie został znaleziony" });
    }
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Błąd podczas pobierania użytkownika",
        error: err.message,
      });
  }
};

const updateUser = async (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { error, value } = userSchema.validate(req.body, {
    presence: "optional",
  });
  if (error) {
    return res
      .status(400)
      .json({ message: "Błąd walidacji", error: error.details });
  }
  try {
    const result = await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...value, updatedAt: new Date() } }
      );
    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: "Użytkownik nie został znaleziony" });
    }
    res.status(200).json({ message: "Użytkownik zaktualizowany" });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Błąd podczas aktualizacji użytkownika",
        error: err.message,
      });
  }
};

const deleteUser = async (req, res) => {
  const db = getDb();
  const { id } = req.params;
  try {
    const result = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Użytkownik nie został znaleziony" });
    }
    res.status(200).json({ message: "Użytkownik usunięty" });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Błąd podczas usuwania użytkownika",
        error: err.message,
      });
  }
};

module.exports = {
  registerUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
