const jwt = require("jsonwebtoken");
const config = require("config");

const authenticate = (req, res, next) => {
  // Get Token From Header
  const token = req.header("x-auth-token");

  // No Token Case
  if (!token) {
    return res
      .status(401)
      .json({ message: "You are not authorised to access this page" });
  }

  // Verify Token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Token Not Valid" });
  }
};

module.exports = authenticate;
