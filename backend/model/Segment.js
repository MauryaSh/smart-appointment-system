const mongoose = require("mongoose");

const segmentSchema = new mongoose.Schema({

  shiftId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shift"
  },

  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service"
  },
  
  date: String, 
  
  startTime: String,
  endTime: String,

  capacity: Number,
  booked: {
    type: Number,
    default: 0
  },
  status:{
  type:String,
  default:"active"
 }


});

module.exports = mongoose.model("Segment", segmentSchema);