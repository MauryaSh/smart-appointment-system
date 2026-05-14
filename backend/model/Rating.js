const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking"
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service"
  },

  spId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  // 🔥 SLOT IDENTIFICATION
  date: String,
  startTime: String,
  endTime: String,

  rating: {
    type: Number,
    min: 1,
    max: 5
  }

}, { timestamps: true });

module.exports = mongoose.model("Rating", ratingSchema);