const express = require("express");
const { check, validationResult } = require("express-validator");

const router = express.Router();

const authenticate = require("./../../middleware/authenticate");
const Post = require("./../../models/Post");
const Profile = require("./../../models/Profile");
const User = require("./../../models/User");

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

/*
  @route     /api/posts/like/:post_id
  @method    PUT - Like a post by user
  @accesss   PRIVATE
*/
router.put("/like/:post_id", authenticate, async (req, res) => {
  try {
    const userData = req.userData;
    const userId = userData.id;
    const post = await Post.findById(req.params.post_id);
    if (
      !(
        post.likes.filter((like) => {
          return like.user.toString() === userId;
        }).length > 0
      )
    ) {
      post.likes.push({
        user: userId,
      });
    }
    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

/*
  @route     /api/posts/unlike/:post_id
  @method    PUT - unlike a post by user
  @accesss   PRIVATE
*/
router.put("/unlike/:post_id", authenticate, async (req, res) => {
  try {
    const userData = req.userData;
    const userId = userData.id;
    const post = await Post.findById(req.params.post_id);
    post.likes = post.likes.filter((like) => {
      return like.user.toString() !== userId;
    });
    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

/*
  @route     /api/posts/comment/:post_id
  @method    PUT - Add comment to a post
  @accesss   PRIVATE
*/
router.put(
  "/comment/:post_id",
  [authenticate, check("text", "Comment is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    try {
      const userData = req.userData;
      const userId = userData.id;
      const post = await Post.findById(req.params.post_id);
      const user = await User.findById(userId).select("name");
      post.comments.push({
        user: userId,
        username: user.name,
        text: req.body.text,
      });
      await post.save();
      res.json({ comments: post.comments });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  }
);

/*
  @route     /api/posts/:post_id/comment/:comment_id
  @method    DELETE - delete comment for a post by user
  @accesss   PRIVATE
*/
router.delete(
  "/:post_id/comment/:comment_id",
  authenticate,
  async (req, res) => {
    try {
      const userData = req.userData;
      const userId = userData.id;
      const post = await Post.findById(req.params.post_id);
      const commentId = req.params.comment_id;
      post.comments = post.comments.filter((comment) => {
        if (comment.user.toString() === userId) {
          return comment.id.toString() !== commentId;
        }
      });
      await post.save();
      res.json({ comments: post.comments });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
