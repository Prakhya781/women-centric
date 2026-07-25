const express = require("express");
const router = express.Router();

const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/alert", authMiddleware, async (req, res) => {
  try {
    const { message, riskLevel, location } = req.body;

    // logged in woman
    const womanUser = await User.findById(req.user.id);

    if (!womanUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!womanUser.guardianEmail) {
      return res.status(400).json({
        success: false,
        message: "No guardian linked",
      });
    }

    const mapLink = location
      ? `https://maps.google.com/?q=${location.lat},${location.lng}`
      : "Location unavailable";

    await sendEmail(
      womanUser.guardianEmail,
      "🚨 SAFEHER EMERGENCY ALERT",

      `
Risk Level: ${riskLevel}

Woman: ${womanUser.name}

Situation:
${message}

Location:
${mapLink}

Please contact immediately.
`,
    );

    res.json({
      success: true,
      message: "Guardian Notified Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to notify guardian",
    });
  }
});

module.exports = router;
