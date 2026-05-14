const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Booking = require("../model/Booking");
const Segment = require("../model/Segment");
const Service = require("../model/Service");
const WeeklySchedule = require("../model/WeeklySchedule");
const DateOverride = require("../model/DateOverride");
const Rating = require("../model/Rating"); 
const authMiddleware = require("../middleware/authMiddleware");

// helper
function getDayName(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long"
  });
}

// ================= CREATE BOOKING =================
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { serviceId, date, startTime, endTime } = req.body;

    if (!serviceId || !date || !startTime || !endTime) {
      return res.status(400).json({ msg: "Missing booking data" });
    }

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ msg: "Service not found" });
    }

    let shifts = [];

    // 🔴 1. CHECK OVERRIDE
    const override = await DateOverride.findOne({ serviceId, date });

    if (override) {
      if (override.isCancelled) {
        return res.status(400).json({ msg: "Day is unavailable" });
      }
      shifts = override.shifts;
    } else {
      // 🟢 2. WEEKLY FALLBACK
      const day = getDayName(date);

      const weekly = await WeeklySchedule.find({
        serviceId,
        dayOfWeek: day
      });

      shifts = weekly.flatMap(w => w.shifts);
    }

    // ❌ NO SHIFTS
    if (!shifts.length) {
      return res.status(400).json({ msg: "No availability for this date" });
    }

    // 🟡 3. VALIDATE SLOT INSIDE SHIFT
    const isValid = shifts.some(shift => {
      return (
        startTime >= shift.startTime &&
        endTime <= shift.endTime
      );
    });

    if (!isValid) {
      return res.status(400).json({ msg: "Invalid slot selected" });
    }

    // 🟣 4. CREATE / FIND SEGMENT (DYNAMIC)
    let segment = await Segment.findOne({
      serviceId,
      date,
      startTime,
      endTime
    });

    if (!segment) {
      segment = await Segment.create({
        serviceId,
        date,
        startTime,
        endTime,
        capacity: service.maxCustomers,
        booked: 0
      });
    }

    // 🔵 5. PREVENT OVERBOOKING (ATOMIC)
    const updated = await Segment.findOneAndUpdate(
      {
        _id: segment._id,
        booked: { $lt: segment.capacity }
      },
      { $inc: { booked: 1 } },
      { new: true }
    );

    if (!updated) {
      return res.status(400).json({ msg: "Slot just got full" });
    }

    // 🟢 6. TOKEN NUMBER
  const tokenNumber = await Booking.countDocuments({
  serviceId,
  date,
  startTime
  }) + 1;
    // 🟠 7. CREATE BOOKING
    const booking = await Booking.create({
      userId: req.user.id,
      serviceId,
      segmentId: segment._id,
      spId: service.spId,
      date,
      startTime,
      endTime,
      tokenNumber
    });

    res.json(booking);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= GET MY BOOKINGS =================
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user.id
    })
      .populate({
        path: "serviceId",
        populate: { path: "spId", select: "name rating" }
      })
      .populate("segmentId");

    // 🔥 ADD THIS BLOCK
    const ratings = await Rating.find({ userId: req.user.id });

    const ratedBookingIds = ratings.map(r => r.bookingId.toString());

    const updatedBookings = bookings.map(b => ({
      ...b._doc,
      isRated: ratedBookingIds.includes(b._id.toString())
    }));

    res.json(updatedBookings);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= CANCEL BOOKING =================
router.post("/cancel/:id", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    // ❗ Only owner can cancel
    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    // reduce booked count
    await Segment.findByIdAndUpdate(
      booking.segmentId,
      { $inc: { booked: -1 } }
    );

    // ✅ CHANGE STATUS INSTEAD OF DELETE
    booking.status = "cancelled";
    await booking.save();

    res.json({ msg: "Booking cancelled", booking });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= SP VIEW BOOKINGS =================
router.get("/sp", authMiddleware, async (req, res) => {
  try {
    console.log("Logged in SP ID:", req.user.id);

    const bookings = await Booking.find({
      spId: req.user.id   // ✅ REMOVE ObjectId conversion
    })
      .populate("userId", "name")
      .populate({
        path: "serviceId",
        populate: {
          path: "spId",
          select: "name"
        }
      });

    console.log("Bookings found:", bookings.length);

    res.json(bookings);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= UPDATE STATUS =================
router.put("/status/:id", authMiddleware, async (req, res) => {
  try {
    let { status } = req.body;

    // 🔥 normalize (IMPORTANT)
    status = status.toLowerCase();

    const allowed = ["completed", "cancelled", "absent"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, spId: req.user.id },
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    res.json(booking);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;