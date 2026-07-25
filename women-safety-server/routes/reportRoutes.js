const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const Report = require("../models/Report");

// ================= CREATE REPORT =================

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    const report = new Report({
      user: req.user.id,
      title,
      description,
      category,
      location,
    });

    await report.save();
    const Notification = require("../models/Notification");

    await Notification.create({
      userId: req.user.id,

      title: "Incident Report Submitted",

      message: "Your incident report has been submitted.",

      type: "REPORT",
    });

    res.status(201).json({
      success: true,
      message: "Incident Reported Successfully",
      report,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// ================= GET ALL REPORTS =================

router.get("/all", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ================= UPDATE REPORT =================

router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    // only owner can edit
    if (report.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    report.title = title;
    report.description = description;
    report.category = category;
    report.location = location;

    await report.save();

    res.json({
      success: true,
      message: "Report Updated Successfully",
      report,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ================= DELETE REPORT =================

router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    // only owner can delete
    if (report.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await report.deleteOne();

    res.json({
      success: true,
      message: "Report Deleted Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
