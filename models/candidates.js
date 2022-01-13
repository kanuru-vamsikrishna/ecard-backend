const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const candidateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Others"],
  },
  qualification: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
  signature: {
    type: String,
  },
  createdBy: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
