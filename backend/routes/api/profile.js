const express = require("express");
const request = require("request");
const config = require("config");
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

    console.log("basicInfo", basicInfo);
    console.log("profileInfo", profileInfo);

    let userInfo = basicInfo;

    if (profileInfo) {
      userInfo = {
        basicInfo: basicInfo,
        profileInfo: profileInfo,
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
  @method    PUT - Add/Replace profile picture
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

router.put(
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

/*
  @route     /api/profile
  @method    DELETE - delete user and profile
  @accesss   PRIVATE
*/

router.delete("/", authenticate, async (req, res) => {
  const userData = req.userData;
  const userId = userData.id;
  try {
    await Profile.findOneAndDelete({ user: userId });
    await User.findByIdAndDelete(userId);
    res.json({ msg: "User Profile Deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

/*
  @route     /api/profile/experience
  @method    PUT - Add/Update experience
  @accesss   PRIVATE
*/
router.put(
  "/experience",
  [
    authenticate,
    [
      check("designation", "Designation is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From Date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const userData = req.userData;
      const userId = userData.id;
      const profile = await Profile.findOne({ user: userId });

      const {
        id,
        designation,
        company,
        location,
        from,
        to,
        current,
        description,
      } = req.body;

      const experience = {};

      if (designation) experience.designation = designation;
      if (company) experience.company = company;
      if (location) experience.location = location;
      if (from) experience.from = from;
      if (to) experience.to = to;
      if (current) experience.current = current;
      if (description) experience.description = description;
      if (id) {
        profile.experience = profile.experience.map((experienceItem) => {
          if (experienceItem.id === id) {
            experienceItem = experience;
          }
          return experienceItem;
        });
      } else {
        profile.experience.push(experience);
      }
      await profile.save();
      res.send(profile);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  }
);

/*
  @route     /api/profile/experience/:exp_id
  @method    DELETE - Delete experience
  @accesss   PRIVATE
*/
router.delete("/experience/:exp_id", authenticate, async (req, res) => {
  try {
    const userData = req.userData;
    const userId = userData.id;
    const profile = await Profile.findOne({ user: userId });
    const expId = req.params.exp_id;
    profile.experience = profile.experience.filter((experienceItem) => {
      return expId !== experienceItem.id;
    });
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

/*
  @route     /api/profile/education
  @method    PUT - Add/Update education
  @accesss   PRIVATE
*/

router.put(
  "/education",
  [
    authenticate,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldofstudy", "Field of Study is required").not().isEmpty(),
      check("from", "From Date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userData = req.userData;
      const userId = userData.id;

      const profile = await Profile.findOne({ user: userId });

      const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
        id,
      } = req.body;

      const education = {};
      if (school) education.school = school;
      if (degree) education.degree = degree;
      if (fieldofstudy) education.fieldofstudy = fieldofstudy;
      if (from) education.from = from;
      if (to) education.to = to;
      if (current) education.current = current;
      if (description) education.description = description;
      if (id) education.id = id;

      if (id) {
        profile.education = profile.education.map((educationItem) => {
          if (educationItem.id === id) {
            educationItem = education;
          }
          return educationItem;
        });
      } else {
        profile.education.push(education);
      }

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  }
);

/*
  @route     /api/profile/education/:edu_id
  @method    DELETE - Delete education
  @accesss   PRIVATE
*/

router.delete("/education/:edu_id", authenticate, async (req, res) => {
  try {
    const userData = req.userData;
    const userId = userData.id;
    const eduId = req.params.edu_id;

    const profile = await Profile.findOne({ user: userId });

    profile.education = profile.education.filter((educationItem) => {
      return educationItem.id !== eduId;
    });

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

/*
  @route     /api/profile/github/:username
  @method    GET - Get github repositories of user
  @accesss   PUBLIC
*/

router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=20&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecretKey")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };
    request(options, (error, response, body) => {
      if (error) {
        console.log(error);
        return res.status(400).send(error);
      }
      if (response.statusCode === 200) {
        res.json(JSON.parse(body));
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
