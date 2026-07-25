import React, { useState } from "react";

import {
  LayoutDashboard,
  Siren,
  MapPin,
  Users,
  ShieldCheck,
  Route,
  PhoneCall,
  Lightbulb,
  AlertTriangle,
  Bell,
  Phone,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";

import "./WomenDashboard.css";
import useShakeDetection from "../hooks/useShakeDetection";

import DashboardHome from "../pages/DashboardHome";
import ProfileSettings from "../pages/ProfileSettings";
import SOSPage from "../pages/SOSPage";
import LiveLocation from "../pages/LiveLocation";
import EmergencyContacts from "../pages/EmergencyContacts";
import AIProtection from "../pages/AIProtection";
import SafeRoute from "../pages/SafeRoute";
import FakeCall from "../pages/FakeCall";
import SafetyTips from "../pages/SafetyTips";
import ReportIncident from "../pages/ReportIncident";
import Notifications from "../pages/Notifications";

export default function WomenDashboard() {
  useShakeDetection();
  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("role");

    window.location.href = "/";
  };
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      name: "Dashboard",
    },

    {
      icon: <Siren size={20} />,
      name: "SOS",
    },

    {
      icon: <MapPin size={20} />,
      name: "Live Location",
    },

    {
      icon: <Users size={20} />,
      name: "Emergency Contacts",
    },

    {
      icon: <ShieldCheck size={20} />,
      name: "AI Protection",
    },

    {
      icon: <Route size={20} />,
      name: "Safe Route",
    },

    {
      icon: <PhoneCall size={20} />,
      name: "Fake Call",
    },

    {
      icon: <Lightbulb size={20} />,
      name: "Safety Tips",
    },

    {
      icon: <AlertTriangle size={20} />,
      name: "Report Incident",
    },

    {
      icon: <Bell size={20} />,
      name: "Notifications",
    },

    {
      icon: <Settings size={20} />,
      name: "Profile Settings",
    },
  ];

  // ================= PAGE RENDER =================

  const renderPage = () => {
    switch (activeMenu) {
      case "Dashboard":
        return <DashboardHome setActiveMenu={setActiveMenu} />;

      case "SOS":
        return <SOSPage />;

      case "Live Location":
        return <LiveLocation />;

      case "Emergency Contacts":
        return <EmergencyContacts />;

      case "AI Protection":
        return <AIProtection />;

      case "Safe Route":
        return <SafeRoute />;

      case "Fake Call":
        return <FakeCall />;

      case "Safety Tips":
        return <SafetyTips />;

      case "Report Incident":
        return <ReportIncident />;

      case "Notifications":
        return <Notifications />;

      case "Profile Settings":
        return <ProfileSettings />;

      default:
        return <DashboardHome />;
    }
  };

  return (
    
    <div className="dashboard-container">
      {/* SIDEBAR */}
      {!sidebarOpen && (
  <div
    className="menu-toggle"
    onClick={() => setSidebarOpen(true)}
  >
    <Menu size={28} />
  </div>
)}

  {sidebarOpen && (
    <div
      className="sidebar-overlay"
      onClick={() => setSidebarOpen(false)}
    />
  )}
 

      <div className={`sidebar ${sidebarOpen ? "show" : ""}`}>
        <div>
          {/* LOGO */}

          <div className="logo-section">
            <div className="logo-icon-box">
              <ShieldCheck size={26} />
            </div>

            <div>
              <h2>SafeHer</h2>
              <p>Women Safety</p>
            </div>
          </div>

          {/* MENU */}

          <div className="menu-section">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className={`menu-item ${
                  activeMenu === item.name ? "active" : ""
                }`}
               onClick={() => {
  setActiveMenu(item.name);
  setSidebarOpen(false);
}}
              >
                {item.icon}

                <span>{item.name}</span>
              </div>
            ))}
          </div>

          {/* HELPLINE */}

          <div className="helpline-card">
            <div className="helpline-icon">
              <Phone size={28} />
            </div>

            <div>
              <h4>Women Helpline</h4>
              <h2>1091</h2>
              <p>24x7 Helpline</p>
            </div>
          </div>
        </div>

        {/* LOGOUT */}

        <div
  className="logout-btn"
  onClick={() => {
    setSidebarOpen(false);
    handleLogout();
  }}
>
          <LogOut size={20} />

          <span>Logout</span>
        </div>
      </div>

      {/* MAIN CONTENT */}

      <div className="main-content">{renderPage()}</div>
    </div>
  );
}
