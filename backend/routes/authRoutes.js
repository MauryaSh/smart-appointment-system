const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, role, businessName, category, address } = req.body;

    // if required fields are missing
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    const allowedRoles = ["user", "sp"];
    if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role selected" });
  }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      businessName,
      category,
      address
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });

  } catch (error) {
    res.status(500).json({ 
    message: "Server error",
    error: error.message
});
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // if required fields are missing
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    if(user.role === "sp" && user.status === "pending"){
 return res.status(403).json({
  message:"Your account is waiting for manager approval"
 })
}

if(user.role === "sp" && user.status === "rejected"){
 return res.status(403).json({
  message:"Your account was rejected"
 })
}

if(user.role === "sp" && user.status === "suspended"){
 return res.status(403).json({
  message:"Account suspended due to complaints"
 })
}
   
    // Success response
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" }); // if server fails
  }
});

// UPLOAD PROFILE IMAGE
router.post(
  "/upload-profile",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {

      if (!req.file) {
        return res.status(400).json({ msg: "No file uploaded" });
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { profileImage: req.file.filename },
        { new: true }
      );

      res.json(user);

    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: err.message });
    }
  }
);

// CHANGE P/W
router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Old password incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    await user.save();

    res.json({ msg: "Password updated" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET CURRENT USER
router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

module.exports = router;
