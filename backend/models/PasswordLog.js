const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let userSchema = new Schema(
  {
    username: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true },
  {
    collection: "password_log",
  }
);
module.exports = mongoose.model("PasswordLog", userSchema);
