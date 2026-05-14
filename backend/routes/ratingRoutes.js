const express = require("express");
const router = express.Router();

const Rating = require("../model/Rating");
const Booking = require("../model/Booking");
const Service = require("../model/Service");

const authMiddleware = require("../middleware/authMiddleware");

// ⭐ ADD / UPDATE RATING
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { bookingId, rating } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    // ❗ Only owner
    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    // ❗ Only completed or cancelled
    if (
      booking.status !== "completed" &&
      booking.status !== "cancelled"
    ) {
      return res.status(400).json({
        msg: "Rating allowed only after completion or cancellation"
      });
    }

    // ❗ Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        msg: "Rating must be between 1 and 5"
      });
    }

    // 🔴 1. BLOCK SAME SLOT RATING
    const sameSlot = await Rating.findOne({
      bookingId
    });

    if (sameSlot) {
      return res.status(400).json({
        msg: "Rating already submitted for this slot"
      });
    }

    // 🔵 2. CHECK EXISTING RATING FOR SAME SERVICE+USER+SP
    const existing = await Rating.findOne({
      userId: req.user.id,
      serviceId: booking.serviceId,
      spId: booking.spId
    });

    let ratingDoc;

    if (existing) {
      // 🔁 UPDATE (overwrite)
      existing.rating = rating;
      existing.bookingId = booking._id;
      existing.date = booking.date;
      existing.startTime = booking.startTime;
      existing.endTime = booking.endTime;

      ratingDoc = await existing.save();

    } else {
      // ✅ CREATE NEW
      ratingDoc = await Rating.create({
        bookingId: booking._id,
        userId: req.user.id,
        serviceId: booking.serviceId,
        spId: booking.spId,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        rating
      });
    }

    // ⭐ UPDATE AVG RATING
    const allRatings = await Rating.find({
      serviceId: booking.serviceId
    });

    const avg =
      allRatings.reduce((acc, r) => acc + r.rating, 0) /
      allRatings.length;

    await Service.findByIdAndUpdate(booking.serviceId, {
      rating: Number(avg.toFixed(1))
    });

    res.json(ratingDoc);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;