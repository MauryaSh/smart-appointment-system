const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service"
  },
  segmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Segment"
  },
  spId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  date: String,
  startTime: String,
  endTime: String,

  status: {
  type: String,
  enum: ["booked", "completed", "cancelled", "absent"],
  default: "booked"
  },
  tokenNumber: {
  type: Number
  }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);