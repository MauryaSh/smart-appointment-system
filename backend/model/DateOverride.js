const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
  startTime: String,
  endTime: String
});

const overrideSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service"
  },
  date: String, // "2026-03-23"
  shifts: [shiftSchema],
  isCancelled: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("DateOverride", overrideSchema);