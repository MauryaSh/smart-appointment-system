const Shift = require("../model/Shift");
const Segment = require("../model/Segment");
const Service = require("../model/Service");
const generateSegments = require("../utils/generateSegments");

//create shifts
exports.createShift = async (req, res) => {
  try {

    const { serviceId, date, startTime, endTime } = req.body;

    const shifts = await Shift.find({
      spId: req.user.id,
      serviceId,
      date
    });

    const toMinutes = (time) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    const newStart = toMinutes(startTime);
    const newEnd = toMinutes(endTime);

    let conflict = false;

    for (let shift of shifts) {

      const existingStart = toMinutes(shift.startTime);
      const existingEnd = toMinutes(shift.endTime);

      if (newStart < existingEnd && newEnd > existingStart) {
        conflict = true;
        break;
      }

    }

    if (conflict) {
      return res.status(400).json({
        msg: "Shift overlapped for this service"
      });
    }

    const shift = new Shift({
      spId: req.user.id,
      serviceId,
      date,
      startTime,
      endTime,
      status: "active"
    });

    await shift.save();

    // GET SERVICE
    const service = await Service.findById(serviceId)
    console.log("SERVICE DATA:", service)

    // GENERATE SEGMENTS
    const segments = generateSegments(startTime, endTime, service)
    console.log("GENERATED SEGMENTS:", segments)
    

    const segmentDocs = segments.map(seg => ({
      shiftId: shift._id,
      serviceId: service._id,
      startTime: seg.startTime,
      endTime: seg.endTime,
      capacity: service.maxCustomers
    }))

    await Segment.insertMany(segmentDocs)

    res.json({ msg: "Shift created & segments generated" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getMyShifts = async (req, res) => {

 try{

  const shifts = await Shift.find({
   spId:req.user.id
  }).populate("serviceId");

  res.json(shifts);

 }catch(err){
  res.status(500).json({error:err.message});
 }

};


exports.cancelShift = async (req,res)=>{

 try{

  const shiftId = req.params.id;

  await Shift.findByIdAndUpdate(
   shiftId,
   {status:"cancelled"}
  );

  // ALSO cancel segments

  await Segment.updateMany(
   {shiftId},
   {status:"cancelled"}
  );

  res.json({msg:"Shift cancelled successfully"});

 }catch(err){
  res.status(500).json({error:err.message});
 }

};

//update shifts
exports.updateShift = async (req,res)=>{

 try{

  const shiftId = req.params.id
  const { startTime,endTime } = req.body

  const shift = await Shift.findById(shiftId)

  const service = await Service.findById(shift.serviceId)

  shift.startTime = startTime
  shift.endTime = endTime

  await shift.save()

  // delete old segments
  await Segment.deleteMany({shiftId})

  // generate new segments  
  const segments = generateSegments(startTime,endTime,service)

  const segmentDocs = segments.map(seg=>({
    shiftId,
    serviceId:service._id,
    startTime:seg.startTime,
    endTime:seg.endTime,
    capacity: service.maxCustomers
  }))

  await Segment.insertMany(segmentDocs)

  res.json({msg:"Shift updated & segments regenerated"})

 }catch(err){
  res.status(500).json({error:err.message})
 }

}