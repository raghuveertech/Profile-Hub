const express = require("express");
const router = express.Router();

/*
  @route     /api/posts
  @method    GET
  @accesss   PUBLIC
*/

router.get("/", (req, res) => {
  res.send("Posts Route");
});

module.exports = router;
