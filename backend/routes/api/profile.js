const express = require("express");
const multer = require("multer");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const router = express.Router();
const authenticate = require("./../../middleware/authenticate");

/*
  @route     /api/profile
  @method    GET - get current user profile
  @accesss   PRIVATE
*/

router.get("/", authenticate, async (req, res) => {
  const userData = req.userData;
  const userId = userData.id;

  try {
    const basicInfo = await User.findById(userId).select("-password");
    const profileInfo = await Profile.findOne({ user: userId });
    const profilePicture = await ProfilePicture.findOne({ user: userId });

    console.log("basicInfo", basicInfo);
    console.log("profileInfo", profileInfo);
    console.log("profilePicture", profilePicture);

    let userInfo = basicInfo;

    if (profileInfo) {
      userInfo = {
        basicInfo: basicInfo,
        profileInfo: profileInfo,
        profilePicture: profilePicture,
      };
    }
    res.json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

/*
  @route     /api/profile
  @method    POST - Add/Modify profile info
  @accesss   PRIVATE
*/
router.post(
  "/",
  [
    authenticate,
    [
      check("designation", "Designation is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        err: errors.array(),
      });
    }

    const userData = req.userData;
    const userId = userData.id;

    const {
      company,
      website,
      location,
      designation,
      bio,
      githubusername,
      skills,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
    } = req.body;

    // build profile data object

    const profileData = {};
    profileData.user = userId;

    if (company) {
      profileData.company = company.trim();
    }
    if (website) {
      profileData.website = website.trim();
    }
    if (location) {
      profileData.location = location.trim();
    }
    if (designation) {
      profileData.designation = designation.trim();
    }
    if (bio) {
      profileData.bio = bio.trim();
    }
    if (githubusername) {
      profileData.githubusername = githubusername.trim();
    }
    if (skills) {
      profileData.skills = skills.split(",").map((skill) => skill.trim());
    }

    // build social object
    profileData.social = {};
    if (youtube) profileData.social.youtube = youtube;
    if (twitter) profileData.social.twitter = twitter;
    if (facebook) profileData.social.facebook = facebook;
    if (linkedin) profileData.social.linkedin = linkedin;
    if (instagram) profileData.social.instagram = instagram;
    try {
      const profile = await Profile.findOne({ user: userId });
      if (profile) {
        //update exsting profile
        const updatedProfile = await Profile.findOneAndUpdate(
          { user: userId },
          { $set: profileData },
          { new: true }
        );
        res.json(updatedProfile);
      } else {
        //add new profile
        const profile = new Profile(profileData);
        await profile.save();
        res.json(profile);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        msg: "Server Error",
      });
    }
  }
);

/*
  @route     /api/profile/dp
  @method    POST - Add/Replace profile picture
  @accesss   PRIVATE
*/

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Files will be stored in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/dp",
  [authenticate, upload.single("profilepicture")],
  async (req, res) => {
    try {
      const userData = req.userData;
      const userId = userData.id;

      if (!req.file) {
        return res.status(400).send("No files were uploaded.");
      }

      const profilePictureData = {
        user: userId,
        profilepicture: {
          filename: req.file.originalname,
          path: req.file.path,
          size: req.file.size,
        },
      };

      const existingProfile = await Profile.findOne({
        user: userId,
      });

      if (existingProfile) {
        await Profile.findOneAndUpdate(
          { user: userId },
          { $set: profilePictureData },
          { new: true }
        );
        res.status(200).send("File uploaded successfully!");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

/*
  @route     /api/profile/all
  @method    GET - get all profiles
  @accesss   PUBLIC
*/

router.get("/all", async (req, res) => {
  try {
    const allProfiles = await Profile.find().populate("user", [
      "name",
      "avatar",
      "email",
    ]);
    res.json(allProfiles);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

/*
  @route     /api/profile/:user_id
  @method    GET - get single user profile
  @accesss   PUBLIC
*/

router.get("/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar", "email"]);

    if (!profile) {
      return res.status(400).send("Profile Not Found");
    }

    res.json(profile);
  } catch (err) {
    console.log(err);
    if (err.kind == "ObjectId") {
      return res.status(400).send("Profile Not Found");
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
