const express = require("express");
const router = express.Router();

/*
  @route     /api/auth
  @method    GET
  @accesss   PUBLIC
*/

router.get("/", (req, res) => {
  res.send("Auth Route");
});

module.exports = router;
