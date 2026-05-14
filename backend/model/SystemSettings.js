const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({

  warningThreshold:{
    type:Number,
    default:5
  },

  suspendThreshold:{
    type:Number,
    default:10
  }

})

module.exports = mongoose.model("SystemSettings",settingsSchema)