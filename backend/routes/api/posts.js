const express = require("express");
const { check, validationResult } = require("express-validator");

const router = express.Router();

const authenticate = require("./../../middleware/authenticate");
const Post = require("./../../models/Post");
const Profile = require("./../../models/Profile");

/*
  @route     /api/posts
  @method    POST - Create/update a Post
  @accesss   PRIVATE
*/

router.post(
  "/",
  [
    authenticate,
    [
      check("title", "Title is required").not().isEmpty(),
      check("description", "Description is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userData = req.userData;
      const userId = userData.id;
      if (req.body.postId) {
        const existingPost = await Post.findById(req.body.postId);
        existingPost.title = req.body.title;
        existingPost.description = req.body.description;
        await existingPost.save();
        return res.json({ post: existingPost });
      } else {
        const post = new Post({
          title: req.body.title,
          description: req.body.description,
          user: userId,
        });
        const savedPost = await post.save();
        res.json({ post: savedPost });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  }
);

/*
  @route     /api/posts
  @method    GET - Get all blog posts
  @accesss   PUBLIC
*/

router.get("/", async (req, res) => {
  try {
    const allPosts = await Post.find().populate("user", ["name"]);
    res.json({ posts: allPosts });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

/*
  @route     /api/posts/:post_id
  @method    GET - Get single post
  @accesss   PUBLIC
*/

router.get("/:post_id", async (req, res) => {
  try {
    const singlePost = await Post.findById(req.params.post_id).populate(
      "user",
      ["name"]
    );
    const userId = singlePost.user.id;
    const userProfile = await Profile.findOne({ user: userId }).select([
      "profilepicture",
      "designation",
      "company",
    ]);

    res.json({ post: singlePost, userInfo: userProfile });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

/*
  @route     /api/posts/:post_id
  @method    DELETE - Delete Post
  @accesss   PRIVATE
*/

router.delete("/:post_id", authenticate, async (req, res) => {
  try {
    const userData = req.userData;
    const userId = userData.id;
    const postId = req.params.post_id;
    const post = await Post.findById(postId);
    if (userId === post.user.toString()) {
      await Post.findByIdAndDelete(postId);
      return res.send("Post Deleted Successfully");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
