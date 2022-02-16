require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userRoute = express.Router();

// User Model
const UserModel = require("../models/User");
const PasswordLog = require("../models/PasswordLog");

// Middlewares
const verifyToken = require("../middlewares/verifyToken");
const verifyRegister = require("../middlewares/verifyRegister");
const verifyDuplicatePassword = require("../middlewares/verifyDuplicatePassword");

userRoute.route("/").get((req, res) => {
  res.status(200).json({
    message: "Page you are looking for could not be found.",
  });
});

userRoute.route("/create-user").post(verifyRegister, (req, res, next) => {
  let password = bcrypt.hashSync(req.body.password, 8);
  UserModel.create(
    {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      profile: req.body.profile,
      username: req.body.username,
      password: password,
    },
    (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.status(200).json({
          status: true,
          message: "success",
          data: data,
        });
      }
    }
  );

  PasswordLog.create(
    {
      username: req.body.username,
      password: password,
    },
    (error) => {
      if (error) {
        return next(error);
      }
    }
  );
});

userRoute.route("/check-user").post((req, res, next) => {
  UserModel.findOne({
    username: req.body.username,
  }).exec((err, data) => {
    if (err) {
      return next(err);
    } else {
      let token = "";
      let status = false;
      let message = "fail";

      if (data === null) {
        status = false;
        message = "Invalid Username.";
      } else {
        status = true;
        message = "success";
        token = jwt.sign({ id: data._id }, process.env.TOKEN_SECRET, {
          expiresIn: 86400,
        });

        let passwordIsValid = bcrypt.compareSync(
          req.body.password,
          data.password
        );

        if (!passwordIsValid) {
          status = false;
          message = "Invalid Password.";
        }
      }

      res.status(200).json({
        status: status,
        message: message,
        data: data,
        accessToken: token,
      });
    }
  });
});

userRoute.route("/update-user").post(verifyToken, (req, res, next) => {
  UserModel.findByIdAndUpdate(
    req.body.id,
    {
      $set: req.body,
    },
    (error) => {
      if (error) {
        return next(error);
      } else {
        res.status(200).json({
          status: true,
          message: "success",
        });
      }
    }
  );
});

userRoute
  .route("/change-password")
  .post([verifyToken, verifyDuplicatePassword], (req, res, next) => {
    let password = bcrypt.hashSync(req.body.password, 8);
    UserModel.updateOne(
      { username: req.body.username },
      {
        $set: { password: password },
      },
      (error) => {
        if (error) {
          return next(error);
        } else {
          res.status(200).json({
            status: true,
            message: "success",
          });
        }
      }
    );

    PasswordLog.create(
      {
        username: req.body.username,
        password: password,
      },
      (error) => {
        if (error) {
          return next(error);
        }
      }
    );
  });

userRoute.route("/clear-user").get((req, res, next) => {
  UserModel.remove({}, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        status: true,
        message: "success",
        data: data,
      });
    }
  });
});

module.exports = userRoute;
