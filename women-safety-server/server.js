require("dotenv").config();
const safetyTipRoutes = require("./routes/safetyTipRoutes");
const emergencyContactRoutes = require("./routes/emergencyContactRoutes");
const express = require("express");
const locationRoutes = require("./routes/locationRoutes");
const mongoose = require("mongoose");
const sendEmail = require("./utils/sendEmail");
const cors = require("cors");
const guardianRoutes = require("./routes/guardianRoutes");
const sosRoutes = require("./routes/sosRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const fakeCallRoutes = require("./routes/fakeCallRoutes");
const safeRouteRoutes = require("./routes/safeRouteRoutes");
const app = express();
const aiRoutes = require("./routes/aiRoutes");
const guardianAlertRoutes = require("./routes/guardianAlertRoutes");
const reportRoutes = require("./routes/reportRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const path = require("path");
const guardianRoutess = require("./routes/guardianRoutess");
// ================= MIDDLEWARE =================

app.use(
  cors({
   origin: [
      "http://localhost:3000",
      "https://women-centric-1-rfha.onrender.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

// ================= ROUTES =================
app.use("/api/guardian", guardianRoutess);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/safe-route", safeRouteRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tips", safetyTipRoutes);
app.use("/api/emergency-contacts", emergencyContactRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/guardian", guardianRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/user", userRoutes);
app.use("/api/fake-call", fakeCallRoutes);
console.log("ORS KEY =", process.env.ORS_API_KEY);
app.use("/api/ai", aiRoutes);
app.use("/api/guardian-alert", guardianAlertRoutes);
app.use("/api/report", reportRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", require("./routes/dashboard"));
// ================= MONGODB CONNECTION =================

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.log("MongoDB Error:", error);
  });
// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
