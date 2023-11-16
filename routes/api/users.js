const express = require("express");

const router = express.Router();

// @route      GET api/users
// @desc       Test route
// @accsss     Public

router.get("/", (req, res) => {
  res.send("Users");
  console.log("Users");
});

module.exports = router;
