const mongoose = require("mongoose");

const { Schema } = mongoose;

const interviewSchema = new Schema({
  timeSlot: {
    type: String,
    required: true
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company"
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: "Student"
  },
  fair: {
    type: Schema.Types.ObjectId,
    ref: "Fair"
  },
  course: {
    type: String,
    enum: ["WebDev", "UXUI", "Data"],
    required: true
  }
});

const Interview = mongoose.model("Interview", interviewSchema);

module.exports = Interview;
