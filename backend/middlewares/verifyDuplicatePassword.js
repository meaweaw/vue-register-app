const bcrypt = require("bcryptjs");
const PasswordLog = require("../models/PasswordLog");

const checkDuplicatePassword = (req, res, next) => {
  PasswordLog.find({
    username: req.body.username,
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .exec((err, password) => {
      if (err) {
        res.status(500).send({
          status: false,
          message: err,
        });
        return;
      }

      if (password) {
        let checkDuplicate = password.filter((x) =>
          bcrypt.compareSync(req.body.password, x.password)
        );

        if (Object.keys(checkDuplicate).length > 0) {
          res.status(200).send({
            status: false,
            message: "Password history has been changed less than 5 times.",
            user: password,
          });
          return;
        }
      }
      next();
    });
};

module.exports = checkDuplicatePassword;
