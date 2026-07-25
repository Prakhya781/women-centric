const mongoose = require("mongoose");

const aiHistorySchema = new mongoose.Schema({
  message: String,
  riskLevel: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AIHistory", aiHistorySchema);
