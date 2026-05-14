const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  spId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  name: String,
  category: String,
  price: Number,

  duration: Number, // service duration (minutes)

  schedulingType: {
    type: String,
    enum: ["continuous", "slot"],
    default: "continuous"
  },

  slotDuration: Number, // only for slot-based
  maxCustomers: Number, // queue capacity

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
   capacity: {
  type: Number,
  default: 1
},
address: String,
rating: {
  type: Number,
  default: 0
}
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);