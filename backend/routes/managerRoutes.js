const express = require("express");
const router = express.Router();
const User = require("../model/User");


// GET all service   providers
// ALL service providers for manager dashboard
router.get("/providers", async (req, res) => {
 try {
  const providers = await User.find({
   role: "sp"
  });
  res.json(providers);
 } catch (err) {
  res.status(500).json({ error: err.message });
 }
});

// APPROVE provider
router.put("/approve/:id", async(req,res)=>{
  
  const provider = await User.findByIdAndUpdate(
    req.params.id,
    {status:"approved"},
    {new:true}
  )

  res.json({
    message:"Provider approved",
    provider
  })
})

// REJECT provider
router.put("/reject/:id", async(req,res)=>{
  
  const provider = await User.findByIdAndUpdate(
    req.params.id,
    {status:"rejected"},
    {new:true}
  )

  res.json({
    message:"Provider rejected",
    provider
  })
})

//APPROVED PROVIDER ON SERVICE PROVIDER PAGE OF MANAGER SIDEBAR
router.get("/pending-providers", async(req,res)=>{
 try{

 const providers = await User.find({
  role:"sp",
  status:"pending"
 })

 res.json(providers)

 }catch(err){
  res.status(500).json({error:err.message})
 }
})

// CATEGORICAL PIE CHART
router.get("/category-stats", async (req, res) => {

  const categories = [
    "Food",
    "Medical",
    "Salon",
    "Spa",
    "Consultancy"
  ];

  const result = [];

  for (let cat of categories) {

    const count = await User.countDocuments({
      role: "sp",
      category: cat,
      status: "approved"
    });

    result.push({
      name: cat,
      value: count
    });

  }

  res.json(result);

});

//stat API
// GET dashboard stats
router.get("/stats", async (req, res) => {

try {
  const totalVisitors = await User.countDocuments();

  const totalUsers = await User.countDocuments({ role: { $in: ["user", "customer"] } });

  const totalSP = await User.countDocuments({ role: "sp" });

  res.json({
    totalVisitors,
    totalUsers,
    totalSP
  });

} catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Manager API to see Flagged Providers
router.get("/flagged-providers", async(req,res)=>{

 const providers = await User.find({
  role:"sp",
  flagged:true
 })

 res.json(providers)

})

//Manager can Reset Complaint
router.put("/reset-complaints/:id", async(req,res)=>{

 const provider = await User.findByIdAndUpdate(
  req.params.id,
  {complaints:0, flagged:false},
  {new:true}
 )

 res.json(provider)

})

// Update Manager Settings Page API
const Settings = require("../model/SystemSettings")

router.put("/settings", async(req,res)=>{

 const {warningThreshold, suspendThreshold} = req.body

 const settings = await Settings.findOneAndUpdate(
   {},
   {warningThreshold, suspendThreshold},
   {new:true}
 )

 res.json(settings)

})

// SP with complaints
router.get("/providers-with-complaints", async(req,res)=>{
 const providers = await User.find({
  role:"sp"
 }).select("name email complaints flagged status")

 res.json(providers)

})

// approved providers for Service provider on manager dashboard
router.get("/approved-providers", async(req,res)=>{

 const providers = await User.find({
  role:"sp",
  status:"approved"
 })

 res.json(providers)

})

module.exports = router