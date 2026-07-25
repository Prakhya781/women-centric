const express = require("express");
const router = express.Router();
const AIProtection = require("../models/AIProtection");

const User = require("../models/User");
const Incident = require("../models/Incident");
const Notification = require("../models/Notification");

const authMiddleware = require("../middleware/authMiddleware");
router.get("/status", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (
      user.liveLocationEnabled &&
      user.locationSharingEndTime &&
      new Date() > user.locationSharingEndTime
    ) {
      user.liveLocationEnabled = false;
      user.locationStartedAt = null;
      user.locationSharingEndTime = null;
    }

    const recentReports = await Incident.countDocuments({
      userId: req.user.id,
    });

    const unreadNotifications = await Notification.countDocuments({
      userId: req.user.id,
      isRead: false,
    });

    let safetyStatus = "SAFE";
    let safetyMessage = "All Systems Normal";

    if (user.sosActive) {
      safetyStatus = "EMERGENCY";
      safetyMessage = "SOS Active";
    } else if (recentReports > 0) {
      safetyStatus = "CAUTION";
      safetyMessage = "Recent Incident Reported";
    }

    // PERSIST computed status so Guardian side can read it directly
    user.safetyStatus = safetyStatus;
    await user.save();

    let minutesLive = 0;

    if (user.liveLocationEnabled && user.locationStartedAt) {
      minutesLive = Math.floor(
        (Date.now() - new Date(user.locationStartedAt).getTime()) / 60000,
      );
    }

    const aiProtection = await AIProtection.findOne({
      userId: req.user.id,
    });

    res.json({
      safetyStatus,
      safetyMessage,

      sosActive: user.sosActive,

      liveLocationEnabled: user.liveLocationEnabled || false,

      guardianCount: user.guardianEmail ? 1 : 0,

      unreadNotifications,

      recentReports,

      minutesLive,

      aiProtectionStatus: {
        keywordAlert: aiProtection?.keywordAlert || false,
        shakeDetection: aiProtection?.shakeDetection || false,
        movementTracking: aiProtection?.movementTracking || false,
        riskLevel: aiProtection?.riskLevel || "LOW",
        lastAnalyzedAt: aiProtection?.lastAnalyzedAt || null,
      },

      safetyTip:
        "Always trust your instincts. If something feels wrong, leave immediately.",

      batteryLevel: user.battery || 0,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error fetching dashboard",
    });
  }
});

module.exports = router;
