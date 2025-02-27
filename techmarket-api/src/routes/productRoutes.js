// plik z definicjami ścieżek API.
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello, My server using Express");
  });

module.exports = router