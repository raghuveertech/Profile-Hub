const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const User = require("./../../models/User");

// @route      POST api/users
// @desc       User Register route
// @accsss     Public

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Please enter a valid password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // validate the request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // check if user exists
      const userExists = await User.findOne({ email: email });
      if (userExists) {
        return res
          .status(400)
          .json({ errors: [{ message: "The email is already registered" }] });
      }
      // get user's gravatar

      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      // encrypt password using bcrypt

      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(password, salt);

      // save the user

      const newUser = new User({
        name: name,
        email: email,
        password: encryptedPassword,
        avatar: avatar,
      });

      newUser.save();

      return res.json("User Registered");

      // return jsonwebtoken
    } catch (e) {
      console.log(e.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
