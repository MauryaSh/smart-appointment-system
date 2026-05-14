const express = require("express");
const router = express.Router();
const Service = require("../model/Service");
const Shift = require("../model/Shift");
const Segment = require("../model/Segment");
const generateSegments = require("../utils/generateSegments");
const authMiddleware = require("../middleware/authMiddleware");

// ADD SERVICE
router.post("/add", authMiddleware, async (req, res) => {

 try {

  const service = new Service({
  ...req.body,
  spId: req.user.id
});

  await service.save();

  res.json(service);

 } catch (err) {

  res.status(500).json({ error: err.message });

 }

});


// GET SERVICES OF LOGGED IN PROVIDER
router.get("/my-services", authMiddleware, async (req, res) => {
  try {
    const services = await Service.find({
      spId: req.user.id
    });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE SERVICE
router.delete("/delete/:id", authMiddleware, async (req, res) => {

 try {

  await Service.findOneAndDelete({
   _id: req.params.id,
   spId: req.user.id
  });

  res.json({ message: "Service deleted" });

 } catch (err) {

  res.status(500).json({ error: err.message });

 }

});


// UPDATE SERVICE
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {

    // Update service
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, spId: req.user.id },
      req.body,
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ msg: "Service not found" });
    }

    // Find all shifts of this service
    const shifts = await Shift.find({ serviceId: service._id });

    for (const shift of shifts) {

      // Remove old segments
      await Segment.deleteMany({ shiftId: shift._id });

      // Generate new segments
      const segments = generateSegments(
        shift.startTime,
        shift.endTime,
        service
      );

      const segmentDocs = segments.map(seg => ({
        shiftId: shift._id,
        serviceId: service._id,
        startTime: seg.startTime,
        endTime: seg.endTime,
        capacity: service.maxCustomers,
        booked: 0
      }));

      // Insert new segments
      if (segmentDocs.length > 0) {
        await Segment.insertMany(segmentDocs);
      }
    }

    res.json({
      msg: "Service updated and segments regenerated",
      service
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL SERVICES (FOR USERS)
router.get("/all", async (req, res) => {
  try {
    const services = await Service.find()
      .populate("spId", "name");

    const Rating = require("../model/Rating");

    const result = [];

    for (let service of services) {

      // ⭐ ratings of this service
      const serviceRatings = await Rating.find({
        serviceId: service._id
      });

      let avgRating = 0;
      let totalReviews = serviceRatings.length;

      if (totalReviews > 0) {
        avgRating =
          serviceRatings.reduce((sum, r) => sum + r.rating, 0) /
          totalReviews;
      } else {
        // 🔥 fallback → SP rating
        const spRatings = await Rating.find({
          spId: service.spId
        });

        if (spRatings.length > 0) {
          avgRating =
            spRatings.reduce((sum, r) => sum + r.rating, 0) /
            spRatings.length;
        }
      }

      result.push({
        ...service.toObject(),
        avgRating: Number(avgRating.toFixed(1)),
        totalReviews
      });
    }

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔍 SEARCH + FILTER SERVICES
router.get("/search", async (req, res) => {
  try {
    const { search, category, sort, address } = req.query;

    let filter = {};
    let sortOption = {};

    // 🔍 Service Name Search
    if (search && search.trim() !== "") {
      filter.name = { $regex: search, $options: "i" };
    }

    // 📂 Category
    if (category && category !== "") {
      filter.category = { $regex: `^${category}$`, $options: "i" };
    }

    // 💰 Sorting
    if (sort === "lowToHigh") sortOption.price = 1;
    if (sort === "highToLow") sortOption.price = -1;
    if (sort === "rating") sortOption.rating = -1;

    // 🔥 MAIN FIX (address filter via provider)
    const services = await Service.find(filter)
      .populate({
        path: "spId",
        match: address && address.trim() !== ""
          ? { address: { $regex: address, $options: "i" } }
          : {},
        select: "name address"
      })
      .sort(sortOption);

    // ❗ remove unmatched providers (IMPORTANT)
    const finalServices = address
      ? services.filter(s => s.spId !== null)
      : services;

    const Rating = require("../model/Rating");

const result = [];

for (let service of finalServices) {

  // ⭐ ratings of this service
  const serviceRatings = await Rating.find({
    serviceId: service._id
  });

  let avgRating = 0;
  let totalReviews = serviceRatings.length;

  if (totalReviews > 0) {
    avgRating =
      serviceRatings.reduce((sum, r) => sum + r.rating, 0) /
      totalReviews;
  } else {
    // 🔥 fallback → SP rating
    const spRatings = await Rating.find({
      spId: service.spId._id   // ⚠ IMPORTANT FIX
    });

    if (spRatings.length > 0) {
      avgRating =
        spRatings.reduce((sum, r) => sum + r.rating, 0) /
        spRatings.length;
    }
  }

  result.push({
    ...service.toObject(),
    avgRating: Number(avgRating.toFixed(1)),
    totalReviews
  });
}

res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;