const Complaint = require("../model/Complaint");
const Booking = require("../model/Booking");


//USER: Raise Complaint
const createComplaint = async (req, res) => {
  try {
    const { bookingId, message, category } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    // ✅ RULE CHECK
    if (
      booking.status !== "completed" &&
      booking.status !== "cancelled"
    ) {
      return res.status(400).json({
        msg: "Complaint allowed only after completion or cancellation"
      });
    }

    // ❗ Prevent duplicate complaint for same booking
    const existing = await Complaint.findOne({ bookingId });

    if (existing) {
      return res.status(400).json({
        msg: "Complaint already submitted for this booking"
      });
    }

    const complaint = await Complaint.create({
      bookingId,
      customerId: booking.userId,
      spId: booking.spId,
      message,
      category
    });

    res.json(complaint);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//SP: Get Complaints
const getSPComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ spId: req.params.spId })
      .populate("customerId", "name")
      .populate("bookingId");

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//SP: Update Status
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  createComplaint,
  getSPComplaints,
  updateComplaintStatus
};