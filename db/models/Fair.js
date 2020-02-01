const mongoose = require("mongoose");

const { Schema } = mongoose;

const fairSchema = new Schema({
  campus: {
    type: String,
    required: true
  },
  date: Date,
  password: {
    type: String,
    required: true
  },
  openingTimes: [String]
});

const Fair = mongoose.model("Fair", fairSchema);

module.exports = Fair;
