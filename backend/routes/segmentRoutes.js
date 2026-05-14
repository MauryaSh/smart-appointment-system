const express = require("express");
const router = express.Router();
const WeeklySchedule = require("../model/WeeklySchedule");
const DateOverride = require("../model/DateOverride");
const Segment = require("../model/Segment");
const Booking = require("../model/Booking");
const Service = require("../model/Service");

function getDayName(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long"
  });
}

router.get("/available", async (req, res) => {
  try {
    const { serviceId, date } = req.query;

    let shifts = [];

    const override = await DateOverride.findOne({ serviceId, date });

    if (override) {
      if (override.isCancelled) return res.json([]);
      shifts = override.shifts;
    } else {
      const day = new Date(date).toLocaleDateString("en-US", {
        weekday: "long"
      });

      const weekly = await WeeklySchedule.find({
        serviceId,
        dayOfWeek: day
      });

      shifts = weekly.flatMap(w => w.shifts);
    }

    // 🔥 SLOT GENERATION
const slots = [];
const service = await Service.findById(serviceId);

for (let shift of shifts) {
let start = shift.startTime;
let end = shift.endTime;

if (typeof start === "string" && start.includes(":")) {
  start = parseInt(start.split(":")[0]);
} else {
  start = parseInt(start);
}

if (typeof end === "string" && end.includes(":")) {
  end = parseInt(end.split(":")[0]);
} else {
  end = parseInt(end);
}

  for (let i = start; i < end; i++) {
    const startTime = `${i}:00`;
    const endTime = `${i + 1}:00`;

    // check existing segment
    let segment = await Segment.findOne({
      serviceId,
      date,
      startTime,
      endTime
    });

    const capacity = service.maxCustomers;
    
    const booked = await Booking.countDocuments({
      serviceId,
      date,
      startTime,
      endTime
    });

    const available = capacity - booked;

    slots.push({
      startTime,
      endTime,
      capacity,
      booked,
      available,
      isFull: available <= 0
    });
  }
}

    res.json(slots);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;