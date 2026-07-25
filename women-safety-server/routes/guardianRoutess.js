// ============================================================
// 2. routes/guardianRoutes.js  (FULL UPDATED FILE)
// ============================================================

const express = require("express");

const router = express.Router();
const {
  getGuardianDashboard,
  sendGuardianRequest,
  getGuardianRequests,
  acceptGuardianRequest,
  rejectGuardianRequest,
  getMyGuardianStatus,
  getGuardianStatus,
  getMyWoman,
  getGuardianSOS,
  getGuardianNotifications,
  getGuardianIncidents,
  getGuardianSafetyStatus,
  getGuardianEmergencyContacts,
} = require("../controllers/guardianController");
const auth = require("../middleware/authMiddleware");

router.get("/my-status", auth, getMyGuardianStatus);

router.get("/status", auth, getGuardianStatus);

router.get("/dashboard", auth, getGuardianDashboard);

router.get("/myWoman", auth, getMyWoman);

router.post("/send-request", auth, sendGuardianRequest);

router.get("/sos", auth, getGuardianSOS);

router.get("/notifications", auth, getGuardianNotifications);

router.get("/incidents", auth, getGuardianIncidents);

router.get("/safety-status", auth, getGuardianSafetyStatus);

router.get("/emergency-contacts", auth, getGuardianEmergencyContacts);

router.get("/requests", auth, getGuardianRequests);

router.put("/accept/:id", auth, acceptGuardianRequest);

router.put("/reject/:id", auth, rejectGuardianRequest);

module.exports = router;