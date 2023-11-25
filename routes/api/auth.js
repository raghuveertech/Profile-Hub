const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../../models/User");
const authenticate = require("./../../middleware/authenticate");

const router = express.Router();

// @route      GET api/auth
// @desc       authenticate route
// @access     Private

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

// @route      GET api/auth
// @desc       authenticate user and get token
// @access     Public

router.post(
  "/",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter password").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // validate the request

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ message: "Invalid Credentials" }] });
      }
      console.log(password, user.password);
      const passwordsMatch = await bcrypt.compare(password, user.password);
      if (!passwordsMatch) {
        return res
          .status(400)
          .json({ errors: [{ message: "Invalid Credentials" }] });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: config.get("jwtTimeout"),
        },
        (err, token) => {
          if (err) {
            throw err;
          }

          res.send({ token });
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

module.exports = router;
