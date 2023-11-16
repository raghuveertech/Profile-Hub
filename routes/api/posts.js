const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Posts");
  console.log("Posts");
});

module.exports = router;
