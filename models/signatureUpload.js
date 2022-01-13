const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const signatureSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
});

const Signature = mongoose.model("Signature", signatureSchema);

module.exports = Signature;
