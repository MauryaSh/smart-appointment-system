const express = require("express");
const router = express.Router();

const User = require("../model/User");
const Booking = require("../model/Booking");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ GET PROFILE + STATS
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    // 📊 STATS
    const total = await Booking.countDocuments({ userId: req.user.id });

    const completed = await Booking.countDocuments({
      userId: req.user.id,
      status: "completed"
    });

    const cancelled = await Booking.countDocuments({
      userId: req.user.id,
      status: "cancelled"
    });

    const active = await Booking.countDocuments({
      userId: req.user.id,
      status: "booked"
    });

    res.json({
      user,
      stats: { total, completed, cancelled, active }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE PROFILE
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address },
      { new: true }
    ).select("-password");

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;