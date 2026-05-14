const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({

  spId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service"
  },

  date: Date,

  startTime: String,
  endTime: String,

  status: {
    type: String,
    enum: ["active", "cancelled"],
    default: "active"
  }

});

module.exports = mongoose.model("Shift", shiftSchema);