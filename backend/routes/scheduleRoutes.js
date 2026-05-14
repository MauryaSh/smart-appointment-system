const express = require("express");
const router = express.Router();

const WeeklySchedule = require("../model/WeeklySchedule");
const DateOverride = require("../model/DateOverride");
const Booking = require("../model/Booking");
const Service = require("../model/Service");

function getDayName(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long"
  });
}

// SLOT GENERATOR
function generateSlots(start, end, duration) {
  const slots = [];
  let current = start;

  while (current + duration <= end) {
    slots.push({
      startTime: current,
      endTime: current + duration
    });
    current += duration;
  }

  return slots;
}

router.get("/available", async (req, res) => {
  try {
    const { serviceId, date } = req.query;

    let shifts = [];

    // 🔴 STEP 1: Override check
    const override = await DateOverride.findOne({ serviceId, date });

    if (override) {
      if (override.isCancelled) return res.json([]);
      shifts = override.shifts;
    } else {
      // 🟢 STEP 2: Weekly fallback
      const day = getDayName(date);

      const weekly = await WeeklySchedule.find({
        serviceId,
        dayOfWeek: day
      });

      shifts = weekly.flatMap(w => w.shifts);
    }

    // 🔥 STEP 3: Get service details
    const service = await Service.findById(serviceId);
    const duration = service.duration;
    const capacity = service.capacity || 1;

    let finalSlots = [];

    // 🔥 STEP 4: Generate slots + check bookings
    for (let shift of shifts) {

      const slots = generateSlots(
        parseInt(shift.startTime),
        parseInt(shift.endTime),
        duration
      );

      for (let slot of slots) {

        const bookingCount = await Booking.countDocuments({
          serviceId,
          date,
          "segment.startTime": slot.startTime
        });

        finalSlots.push({
          ...slot,
          booked: bookingCount,
          available: capacity - bookingCount,
          isFull: bookingCount >= capacity
        });
      }
    }

    res.json(finalSlots);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= SAVE OVERRIDE =================
router.post("/override", async (req, res) => {
  try {
    const { serviceId, date, shifts, isCancelled } = req.body;

    if (!serviceId || !date) {
      return res.status(400).json({ msg: "Missing data" });
    }

    // delete old override (if exists)
    await DateOverride.findOneAndDelete({ serviceId, date });

    // create new override
    const override = await DateOverride.create({
      serviceId,
      date,
      shifts: isCancelled ? [] : shifts,
      isCancelled
    });

    res.json({
      msg: "Override saved successfully",
      override
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// ================= SAVE WEEKLY =================
router.post("/weekly", async (req, res) => {
  try {
    const { serviceId, weekly } = req.body;

    if (!serviceId || !weekly) {
      return res.status(400).json({ msg: "Missing data" });
    }

    // 🧹 delete old weekly
    await WeeklySchedule.deleteMany({ serviceId });

    // 📦 prepare new docs
    const docs = [];

    for (let day in weekly) {
      docs.push({
        serviceId,
        dayOfWeek: day,
        shifts: weekly[day]
      });
    }

    // 💾 insert
    await WeeklySchedule.insertMany(docs);

    res.json({ msg: "Weekly schedule saved successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;