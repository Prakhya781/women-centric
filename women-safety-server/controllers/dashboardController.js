const User = require("../models/User");
const GuardianLink = require("../models/GuardianLink");
const Notification = require("../models/Notification");
const Incident = require("../models/Incident");

exports.getDashboardStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Safety status
    let safetyStatus = "SAFE";
    let safetyMessage = "You're all good right now.";

    if (user.sosActive) {
      safetyStatus = "EMERGENCY";
      safetyMessage = "SOS is currently active.";
    } else if (user.movementAlertActive) {
      safetyStatus = "CAUTION";
      safetyMessage = "Unusual movement detected.";
    }

    // Guardian count
    const guardianLinksCount = await GuardianLink.countDocuments({
      womanId: userId,
      status: "Accepted",
      isActive: true,
    });

    // Unread notifications
    const unreadNotifications = await Notification.countDocuments({
      userId,
      isread: false,
    });

    // Recent reports (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentReports = await Incident.countDocuments({
      userId,
      createdAt: { $gte: oneDayAgo },
    });

    // Minutes live
    let minutesLive = 0;
    if (user.liveLocationEnabled && user.locationStartedAt) {
      minutesLive = Math.floor(
        (Date.now() - new Date(user.locationStartedAt).getTime()) / 60000
      );
    }

    // Keyword alert — active if a HIGH-risk message was analyzed in last 15 mins
    const fifteenMinAgo = Date.now() - 15 * 60 * 1000;
    const keywordAlert =
      user.keywordAlertActive &&
      user.lastKeywordAlertAt &&
      new Date(user.lastKeywordAlertAt).getTime() > fifteenMinAgo;

    res.json({
      success: true,
      safetyStatus,
      safetyMessage,
      sosActive: user.sosActive,
      liveLocationEnabled: user.liveLocationEnabled,
      guardianCount: guardianLinksCount,
      unreadNotifications,
      recentReports,
      minutesLive,
      batteryLevel: user.battery,
      aiProtectionStatus: {
        keywordAlert,
        shakeDetection: user.shakeDetectionActive,
        movementTracking: user.liveLocationEnabled, // tracking chalu hai jab location share ho rahi ho
      },
      safetyTip: "Always trust your instincts. If something feels wrong, move to a safe place.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};