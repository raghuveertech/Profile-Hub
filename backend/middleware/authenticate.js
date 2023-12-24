const jwt = require("jsonwebtoken");
const config = require("config");

const authenticate = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No Token, Access Denied" });
  }
  try {
    const decodedInfo = jwt.verify(token, config.get("jwtSecretKey"));
    const userData = decodedInfo.user; // payload
    req.userData = userData;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ msg: "Token Invalid" });
  }
};

module.exports = authenticate;
