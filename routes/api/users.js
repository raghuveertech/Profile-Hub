const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Users");
  console.log("Users");
});

module.exports = router;
