const express = require("express");
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();
const User = require("./../../models/User");

/*
  @route     /api/users/register
  @method    POST - registering user
  @accesss   PUBLIC
*/

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter valid email").isEmail(),
    check(
      "password",
      "Please enter password with at least 6 characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    try {
      // check if user already exists
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({
          errors: [
            {
              msg: "User Already Exists",
            },
          ],
        });
      }

      // get avatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      // encrypt password
      const salt = await bcryptjs.genSalt(10);
      const encryptedPassword = await bcryptjs.hash(password, salt);

      // save user
      const user = new User({
        name: name,
        email: email,
        password: encryptedPassword,
        avatar: avatar,
      });

      await user.save();

      // send json web token
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecretKey"),
        { expiresIn: 3600000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token: token });
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Something went wrong",
      });
    }
  }
);

/*
  @route     /api/users/login
  @method    POST - user login
  @accesss   PUBLIC
*/

router.post(
  "/login",
  [
    check("email", "Please enter valid email").isEmail(),
    check("password", "Please enter a password").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    try {
      // check if user already exists
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(400).json({
          errors: [
            {
              msg: "Invalid Credentials",
            },
          ],
        });
      }

      // compare passwords
      const passwordsMatch = await bcryptjs.compare(password, user.password);
      if (!passwordsMatch) {
        return res.status(400).json({
          errors: [
            {
              msg: "Invalid Credentials",
            },
          ],
        });
      }

      // send json web token
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecretKey"),
        { expiresIn: 3600000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token: token });
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Something went wrong",
      });
    }
  }
);

module.exports = router;
