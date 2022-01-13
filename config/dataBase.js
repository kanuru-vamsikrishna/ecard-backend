const mongoose = require("mongoose");

const setUpDB = () => {
  mongoose
    .connect("mongodb://localhost:27017/eCard")
    .then(() => {
      console.log("connected to db");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = setUpDB;
