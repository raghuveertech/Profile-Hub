const express = require("express");

const router = express.Router();

// @route      GET api/posts
// @desc       Test route
// @accsss     Public

router.get("/", (req, res) => {
  res.send("Posts");
  console.log("Posts");
});

module.exports = router;