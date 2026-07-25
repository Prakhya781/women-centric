const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    incidentType: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    severity: {
      type: String,
      default: "Medium",
    },

    latitude: Number,
    longitude: Number,

    address: String,

    anonymous: {
      type: Boolean,
      default: false,
    },

    image: String,

    aiRisk: {
      type: String,
      default: "LOW",
    },

    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Incident", incidentSchema);
