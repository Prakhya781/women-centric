const mongoose = require("mongoose");

const safetyTipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "General",
    },

    icon: {
      type: String,
      default: "Shield",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("SafetyTip", safetyTipSchema);
