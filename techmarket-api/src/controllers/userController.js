const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

async function getAllUsers(req, res) {
  try {
    const users = await User.getAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Błąd podczas pobierania użytkowników",
      error: error.message,
    });
  }
}

async function getUser(req, res) {
  try {
    const user = await User.getById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Użytkownik nie został znaleziony" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Błąd podczas pobierania użytkownika",
      error: error.message,
    });
  }
}

async function registerUser(req, res) {
  try {
    const existingUsername = await User.getByUsername(req.body.username);
    if (existingUsername) {
      return res
        .status(400)
        .json({ message: "Użytkownik o takiej nazwie już istnieje" });
    }

    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({
      message: "Błąd podczas rejestracji użytkownika",
      error: error.message,
    });
  }
}

async function loginUser(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Nazwa użytkownika i hasło są wymagane" });
    }

    const user = await User.authenticate(username, password);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Nieprawidłowa nazwa użytkownika lub hasło" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || "techmarket_secret_key",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Zalogowano pomyślnie",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Błąd podczas logowania",
      error: error.message,
    });
  }
}

async function updateUser(req, res) {
  try {
    const updatedUser = await User.update(req.params.id, req.body);
    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "Użytkownik nie został znaleziony" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({
      message: "Błąd podczas aktualizacji użytkownika",
      error: error.message,
    });
  }
}

async function removeUser(req, res) {
  try {
    const deleted = await User.delete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Użytkownik nie został znaleziony" });
    }
    res.status(200).json({ message: "Użytkownik został usunięty" });
  } catch (error) {
    res.status(500).json({
      message: "Błąd podczas usuwania użytkownika",
      error: error.message,
    });
  }
}

module.exports = {
  getAllUsers,
  getUser,
  registerUser,
  loginUser,
  updateUser,
  removeUser,
};
