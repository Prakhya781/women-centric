const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendEmail"); 
const { v4: uuidv4 } = require("uuid");
const Location = require("../models/Location");



router.post("/activate", authMiddleware, async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;

    const user = await User.findById(req.user.id);
      if (user.sosActive) {
      return res.json({
        success: false,
        message: "SOS is already active. Deactivate it first.",
      });
    }

    user.sosActive = true;
user.currentLocation = address;
user.latitude = latitude;
user.longitude = longitude;
user.address = address;
user.online = true;
user.lastSeen = new Date().toLocaleString();
user.sosStartedAt = new Date();
user.liveLocationEnabled = true;
user.trackingToken = uuidv4();
user.trackingEnabled = true;
user.trackingStartedAt = new Date();

await user.save();   // ek hi save

await Location.findOneAndUpdate(
    {
        womanId: user._id,
    },
    {
        womanId: user._id,
        latitude,
        longitude,
        updatedAt: new Date(),
    },
    {
        upsert: true,
    }
);

const trackingLink = `http://localhost:3000/track/${user.trackingToken}`;
    const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

    // Guardian Mail

    if (user.guardianEmail) {
  sendEmail(
    user.guardianEmail,
    "🚨 SOS ALERT - SafeHer",
    `<h1>Emergency Alert</h1><p>${user.name} has activated SOS.</p><p><b>Current Address:</b> ${address}</p><p><a href="${mapLink}">Open Current Location</a></p><p><a href="${trackingLink}">Track Live Location</a></p>`
  );
}

    // Woman Mail
sendEmail(
  user.email,
  "SOS Activated",
  `<h2>SOS Activated Successfully</h2><p>Your guardian has been notified.</p>`
);
    res.json({
      success: true,
      message: "SOS Activated",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
    });
  }
});
router.post("/deactivate", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.sosActive = false;
    user.liveLocationEnabled = false;
    user.sosEndedAt = new Date();
    user.trackingEnabled = false;
user.trackingToken = null;

    await user.save();

    // Guardian Email
    if (user.guardianEmail) {
  sendEmail(
    user.guardianEmail,
    "✅ SOS Ended - SafeHer",
    `<h2>SOS Ended</h2><p>${user.name} has marked themselves safe.</p><p>The emergency session has ended.</p>`
  );
}
    res.json({
      success: true,
      message: "SOS Deactivated Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to deactivate SOS",
    });
  }
});
router.post("/trigger", authMiddleware, async (req, res) => {
  try {
    const { message, location } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Activate SOS
    user.sosActive = true;
    user.online = true;
    user.lastSeen = new Date().toLocaleString();
    user.sosStartedAt = new Date();
    user.liveLocationEnabled = true;

    // Save real coordinates so Guardian side gets correct location
    if (location?.lat && location?.lng) {
      user.latitude = location.lat;
      user.longitude = location.lng;
    }
    user.trackingToken = uuidv4();
user.trackingEnabled = true;
user.trackingStartedAt = new Date();

    await user.save();
    await Location.findOneAndUpdate(
    {
        womanId: user._id,
    },
    {
        womanId: user._id,
        latitude: location.lat,
        longitude: location.lng,
        updatedAt: new Date(),
    },
    {
        upsert: true,
    }
);

    await Notification.create({
      userId: user._id,
      title: "SOS Activated",
      message: "Emergency SOS has been activated successfully.",
      type: "SOS",
    });

    const mapLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
    const trackingLink = `http://localhost:3000/track/${user.trackingToken}`;

    // ================= GUARDIAN EMAIL =================
    if (user.guardianEmail) {
  sendEmail(
    user.guardianEmail,
    "🚨 EMERGENCY SOS ALERT - SafeHer",
    `<div style="font-family: Arial; padding:20px;"><h1 style="color:red;">Emergency SOS Alert</h1><p><b>${user.name}</b> may be in danger.</p><p><b>Situation:</b> ${message}</p><p><b>Current Coordinates:</b> ${location.lat}, ${location.lng}</p><br/><a href="${mapLink}" style="background:#ef4444;color:white;padding:12px 20px;text-decoration:none;border-radius:8px;display:inline-block;margin-right:10px;">Open Live Location</a><a href="${trackingLink}" style="background:#2563eb;padding:14px 28px;border-radius:8px;color:white;text-decoration:none;font-weight:bold;display:inline-block;">📍 Track Live Location</a></div>`
  );
}

    // ================= USER EMAIL =================
     sendEmail(
  user.email,
  "SOS Activated Successfully",
  `<div style="font-family: Arial; padding:20px;"><h2 style="color:#ef4444;">SOS Activated</h2><p>Your guardian has been notified successfully.</p><p>Stay calm. Help is on the way.</p></div>`
);

res.status(200).json({
  success: true,
  message: "SOS Activated & Guardian Alert Sent",
});

    
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;
