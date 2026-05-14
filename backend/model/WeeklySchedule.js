const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
  startTime: String,
  endTime: String
});

const weeklySchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service"
  },
  dayOfWeek: String, // Monday, Tuesday...
  shifts: [shiftSchema]
});

module.exports = mongoose.model("WeeklySchedule", weeklySchema);  