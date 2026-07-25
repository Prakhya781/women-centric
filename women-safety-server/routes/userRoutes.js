const express = require("express");
const router = express.Router();

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const multer = require("multer");
const path = require("path");



// ================= MULTER CONFIG =================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
});

// ================= GET USER =================

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email role profileImage",
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

router.put("/update-battery", authMiddleware, async (req, res) => {
  try {
    const { battery } = req.body;

    await User.findByIdAndUpdate(req.user.id, {
      battery,
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
router.put("/shake-status", authMiddleware, async (req, res) => {
  try {
    const { active } = req.body;

    await User.findByIdAndUpdate(req.user.id, {
      shakeDetectionActive: active,
    });

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ================= UPLOAD PROFILE IMAGE =================

router.post(
  "/upload-profile",
  authMiddleware,
  upload.single("profile"),
  async (req, res) => {
    try {
      const imageUrl = `https://women-centric-hzmm.onrender.com/uploads/${req.file.filename}`;

      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          profileImage: imageUrl,
        },
        { new: true },
      );

      res.json({
        success: true,
        profileImage: user.profileImage,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Profile Upload Failed",
      });
    }
  },
);

module.exports = router;
