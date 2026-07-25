const express = require("express");

const router = express.Router();

const SafetyTip = require("../models/SafetyTip");

// ===============================
// ADD SAFETY TIP
// ===============================

router.post("/add", async (req, res) => {
  try {
    const { title, description, category, icon } = req.body;

    const newTip = await SafetyTip.create({
      title,
      description,
      category,
      icon,
    });

    res.status(201).json({
      success: true,
      message: "Safety Tip Added",
      tip: newTip,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ===============================
// GET ALL TIPS
// ===============================

router.get("/", async (req, res) => {
  try {
    const tips = await SafetyTip.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      tips,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
