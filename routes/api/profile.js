const express = require("express");

const router = express.Router();

// @route      GET api/profile
// @desc       Test route
// @accsss     Private

router.get("/", (req, res) => {
  res.send("Profile");
  console.log("Profile");
});

module.exports = router;
