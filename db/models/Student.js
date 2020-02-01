const mongoose = require("mongoose");

const { Schema } = mongoose;

const studentSchema = new Schema({
  displayName: {
    type: String,
    required: true
  },
  course: {
    type: String,
    enum: ["WebDev", "UXUI", "Data"],
    required: true
  },
  fair: {
    type: Schema.Types.ObjectId,
    ref: "Fair",
    required: true
  },
  lang: [String],
  top3: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Company"
      }
    ],
    validate: {
      validator: arr => arr.length <= 3,
      message: "top3 companies is limited to 3"
    }
  }
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
