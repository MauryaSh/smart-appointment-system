const router = require("express").Router();
const Notification = require("../models/Notification");

router.get("/sp/:spId", async (req, res) => {

  const notifications = await Notification.find({
    spId: req.params.spId
  }).sort({ createdAt: -1 });

  res.json(notifications);
});

module.exports = router;