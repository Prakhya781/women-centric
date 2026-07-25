// src/components/WomenDashboard.js

import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  MapPin,
  Users,
  ShieldCheck,
  PhoneCall,
  Lightbulb,
  Bell,
  BatteryCharging,
  Shield,
  Navigation,
  ChevronRight,
} from "lucide-react";
import "../components/WomenDashboard.css";
import { Camera , ChevronLeft} from "lucide-react";
import profileImage from "../assets/women-safety-hero.png";

import MapCard from "./MapCard.js";

export default function DashboardHome({ setActiveMenu }) {
  const [profilePreview, setProfilePreview] = useState("");
  const [tips, setTips] = useState([]);
const [currentTip, setCurrentTip] = useState(0);
  const [user, setUser] = useState(null);
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [dashboardData, setDashboardData] = useState({
    safetyStatus: "SAFE",
    safetyMessage: "",
    sosActive: false,
    liveLocationEnabled: false,
    guardianCount: 0,
    unreadNotifications: 0,
    recentReports: 0,
    minutesLive: 0,
    batteryLevel: 0,
    aiProtectionStatus: {},
    safetyTip: "",
  });
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/dashboard/status",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setDashboardData(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
  fetchTips();
}, []);

const fetchTips = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/tips");
    setTips(response.data.tips);
  } catch (error) {
    console.log(error);
  }
};
const nextTip = () => {
  setCurrentTip((prev) =>
    prev === tips.length - 1 ? 0 : prev + 1
  );
};

const prevTip = () => {
  setCurrentTip((prev) =>
    prev === 0 ? tips.length - 1 : prev - 1
  );
};
useEffect(() => {
  const getBatteryInfo = async () => {
    if (navigator.getBattery) {
      const battery = await navigator.getBattery();

      const updateBattery = async () => {
        const level = Math.round(battery.level * 100);

        setBatteryLevel(level);

        try {
          const token = localStorage.getItem("token");

          await axios.put(
            "http://localhost:5000/api/user/update-battery",
            { battery: level },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (err) {
          console.log(err);
        }
      };

      updateBattery();

      battery.addEventListener("levelchange", updateBattery);
    }
  };

  getBatteryInfo();
}, []);
  const uploadProfileImage = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) return;

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("profile", file);

      const res = await axios.post(
        "http://localhost:5000/api/user/upload-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setProfilePreview(res.data.profileImage);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.user);

        if (res.data.user.profileImage) {
          setProfilePreview(res.data.user.profileImage);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);
  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(fetchDashboardData, 10000);

    return () => clearInterval(interval);
  }, []);
  const activeTip = tips[currentTip];
  return (
    <div className="dashboard-container">
      {/* ================= SIDEBAR ================= */}

      {/* ================= MAIN CONTENT ================= */}

      <div className="main-content">
        {/* HEADER */}

        <div className="top-header">
          <div>
            <h1>Hi, {user?.name || "User"} 👋</h1>
            <p>Stay safe, we’ve got your back!</p>
          </div>

          <div className="header-right">
            <div
              className="notification-icon"
              onClick={() => setActiveMenu("Notifications")}
            >
              <Bell size={22} />
              <span>{dashboardData.unreadNotifications}</span>
            </div>
            <div className="profile-wrapper">
              <img
                src={profilePreview ? profilePreview : profileImage}
                alt="profile"
                className="profile-image"
              />

              <label className="upload-icon">
                <Camera size={14} />

                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadProfileImage}
                  hidden
                />
              </label>
            </div>
          </div>
        </div>

        {/* TOP CARDS */}

        <div className="top-cards">
          {/* SAFETY CARD */}
          <div className="status-card">
            <div
              className={
                dashboardData.safetyStatus === "SAFE"
                  ? "green-circle"
                  : dashboardData.safetyStatus === "CAUTION"
                    ? "yellow-circle"
                    : "red-circle"
              }
            >
              <Shield size={30} />
            </div>

            <div className="card-content">
              <h4>Safety Status</h4>

              <h2
                className={
                  dashboardData.safetyStatus === "SAFE"
                    ? "safe-text"
                    : dashboardData.safetyStatus === "CAUTION"
                      ? "warning-text"
                      : "danger-text"
                }
              >
                {dashboardData.safetyStatus}
              </h2>

              <p>{dashboardData.safetyMessage}</p>
            </div>
          </div>

          {/* LOCATION CARD */}
          <div className="status-card">
            <div
              className={
                dashboardData.liveLocationEnabled
                  ? "purple-circle"
                  : "gray-circle"
              }
            >
              <MapPin size={30} />
            </div>

            <div className="card-content">
              <h4>Live Location</h4>

              <h2
                className={
                  dashboardData.liveLocationEnabled
                    ? "purple-text"
                    : "gray-text"
                }
              >
                {dashboardData.liveLocationEnabled
                  ? "Sharing Live"
                  : "Location Off"}
              </h2>

              <p>
                {dashboardData.liveLocationEnabled
                  ? `Live Since ${dashboardData.minutesLive} mins`
                  : "Not Active"}
              </p>

              <small>With {dashboardData.guardianCount} Guardian</small>
            </div>
          </div>

          {/* BATTERY CARD */}
          <div className="battery-card">
            <div className="battery-icon">
              <BatteryCharging size={30} />
            </div>

            <div className="card-content">
              <h4>Battery Level</h4>

              <h2>{batteryLevel}%</h2>

              <p>Last Updated Now</p>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}

        <div className="dashboard-grid">
          {/* LEFT */}

          <div className="left-grid">
            {/* SOS */}

            <div
              className="sos-card"
              onClick={() => setActiveMenu("SOS")}
              style={{ cursor: "pointer" }}
            >
              <h2>Emergency SOS</h2>

              <div className="sos-button">
                <div className="inner-sos">SOS</div>
              </div>

              <h3>Tap to Alert Guardians</h3>

              <p>Your location will be shared instantly</p>
            </div>
            {/* AI STATUS */}

            <div className="ai-card">
              <div className="card-header">
                <h2>AI Protection Status</h2>
                <span>View Details</span>
              </div>

              <div className="ai-grid">
                <div className="ai-item">
                  <ShieldCheck size={26} />
                  <div>
                    <h4>Keyword Alert</h4>
                    <p>
  {dashboardData.aiProtectionStatus?.keywordAlert
    ? "Active"
    : "Inactive"}
