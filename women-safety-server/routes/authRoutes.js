// routes/authRoutes.js
const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/User");

// ================= SIGNUP =================

router.post("/signup", async (req, res) => {
  try {
    console.log("Signup Request Body:", req.body);

    const {
      role,
      name,
      email,
      phone,
      password,

      emergencyContact1,
      emergencyContact2,

      bloodGroup,

      guardianEmail,
      guardianPhone,

      relationship,

      liveLocation,
    } = req.body;

    // VALIDATION

    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // CHECK USER

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // HASH PASSWORD

    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER

    const newUser = await User.create({
      role,
      name,
      email,
      phone,
      password: hashedPassword,

      emergencyContact1,
      emergencyContact2,

      bloodGroup,

      guardianEmail,
      guardianPhone,

      relationship,

      liveLocation,
    });

    // TOKEN

    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // REMOVE PASSWORD

    const userWithoutPassword = await User.findById(newUser._id).select(
      "-password",
    );

    // RESPONSE

    res.status(201).json({
      success: true,
      message: "Signup Successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= LOGIN =================

router.post("/login", async (req, res) => {
  try {
    console.log("Login Request Body:", req.body);

    const { email, password } = req.body;

    // VALIDATION

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    // FIND USER

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // CHECK PASSWORD

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // TOKEN

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // REMOVE PASSWORD

    const userWithoutPassword = await User.findById(user._id).select(
      "-password",
    );

    // RESPONSE

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= GET USER PROFILE =================

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// ================= UPDATE PROFILE =================

router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= LINK GUARDIAN =================

router.post("/link-guardian", authMiddleware, async (req, res) => {
  try {
    const { guardianEmail } = req.body;

    // current logged in woman
    const woman = await User.findById(req.user.id);

    if (!woman) {
      return res.status(404).json({
        success: false,
        message: "Woman user not found",
      });
    }

    // guardian find
    const guardian = await User.findOne({
      email: guardianEmail,
      role: "guardian",
    });

    if (!guardian) {
      return res.status(404).json({
        success: false,
        message: "Guardian account not found",
      });
    }

    // link guardian to woman
    woman.linkedGuardian = guardian._id;

    woman.guardianEmail = guardian.email;

    await woman.save();

    // add woman inside guardian
    if (!guardian.linkedWomen.includes(woman._id)) {
      guardian.linkedWomen.push(woman._id);

      await guardian.save();
    }

    // ================= EMAIL TO WOMAN =================

    await sendEmail(
      woman.email,
      "Guardian Linked Successfully",
      `Hello ${woman.name},

Your guardian ${guardian.name} has been successfully linked with your SafeHer account.

Stay Safe 💜
Team SafeHer`,
    );

    // ================= EMAIL TO GUARDIAN =================

    await sendEmail(
      guardian.email,
      "Woman Account Linked",
      `Hello ${guardian.name},

You are now linked as guardian for ${woman.name} on SafeHer.

You will receive safety alerts and live updates.

Team SafeHer`,
    );

    res.status(200).json({
      success: true,
      message: "Guardian Linked Successfully",
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
