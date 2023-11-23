const express = require("express");
const User = require("../../models/User");
const authenticate = require("./../../middleware/authenticate");

const router = express.Router();

// @route      GET api/auth
// @desc       authenticate route
// @accsss     Private

router.get("/", authenticate, async (req, res) => {
  try {
    // get user data
    const userData = await User.findById(req.user.id).select("-password");
    res.json(userData);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
