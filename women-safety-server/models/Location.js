const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    womanId: {
      type: String,
      default: null,
    },

    guardianId: {
      type: String,
      default: null,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Location", locationSchema);