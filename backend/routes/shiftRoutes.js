const express = require("express");
const router = express.Router();

const {
  createShift,
  getMyShifts,
  cancelShift
} = require("../controllers/shiftController");

const authMiddleware = require("../middleware/authMiddleware");

// Create shift
router.post("/create", authMiddleware, createShift);

// Get provider shifts
router.get("/my-shifts", authMiddleware, getMyShifts);

// Cancel shift
router.put("/cancel/:id", authMiddleware, cancelShift);

module.exports = router;