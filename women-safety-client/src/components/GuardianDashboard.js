// src/components/GuardianDashboard.js

import React, { useEffect, useState } from "react";

import {
  LayoutDashboard,
  MapPin,
  Bell,
  AlertTriangle,
  ShieldCheck,
  Users,
  Settings,
  LogOut,
  Phone,
  Menu,
  Siren,
} from "lucide-react";

import "./GuardianDashboard.css";

import GuardianHome from "../guardian/GuardianHome";
import GuardianLiveLocation from "../guardian/GuardianLiveLocation";
import GuardianSOS from "../guardian/GuardianSOS";
import GuardianNotifications from "../guardian/GuardianNotifications";
import GuardianIncidentReports from "../guardian/GuardianIncidentReports";
import GuardianSafetyStatus from "../guardian/GuardianSafetyStatus";
import GuardianEmergencyContacts from "../guardian/GuardianEmergencyContacts";
import GuardianProfile from "../guardian/GuardianProfile";
import GuardianRequests from "../guardian/GuardianRequests";
import axios from "axios";

export default function GuardianDashboard() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasLinkedWoman, setHasLinkedWoman] = useState(false);
const [loading, setLoading] = useState(true);

// const checkGuardian = async () => {
//   try {
//     const token = localStorage.getItem("token");

//     await axios.get(
//       "https://women-centric-hzmm.onrender.com/api/guardian/dashboard",
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     setHasLinkedWoman(true);

//   } catch {
//     setHasLinkedWoman(false);
//   }

//   setLoading(false);
// };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const menuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      name: "Dashboard",
    },
    {
icon:<Users size={20}/>,
name:"Guardian Requests"
},

    {
      icon: <MapPin size={20} />,
      name: "Live Location",
    },

    {
      icon: <Siren size={20} />,
      name: "SOS Alerts",
    },

    {
      icon: <Bell size={20} />,
      name: "Notifications",
    },

    {
      icon: <AlertTriangle size={20} />,
      name: "Incident Reports",
    },

    {
      icon: <ShieldCheck size={20} />,
      name: "Safety Status",
    },

    {
      icon: <Users size={20} />,
      name: "Emergency Contacts",
    },

    {
      icon: <Settings size={20} />,
      name: "Profile Settings",
    },
  ];
  useEffect(() => {

checkGuardian();

}, []);
const checkGuardian = async () => {

try{

const token=localStorage.getItem("token");

await axios.get(
"https://women-centric-hzmm.onrender.com/api/guardian/dashboard",
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

setHasLinkedWoman(true);

}

catch{

setHasLinkedWoman(false);

}

setLoading(false);

}

  const renderPage = () => {
    if(loading){

return(

<div className="guardian-loading">

<h2>Loading...</h2>

</div>

)

}
    if (
  !hasLinkedWoman &&
  activeMenu !== "Guardian Requests" &&
  activeMenu !== "Profile Settings"
) {

  return (
    <div className="guardian-empty-page">

      <h1>No Woman Linked</h1>

      <p>
        Accept a guardian request to access dashboard and all features.
      </p>

    </div>
  );

}
    switch (activeMenu) {
      case "Dashboard":
        return (
  <GuardianHome
    setActiveMenu={setActiveMenu}
    checkGuardian={checkGuardian}
  />
);

      case "Guardian Requests":
  return <GuardianRequests checkGuardian={checkGuardian} />;

      case "Live Location":
        return <GuardianLiveLocation />;

      case "SOS Alerts":
        return <GuardianSOS />;

      case "Notifications":
        return <GuardianNotifications />;

      case "Incident Reports":
        return <GuardianIncidentReports />;

      case "Safety Status":
        return <GuardianSafetyStatus />;

      case "Emergency Contacts":
        return <GuardianEmergencyContacts />;

      case "Profile Settings":
        return <GuardianProfile />;

      default:
        return <GuardianHome setActiveMenu={setActiveMenu} />;
    }
  };
    return (
    <div className="dashboard-container">

      {/* ================= HAMBURGER ================= */}

      {!sidebarOpen && (
        <div
          className="menu-toggle"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={28} />
        </div>
      )}

      {/* ================= OVERLAY ================= */}

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}

      <div className={`sidebar ${sidebarOpen ? "show" : ""}`}>

        <div>

          {/* LOGO */}

          <div className="logo-section">

            <div className="logo-icon-box">
              <ShieldCheck size={26} />
            </div>

            <div>
              <h2>SafeHer</h2>
              <p>Guardian Panel</p>
            </div>

          </div>

          {/* MENU */}

          <div className="menu-section">

            {menuItems.map((item, index) => (

              <div
                key={index}
                className={`menu-item
${activeMenu===item.name?"active":""}
${
!hasLinkedWoman &&
item.name!=="Guardian Requests" &&
item.name!=="Profile Settings"
?"disabled":""
}
`}
               onClick={() => {

  if (
    !hasLinkedWoman &&
    item.name !== "Guardian Requests" &&
    item.name !== "Profile Settings"
  ) {
    alert(
      "Please accept a guardian request first. No woman is linked yet."
    );
    return;
  }

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

              <p>24x7 Emergency</p>

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

      {/* ================= MAIN CONTENT ================= */}

      <div className="main-content">

        {renderPage()}

      </div>

    </div>
  );
}