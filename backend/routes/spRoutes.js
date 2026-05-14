const express = require("express");
const router = express.Router();
const Service = require("../model/Service");

/* Get services of a provider */
router.get("/services/:id", async(req,res)=>{

const services = await Service.find({
providerId:req.params.id
})

res.json(services)

})

module.exports = router;