const mongoose = require("mongoose");

const guardianLinkSchema = new mongoose.Schema(
  {
    trackingToken: {
    type: String,
    default: "",
},

trackingEnabled: {
    type: Boolean,
    default: false,
},

trackingStartedAt: {
    type: Date,
    default: null,
},
    guardianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    womanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    relation: {
      type: String,
      default: "Guardian",
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },

    isActive: {
      type: Boolean,
      default: false,
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },

    acceptedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GuardianLink", guardianLinkSchema);