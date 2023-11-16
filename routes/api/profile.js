const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Profile");
  console.log("Profile");
});

module.exports = router;
