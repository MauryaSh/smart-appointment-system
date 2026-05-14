const User = require("../model/User");

exports.getDashboardStats = async (req, res) => {

const visitors = await User.countDocuments()

const customers = await User.countDocuments({role:"user"})

const users = await User.countDocuments()

res.json({
visitors,
customers,
users
})

}

exports.getPendingSP = async (req,res)=>{

const providers = await User.find({
role:"sp",
status:"pending"
})

res.json(providers)

}

exports.getApprovedSP = async (req,res)=>{

const providers = await User.find({
role:"sp",
status:"approved"
})

res.json(providers)

}

exports.acceptSP = async (req,res)=>{

await User.findByIdAndUpdate(
req.params.id,
{status:"approved"} 
)

res.json({message:"Service Provider Approved"})

}

exports.rejectSP = async (req,res)=>{

await User.findByIdAndUpdate(
req.params.id,
{status:"rejected"}
)

res.json({message:"Service Provider Rejected"})

}