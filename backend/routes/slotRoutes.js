const express = require("express");
const router = express.Router();

const Service = require("../model/Service");
const WeeklySchedule = require("../model/WeeklySchedule");
const DateOverride = require("../model/DateOverride");

function getDayName(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long"
  });
}

function generateSlots(start, end, duration) {
  const slots = [];

  let startTime = new Date(`1970-01-01T${start}:00`);
  const endTime = new Date(`1970-01-01T${end}:00`);

  while (startTime < endTime) {
    const next = new Date(startTime.getTime() + duration * 60000);

    if (next <= endTime) {
      slots.push({
        start: startTime.toTimeString().slice(0,5),
        end: next.toTimeString().slice(0,5)
      });
    }

    startTime = next;
  }

  return slots;
}

router.get("/generate", async (req, res) => {
  try {
    const { serviceId, date } = req.query;

    const service = await Service.findById(serviceId);

    let shifts = [];

    // 🔴 1. override check
    const override = await DateOverride.findOne({ serviceId, date });

    if (override) {
      if (override.isCancelled) return res.json([]);
      shifts = override.shifts;
    } else {
      // 🟢 2. weekly fallback
      const day = getDayName(date);

      const weekly = await WeeklySchedule.find({
        serviceId,
        dayOfWeek: day
      });

      shifts = weekly.flatMap(w => w.shifts);
    }

    // 🟣 3. slot generate
    let allSlots = [];

    shifts.forEach(shift => {
      const slots = generateSlots(
        shift.startTime,
        shift.endTime,
        service.slotDuration
      );
      allSlots = [...allSlots, ...slots];
    });

    res.json(allSlots);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;