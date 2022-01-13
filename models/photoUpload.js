const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const uploadSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
});

const Uploader = mongoose.model("Uploader", uploadSchema);

module.exports = Uploader;
