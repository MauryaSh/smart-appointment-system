const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: String,
  password: {
    type: String,
    required: true
  },
  role: {
 type: String,
 enum: ["user","sp","manager"],
 default:"user"
},

  businessName: String,

  category: String,
  
  address: String,

  status: {
  type: String,
  enum: ["pending","approved","rejected","suspended"],
  default: "pending"
  },
  complaints:{
  type:Number,
  default:0
  },

  flagged:{
  type:Boolean,
  default:false
  },
  profileImage: {
  type: String,
  default: ""
}
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
