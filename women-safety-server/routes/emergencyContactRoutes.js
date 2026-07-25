const express = require("express");

const router = express.Router();

const EmergencyContact = require("../models/EmergencyContact");

const authMiddleware = require("../middleware/authMiddleware");

// ================= ADD CONTACT =================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, relation, phone, email, priority } = req.body;

    const newContact = new EmergencyContact({
      userId: req.user.id,

      name,
      relation,
      phone,
      email,
      priority,
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Emergency Contact Added",
      contact: newContact,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// ================= GET CONTACTS =================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({
      userId: req.user.id,
    });

    res.status(200).json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// ================= UPDATE CONTACT =================

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedContact = await EmergencyContact.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Contact Updated",
      updatedContact,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// ================= DELETE CONTACT =================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await EmergencyContact.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Contact Deleted",
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
