const express = require("express");
const User = require("../../models/User");
const router = express.Router();
const authenticate = require("./../../middleware/authenticate");

/*
  @route     /api/profile
  @method    GET
  @accesss   PRIVATE
*/

router.get("/", authenticate, async (req, res) => {
  const userData = req.userData;
  const userId = userData.id;

  try {
    const userInfo = await User.findById(userId).select("-password");
    res.json({ userInfo: userInfo });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
