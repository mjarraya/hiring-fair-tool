const mongoose = require("mongoose");

const { Schema } = mongoose;

const companySchema = Schema({
  displayName: {
    type: String,
    required: true
  },
  fair: {
    type: Schema.Types.ObjectId,
    ref: "Fair",
    required: true
  },
  courses: [
    {
      type: String,
      enum: ["WebDev", "UXUI", "Data"]
    }
  ],
  // langFilter: String
  langFilter: {
    type: Boolean,
    default: false
  }
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
