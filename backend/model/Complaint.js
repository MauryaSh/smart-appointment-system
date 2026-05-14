const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  spId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  message: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["Delay", "Behavior", "Service Quality", "Other"],
    default: "Other"
  },
  status: {
    type: String,
    enum: ["Pending", "Resolved", "Rejected"],
    default: "Pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);