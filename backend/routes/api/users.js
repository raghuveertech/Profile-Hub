const express = require("express");
const router = express.Router();

/*
  @route     /api/users
  @method    GET
  @accesss   PUBLIC
*/

router.get("/", (req, res) => {
  res.send("Users Route");
});

module.exports = router;
