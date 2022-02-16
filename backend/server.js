require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const database = require("./database");
const bodyParser = require("body-parser");
const createError = require("http-errors");

// Connect MongoDB
mongoose.Promise = global.Promise;
mongoose
  .connect(database.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("Database connected");
    },
    (error) => {
      console.log("Database could't be connected to: " + error);
    }
  );

const userAPI = require("./routes/user.route.js");
const app = express();
app.use(
  bodyParser.json({
    limit: "10mb",
  })
);

app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: "10mb",
  })
);

app.use(cors());

// Api
app.use("/api", userAPI);

// Create port
const port = process.env.PORT;
app.listen(port, () => {
  console.log("Connected to port " + port);
});

// Find 404
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
