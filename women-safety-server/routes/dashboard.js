const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getDashboardStatus } = require("../controllers/dashboardController");

router.get("/status", authMiddleware, getDashboardStatus);

module.exports = router;