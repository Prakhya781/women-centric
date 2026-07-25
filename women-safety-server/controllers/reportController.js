const Incident = require("../models/Incident");

exports.createIncident = async (req, res) => {
  try {
    const {
      incidentType,
      description,
      severity,
      latitude,
      longitude,
      address,
      anonymous,
    } = req.body;

    let aiRisk = "LOW";

    const text = description.toLowerCase();

    if (
      text.includes("kidnap") ||
      text.includes("attack") ||
      text.includes("rape") ||
      text.includes("weapon")
    ) {
      aiRisk = "HIGH";
    } else if (text.includes("follow") || text.includes("harass")) {
      aiRisk = "MEDIUM";
    }

    const incident = new Incident({
      userId: req.user.id,

      incidentType,
      description,
      severity,
      latitude,
      longitude,
      address,
      anonymous,

      aiRisk,

      image: req.file ? req.file.path : "",
    });

    await incident.save();

    res.status(201).json({
      success: true,
      message: "Incident Reported Successfully",
      incident,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getMyIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(incidents);
  } catch (error) {
    console.log(error);
  }
};
