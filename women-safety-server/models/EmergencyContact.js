const mongoose = require("mongoose");

const emergencyContactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    name: {
      type: String,
      required: true,
    },

    relation: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },

    priority: {
      type: String,
      default: "Secondary",
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("EmergencyContact", emergencyContactSchema);
