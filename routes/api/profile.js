const express = require("express");
const { check, validationResult } = require("express-validator");
const authenticate = require("./../../middleware/authenticate");
const Profile = require("./../../models/Profile");
const User = require("./../../models/User");
const router = express.Router();

// @route      GET api/profile
// @desc       Get current user's profile
// @access     Private

router.get("/", authenticate, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res
        .status(400)
        .json({ message: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// @route      POST api/profile
// @desc       update user's profile
// @access     Private

router.post(
  "/",
  [
    authenticate,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Please enter skills").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      status,
      website,
      skills,
      location,
      bio,
      githubusername,
      linkedin,
      facebook,
      youtube,
      instagram,
      twitter,
    } = req.body;

    // build profile object

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }
    // build social object
    profileFields.social = {};
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // update profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      // create profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// @route      GET api/profile/all
// @desc       list of all profiles
// @access     Public

router.get("/all", async (req, res) => {
  try {
    const allProfiles = await Profile.find().populate("user", [
      "name",
      "avatar",
    ]);
    res.json(allProfiles);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

// @route      GET api/profile/:userId
// @desc       Single Profile by UserId
// @access     Public

router.get("/:userId", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.userId,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ message: "Profile Not Found" });
    }
    res.json(profile);
  } catch (error) {
    console.log(error.message);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Profile Not Found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route      DELETE api/profile
// @desc       Delete profile, user & posts
// @access     Private

router.delete("/", authenticate, async (req, res) => {
  try {
    // @todo - remove user's posts
    // Remove Profile
    await Profile.findOneAndDelete({
      user: req.user.id,
    });
    // Remove User
    await User.findOneAndDelete({
      _id: req.user.id,
    });

    return res.json({ message: "Account Deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

// @route      PUT api/profile/experience
// @desc       add/update experience to user's profile
// @access     Private

router.put(
  "/experience",
  [
    authenticate,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id, title, company, location, from, to, current, description } =
      req.body;

    const postedExp = {
      id,
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!postedExp.id) {
        profile.experience.unshift(postedExp);
      } else {
        profile.experience = profile.experience.map((exp) => {
          console.log("exp.id", exp.id);
          console.log("postedExp.id", postedExp.id);
          if (exp.id === postedExp.id) {
            exp = postedExp;
          }
          return exp;
        });
      }
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// @route      DELETE api/profile/experience/:experienceId
// @desc       Delete Experience of user profile
// @access     Private

router.delete("/experience/:experienceId", authenticate, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const experienceId = req.params.experienceId;

    profile.experience = profile.experience.filter((exp) => {
      return exp.id !== experienceId;
    });

    await profile.save();
    return res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
