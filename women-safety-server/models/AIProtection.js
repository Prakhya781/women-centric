const mongoose = require("mongoose");

const aiProtectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  keywordAlert: {
    type: Boolean,
    default: false,
  },

  shakeDetection: {
    type: Boolean,
    default: false,
  },

  movementTracking: {
    type: Boolean,
    default: false,
  },

  riskLevel: {
    type: String,
    default: "LOW",
  },

  lastMessage: {
    type: String,
    default: "",
  },

  lastAnalyzedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "AIProtection",
  aiProtectionSchema
);