</p>
                  </div>
                </div>

                <div className="ai-item">
                  <PhoneCall size={26} />
                  <div>
                    <h4>Shake Detection</h4>
                    <p>
  {dashboardData.aiProtectionStatus?.shakeDetection
    ? "Active"
    : "Inactive"}
</p>
                  </div>
                </div>

                <div className="ai-item">
                  <Navigation size={26} />
                  <div>
                    <h4>Movement Tracking</h4>
                    <p>
  {dashboardData.aiProtectionStatus?.movementTracking
    ? "Active"
    : "Inactive"}
</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SAFETY TIP */}

            <div className="tip-card">
              <div className="tip-icon">
                <ShieldCheck size={32} />
              </div>

              <div>
                <h3>Safety Tip of the Day</h3>

                <p>
                  Always trust your instincts. If something feels wrong, move to
                  a safe place and contact your trusted person.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="right-grid">
            {/* MAP */}

            <MapCard />

            {/* QUICK ACTIONS */}

            <div className="quick-card">
  <h2>Quick Actions</h2>

  <div className="quick-grid">

    <div
      className="quick-item"
      onClick={() => setActiveMenu("Live Location")}
    >
      <Navigation size={28} />
      <span>Share Location</span>
    </div>

    <div
      className="quick-item"
      onClick={() => setActiveMenu("Emergency Contacts")}
    >
      <Users size={28} />
      <span>Emergency Contacts</span>
    </div>

    <div
      className="quick-item"
      onClick={() => setActiveMenu("Fake Call")}
    >
      <PhoneCall size={28} />
      <span>Fake Call</span>
    </div>

  </div>
</div>

            {/* TIPS */}

            <div className="mini-tip-card">
  <div className="card-header">
    <h2>Safety Tips</h2>
    <span
  style={{ cursor: "pointer" }}
  onClick={() => setActiveMenu("Safety Tips")}
>
  View All
</span>
  </div>

  {activeTip && (
    <>
      <div className="mini-tip-content">
        <Lightbulb size={28} />

        <div className="tip-text">
          <h4>{activeTip.title}</h4>

          <p>{activeTip.description}</p>
        </div>
      </div>

      <div className="tip-footer">
  <ChevronLeft
    size={20}
    style={{ cursor: "pointer" }}
    onClick={prevTip}
  />

  <span>
    {currentTip + 1}/{tips.length}
  </span>

  <ChevronRight
    size={20}
    style={{ cursor: "pointer" }}
    onClick={nextTip}
  />
</div>
    </>
  )}
</div>
          </div>
        </div>
      </div>
    </div>
  );
}
