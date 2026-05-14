const express = require("express");
const {
  createComplaint,
  getSPComplaints,
  updateComplaintStatus
} = require("../controllers/complaintController");

const router = express.Router();

// USER → create complaint
router.post("/create", createComplaint);

// SP → view complaints
router.get("/sp/:spId", getSPComplaints);

// SP → resolve / reject
router.put("/update/:id", updateComplaintStatus);

module.exports = router;