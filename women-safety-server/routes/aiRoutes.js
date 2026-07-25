const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const analyzeSituation = require("../services/aiService");
const authMiddleware = require("../middleware/authMiddleware");
const AIProtection = require("../models/AIProtection");

router.post("/analyze", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    const text = message.toLowerCase();

    let riskLevel = "LOW";

    let suggestion =
      "Situation looks safe. Stay alert and aware of surroundings.";

    let shouldTriggerSOS = false;

    let nearbyHelpNeeded = false;

    let tips = [
      "Stay aware of your surroundings",
      "Keep your phone charged",
      "Share your location with trusted contacts",
    ];

    // ================= HIGH RISK =================

    if (
      text.includes("follow") ||
      text.includes("kidnap") ||
      text.includes("attack") ||
      text.includes("harass") ||
      text.includes("rape") ||
      text.includes("unsafe") ||
      text.includes("danger") ||
      text.includes("stalking") ||
      text.includes("help me") ||
      text.includes("threat") ||
      text.includes("man following") ||
      text.includes("someone behind me")
    ) {
      await Notification.create({
        userId: req.user.id,

        title: "High Risk Detected",

        message: "AI detected a potentially dangerous situation.",

        type: "AI",
      });
      riskLevel = "HIGH";
      if (riskLevel === "HIGH" || shouldTriggerSOS) {
  user.keywordAlertActive = true;
  user.lastKeywordAlertAt = new Date();
  await user.save();
}

      suggestion =
        "You may be in danger. Move to a crowded place and trigger SOS immediately.";

      shouldTriggerSOS = true;

      nearbyHelpNeeded = true;

      tips = [
        "Call emergency contacts immediately",
        "Move towards crowded or public places",
        "Avoid isolated roads",
        "Keep emergency services ready",
      ];
    }

    // ================= MEDIUM RISK =================
    else if (
      text.includes("cab") ||
      text.includes("alone") ||
      text.includes("night") ||
      text.includes("lost") ||
      text.includes("dark road") ||
      text.includes("scared") ||
      text.includes("suspicious")
    ) {
      riskLevel = "MEDIUM";

      suggestion =
        "Stay cautious. Share your live location with trusted contacts.";

      nearbyHelpNeeded = true;

      tips = [
        "Stay connected with someone trusted",
        "Avoid lonely routes",
        "Use well-lit roads",
        "Be alert",
      ];
    }

    // ================= LOW RISK =================
    else {
      riskLevel = "LOW";

      suggestion = "Situation appears safe. Continue staying alert and aware.";

      tips = [
        "Stay aware of surroundings",
        "Keep phone accessible",
        "Inform someone about your route",
      ];
    }
    await AIProtection.findOneAndUpdate(
  {
    userId: req.user.id,
  },
  {
    keywordAlert: riskLevel !== "LOW",

    shakeDetection: riskLevel === "HIGH",

    movementTracking: true,
    riskLevel: riskLevel,

    lastMessage: message,

    lastAnalyzedAt: new Date(),
  },
  {
    upsert: true,
    new: true,
  }
);

    res.json({
      success: true,
      riskLevel,
      suggestion,
      shouldTriggerSOS,
      nearbyHelpNeeded,
      tips,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "AI Analysis Failed",
    });
  }
});

module.exports = router;
