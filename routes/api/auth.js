const express = require("express");

const router = express.Router();

// @route      GET api/auth
// @desc       Test route
// @accsss     Public

router.get("/", (req, res) => {
  res.send("Auth");
  console.log("Auth");
});

module.exports = router;
