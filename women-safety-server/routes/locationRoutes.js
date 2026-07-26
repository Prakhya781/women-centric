const express = require("express");
const router = express.Router();

const User = require("../models/User");
const nodemailer = require("nodemailer");
const authMiddleware = require("../middleware/authMiddleware");

// NEW
const {
  updateGuardianLocation,
  updateWomanLocation,
  getWomanLocation,
  deleteWomanLocation,
  getGuardianLocation,
} = require("../controllers/locationController");
const { trackLocation } =
require("../controllers/locationController");

// ================= EMAIL TRANSPORT =================

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000,
});

// ================= UPDATE LOCATION =================

router.put("/update-location", authMiddleware, async (req, res) => {
  try {
    const { latitude, longitude, address, liveLocationEnabled, duration } =
      req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
      if (
      liveLocationEnabled === true &&
      duration &&
      user.liveLocationEnabled
    ) {
      return res.status(400).json({
        success: false,
        message: "Location sharing already active. Stop it first.",
      });
    }

    // Previous status save karo
    const wasAlreadySharing = user.liveLocationEnabled;

    if (!wasAlreadySharing && liveLocationEnabled === true) {
      user.locationStartedAt = new Date();
    }

    if (liveLocationEnabled === false) {
      user.locationStartedAt = null;
      user.locationSharingEndTime = null;
    }

    user.latitude = latitude;
    user.longitude = longitude;
    user.address = address;
    user.currentLocation = address;
    user.online = true;
    user.lastSeen = new Date().toLocaleString();
    user.liveLocationEnabled = liveLocationEnabled;
    user.locationUpdatedAt = new Date();

    if (duration) {
      const endTime = new Date();
      endTime.setMinutes(endTime.getMinutes() + duration);
      user.locationSharingEndTime = endTime;
    }
    // ================= MOVEMENT ANALYSIS =================

let movementAlert = false;

if (user.lastMovementCheck?.latitude && user.lastMovementCheck?.timestamp) {
  const prevLat = user.lastMovementCheck.latitude;
  const prevLng = user.lastMovementCheck.longitude;
  const prevTime = new Date(user.lastMovementCheck.timestamp).getTime();
  const nowTime = Date.now();

  const timeDiffSec = (nowTime - prevTime) / 1000;

  // Haversine distance in meters
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(latitude - prevLat);
  const dLng = toRad(longitude - prevLng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(prevLat)) * Math.cos(toRad(latitude)) * Math.sin(dLng / 2) ** 2;
  const distanceMeters = R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));

  if (timeDiffSec > 0) {
    const speedKmh = (distanceMeters / timeDiffSec) * 3.6;

    // Suspiciously fast (e.g. > 100 km/h while on foot-registered app)
    if (speedKmh > 100) {
      movementAlert = true;
    }
  }

  // Stationary too long (SOS active but not moving for 20+ min) — separately tracked via sosStartedAt
  if (user.sosActive && user.sosStartedAt) {
    const sosMinutes = (nowTime - new Date(user.sosStartedAt).getTime()) / 60000;
    if (sosMinutes > 20 && distanceMeters < 20) {
      movementAlert = true;
    }
  }
}

user.lastMovementCheck = {
  latitude,
  longitude,
  timestamp: new Date(),
};
user.movementAlertActive = movementAlert;
user.movementTrackingActive = liveLocationEnabled === true;

// Agar alert trigger hua, guardian ko notify karo
if (movementAlert && user.guardianEmail) {
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.guardianEmail,
    subject: "⚠️ Unusual Movement Detected - SafeHer",
    html: `
      <h2>Unusual Movement Detected</h2>
      <p>${user.name}'s movement pattern looks unusual — possible risk.</p>
      <p><a href="https://www.google.com/maps?q=${latitude},${longitude}">View Current Location</a></p>
    `,
  }).catch(err => console.log("Movement alert mail failed:", err));
}

    await user.save();
    const Location = require("../models/Location");

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
        new: true,
    }
);

    // ================= SEND MAIL ONLY ON START =================

    if (
      !wasAlreadySharing &&
      liveLocationEnabled === true &&
      user.guardianEmail
    ) {
      const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

       transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.guardianEmail,
        subject: "SafeHer Live Location Started",
        html: `
          <h2>${user.name} started Live Location Sharing</h2>

          <p><b>Current Place:</b> ${address}</p>

          <p><b>Duration:</b> ${duration} minutes</p>

          <p>
            <a href="${mapLink}">
              Open Live Location
            </a>
          </p>
        `,
      }).catch(err => console.log("Mail failed:", err.message));

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Location Sharing Started",
        html: `
          <h2>Location Sharing Active</h2>

          <p>
            Your live location has been shared with
            ${user.guardianEmail}
          </p>

          <p>
            Duration: ${duration} minutes
          </p>
        `,
      }).catch(err => console.log("Mail failed:", err.message));

      console.log("Location mails sent successfully");
    }

    res.status(200).json({
      success: true,
      message: "Location Updated Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// ================= GET CURRENT LOCATION =================

router.get("/current-location", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      location: user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


// ======================================================
//            NEW ROUTES FOR GUARDIAN TRACKING
// ======================================================

// Guardian updates his own location
router.post("/updateGuardian", updateGuardianLocation);

// Woman updates her own location
router.post("/updateWoman", updateWomanLocation);

// Guardian fetches Woman live location


// Woman/Guardian fetch Guardian location
router.get("/track/:token", trackLocation);
router.get("/guardian/:guardianId", getGuardianLocation);
router.get("/:womanId", getWomanLocation);
router.delete("/:womanId", deleteWomanLocation);
console.log("Location Routes Loaded");

module.exports = router;