require("dotenv").config();
const jwt = require("jsonwebtoken");
const secretKey = process.env.TOKEN_SECRET;

const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"].replace(/^JWT\s/, '');
  if (!token) {
    return res.status(403).send({
      status: false,
      message: "No token provided!",
    });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        status: false,
        message: "Unauthorized!",
        error: err,
      });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
