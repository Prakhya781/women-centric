import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Shield,
  MapPin,
  BatteryCharging,
  Bell,
  Phone,
  Users,
  Navigation,
  ShieldCheck,
} from "lucide-react";

import "../components/GuardianDashboard.css";

export default function GuardianHome({
  setActiveMenu,
  checkGuardian,
}) {

  const [dashboard, setDashboard] = useState({
    womanName: "",
    profileImage: "",
    battery: 0,
    location: "",
    safetyStatus: "SAFE",
    sos: false,
    lastSeen: "",
    online: false,
    notifications: [],
  });

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= Dashboard =================

  const fetchDashboard = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://women-centric-hzmm.onrender.com/api/guardian/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDashboard(res.data);

      setLoading(false);

    } catch (err) {

      if (err.response?.status === 404) {
        loadRequests();
      }

      setLoading(false);
    }
  };

  // ================= Pending Requests =================

  const loadRequests = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://women-centric-hzmm.onrender.com/api/guardian/requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  // ================= Accept =================

  const acceptRequest = async (id) => {
    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `https://women-centric-hzmm.onrender.com/api/guardian/accept/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await checkGuardian();
      await fetchDashboard();
      

    } catch (err) {
      console.log(err);
    }
  };

  // ================= Reject =================

  const rejectRequest = async (id) => {
    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `https://women-centric-hzmm.onrender.com/api/guardian/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadRequests();

    } catch (err) {
      console.log(err);
    }
  };
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {

    fetchDashboard();

    const interval = setInterval(fetchDashboard, 10000);

    return () => clearInterval(interval);

  }, []);

  return (

<div className="main-content">

{
loading ?

(

<div className="guardian-loading">

<h2>Loading...</h2>

</div>

)

:

dashboard.womanName === ""

?

(

<div className="guardian-request-page">

<h1>Pending Guardian Requests</h1>

{
requests.length===0 ?

(

<div className="guardian-empty">

<h2>No Pending Requests</h2>

<p>

Waiting for women to send guardian request.

</p>

</div>

)

:

requests.map((item)=>(

<div
className="guardian-request-card"
key={item._id}
>

<div>

<h2>{item.womanId.name}</h2>

<p>{item.womanId.email}</p>

</div>

<div className="guardian-request-buttons">

<button
className="accept-btn"
onClick={()=>acceptRequest(item._id)}
>

Accept

</button>

<button
className="reject-btn"
onClick={()=>rejectRequest(item._id)}
>

Reject

</button>

</div>

</div>

))

}

</div>

)

:

(
<>
<div className="guardian-header">

  <div>

    <h1>Welcome Guardian 👋</h1>

    <p>
      Keep track of your loved one's safety in real time.
    </p>

  </div>

  <div className="online-badge">

    {dashboard.online ? "🟢 Online" : "⚫ Offline"}

  </div>

</div>

{/* ================= TOP CARDS ================= */}

<div className="guardian-cards">

  <div className="guardian-card">

    <Shield size={34} color="#22c55e"/>

    <h4>Safety Status</h4>

    <h2>{dashboard.safetyStatus}</h2>

    <p>Current Safety</p>

  </div>

  <div className="guardian-card">

    <MapPin size={34} color="#8b5cf6"/>

    <h4>Current Location</h4>

    <h2>{dashboard.location}</h2>

    <p>{dashboard.lastSeen}</p>

  </div>

  <div className="guardian-card">

    <BatteryCharging
      size={34}
      color="#ff9800"
    />

    <h4>Battery</h4>

    <h2>{dashboard.battery}%</h2>

    <p>Device Battery</p>

  </div>

  <div className="guardian-card">

    <Bell
      size={34}
      color={dashboard.sos ? "red" : "#22c55e"}
    />

    <h4>SOS Status</h4>

    <h2>

      {dashboard.sos ? "ACTIVE" : "SAFE"}

    </h2>

    <p>

      {dashboard.sos
        ? "Emergency Triggered"
        : "Everything Normal"}

    </p>

  </div>

</div>

{/* ================= MAIN GRID ================= */}

<div className="guardian-main-grid">

  {/* LEFT */}

  <div>

    <div className="guardian-card">

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >

        <img
          src={
            dashboard.profileImage ||
            "https://via.placeholder.com/80"
          }
          alt="woman"
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #8b5cf6",
          }}
        />

        <div>

          <h2>{dashboard.womanName}</h2>

          <p>{dashboard.location}</p>

          <p
            style={{
              color: dashboard.online
                ? "#22c55e"
                : "#888",
              marginTop: "8px",
            }}
          >

            {dashboard.online
              ? "🟢 Online"
              : "⚫ Offline"}

          </p>

        </div>

      </div>

    </div>

    {/* Notifications */}

    <div
      className="guardian-card"
      style={{ marginTop: "22px" }}
    >

      <div className="card-header">

        <h2>Recent Notifications</h2>

        <span
          onClick={() =>
            setActiveMenu &&
            setActiveMenu("Notifications")
          }
        >
          View All
        </span>

      </div>

      <div className="notification-list">

        {
          dashboard.notifications &&
          dashboard.notifications.length > 0 ?

          dashboard.notifications.map((item,index)=>(

            <div
              key={index}
              className="notification-item"
            >

              <Bell color="#8b5cf6"/>

              <div>

                <h4>{item.title}</h4>

                <p>{item.message}</p>

              </div>

            </div>

          ))

          :

          <div className="notification-item">

            No Notifications

          </div>

        }

      </div>

    </div>

  </div>

  {/* RIGHT */}

  <div>

    <div className="guardian-card">

      <h2 style={{marginBottom:"20px"}}>

        Quick Actions

      </h2>

      <div className="quick-actions">

        <div
          className="quick-action"
          onClick={()=>
            setActiveMenu &&
            setActiveMenu("Live Location")
          }
        >

          <Navigation color="#8b5cf6"/>

          <span>

            View Live Location

          </span>

        </div>

        <div className="quick-action">

          <Phone color="#22c55e"/>

          <span>

            Call Woman

          </span>

        </div>

        <div
          className="quick-action"
          onClick={()=>
            setActiveMenu &&
            setActiveMenu("Emergency Contacts")
          }
        >

          <Users color="#ff4da6"/>

          <span>

            Emergency Contacts

          </span>

        </div>

        <div
          className="quick-action"
          onClick={()=>
            setActiveMenu &&
            setActiveMenu("Safety Status")
          }
        >

          <ShieldCheck color="#00c896"/>

          <span>

            Safety Status

          </span>

        </div>

      </div>

    </div>

  </div>

</div>

</>

)

}

</div>


);

}