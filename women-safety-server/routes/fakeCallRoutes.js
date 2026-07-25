const express = require("express");
const router = express.Router();

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// Save Fake Call Settings

router.put("/save", authMiddleware, async (req, res) => {
  try {
    const { fakeCallName, fakeCallNumber } = req.body;

    const user = await User.findById(req.user.id);

    user.fakeCallName = fakeCallName;
    user.fakeCallNumber = fakeCallNumber;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Fake Call Settings Saved",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Get Fake Call Settings

router.get("/settings", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,

      fakeCallName: user.fakeCallName,

      fakeCallNumber: user.fakeCallNumber,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
