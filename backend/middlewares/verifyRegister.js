const UserModel = require("../models/User");

const checkDuplicateUser = (req, res, next) => {
  UserModel.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({
        status: false,
        message: err,
      });
      return;
    }

    if (user) {
      res.status(200).send({
        status: false,
        message: "Username is already in use.",
      });
      return;
    }
    next();
  });
};

module.exports = checkDuplicateUser;
