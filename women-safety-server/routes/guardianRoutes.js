const express = require("express");

const router = express.Router();

const User = require("../models/User");

const authMiddleware = require("../middleware/authMiddleware");

const nodemailer = require("nodemailer");

// ================= NODEMAILER =================

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================= LINK GUARDIAN =================

router.post("/link", authMiddleware, async (req, res) => {
  try {
    const { guardianEmail } = req.body;

    // ================= FIND CURRENT USER =================

    const womanUser = await User.findById(req.user.id);

    if (!womanUser) {
      return res.status(404).json({
        success: false,
        message: "Woman User Not Found",
      });
    }

    // ================= FIND GUARDIAN =================

    const guardianUser = await User.findOne({
      email: guardianEmail,
      role: "guardian",
    });

    if (!guardianUser) {
      return res.status(404).json({
        success: false,
        message: "Guardian Account Not Found",
      });
    }

    // ================= SAVE LINK =================

    // SAVE LINK

    womanUser.guardianEmail = guardianUser.email;

    womanUser.guardianPhone = guardianUser.phone;

    womanUser.linkedGuardian = guardianUser._id;

    womanUser.guardianLinked = true;

    await womanUser.save();

    guardianUser.linkedWomen.push(womanUser._id);

    await guardianUser.save();

    // ================= SEND MAIL TO GUARDIAN =================

     transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: guardianEmail,

      subject: "SafeHer Guardian Linked",

      html: `
        <h2>Guardian Linked Successfully</h2>

        <p>${womanUser.name} has linked you as guardian in SafeHer.</p>
      `,
    }).catch(err => console.log("Mail failed:", err.message));

    // ================= SEND MAIL TO WOMAN =================

     transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: womanUser.email,

      subject: "Guardian Connected Successfully",

      html: `
        <h2>Guardian Linked Successfully</h2>

        <p>You successfully linked ${guardianUser.name} as your guardian.</p>
      `,
    }).catch(err => console.log("Mail failed:", err.message));

    res.status(200).json({
      success: true,
      message: "Guardian Linked Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Guardian Linking Failed",
    });
  }
});

console.log(process.env.EMAIL_USER);

console.log(process.env.EMAIL_PASS);

module.exports = router;
