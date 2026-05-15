const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./model/User");
const Settings = require("./model/SystemSettings");

//FOR SERVICE PROVIDERS PANEL
const serviceRoutes = require("./routes/serviceRoutes")
const spRoutes = require("./routes/spRoutes")
const slotRoutes = require("./routes/slotRoutes")
const shiftRoutes = require("./routes/shiftRoutes")
const complaintRoutes= require("./routes/complaintRoutes")
const scheduleRoutes = require("./routes/scheduleRoutes");

//FOR USER PANEL
const segmentRoutes = require("./routes/segmentRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(cors({
  origin: "https://smartappointm.netlify.app",
  credentials: true
}));
app.use(express.json());

/* ===== CREATE DEFAULT MANAGER ===== */

const createDefaultManager = async () => {

  const managerExists = await User.findOne({ role: "manager" });

  if (!managerExists) {

    const hashedPassword = await bcrypt.hash("manager123", 10);

    await User.create({
      name: "Admin Manager",
      email: "manager@gmail.com",
      password: hashedPassword,
      role: "manager",
      status: "approved"
    });

    console.log("✅ Default Manager Created");
  }
};

/* ===== CREATE DEFAULT SETTINGS ===== */

const createDefaultSettings = async () => {

  const exists = await Settings.findOne();

  if (!exists) {

    await Settings.create({
      warningThreshold: 5,
      suspendThreshold: 10
    });

    console.log("⚙️ Default System Settings Created");
  }

};

/* ===== DATABASE CONNECTION ===== */

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {

    console.log("MongoDB Connected");

    await createDefaultManager();
    await createDefaultSettings();

  })
  .catch(err => console.log(err));
  
/* ===== ROUTES ===== */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/manager", require("./routes/managerRoutes"));

app.use("/api/services",serviceRoutes)
app.use("/api/sp",spRoutes)
app.use("/api/slots", slotRoutes)
app.use("/api/shifts",shiftRoutes)
app.use("/api/segments", segmentRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/ratings", require("./routes/ratingRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/uploads", express.static("uploads"));

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});