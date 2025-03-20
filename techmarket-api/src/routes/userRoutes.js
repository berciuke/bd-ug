const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  registerUser,
  loginUser,
  updateUser,
  removeUser,
} = require("../controllers/userController");

router.get("/", getAllUsers);
router.get("/:id", getUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/:id", updateUser);
router.delete("/:id", removeUser);

module.exports = router;