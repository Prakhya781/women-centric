import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  ShieldAlert,
  MapPin,
  Users,
  Phone,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

import "./SOSPage.css";

function SOSPage() {
  const [countdown, setCountdown] = useState(null);
  const [isActivating, setIsActivating] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const watchIdRef = useRef(null);

  // Page load / refresh pe check karo SOS pehle se active to nahi
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://women-centric-hzmm.onrender.com/api/location/current-location",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data?.location?.sosActive) {
          setSosActive(true);
          startWatching();
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchStatus();

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startWatching = () => {
    if (watchIdRef.current !== null) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        try {
          const token = localStorage.getItem("token");
          await axios.put(
            "https://women-centric-hzmm.onrender.com/api/location/update-location",
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              address: "Live Location",
              liveLocationEnabled: true,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (error) {
          console.log(error);
        }
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  };

  const stopWatching = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const stopSOS = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "https://women-centric-hzmm.onrender.com/api/sos/deactivate", {},
      { headers: { Authorization: `Bearer ${token}` }, timeout: 15000 }
    );
    alert(res.data.message);
    setSosActive(false);
    stopWatching();
  } catch (error) {
    console.log(error);
    // galat "failed" dikhane se pehle real status verify karo
    try {
      const token = localStorage.getItem("token");
      const check = await axios.get(
        "https://women-centric-hzmm.onrender.com/api/location/current-location",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!check.data?.location?.sosActive) {
        setSosActive(false);
        stopWatching();
        alert("SOS Stopped Successfully");
        return;
      }
    } catch (e) {}
    alert("Failed to Stop SOS — please try again");
  }
};
  const startSOS = () => {
    if (sosActive || isActivating) return;

    let count = 5;

    setCountdown(count);
    setIsActivating(true);

    const timer = setInterval(() => {
      count--;

      setCountdown(count);

      if (count === 0) {
        clearInterval(timer);
        activateSOS();
      }
    }, 1000);
  };

  const activateSOS = async () => {
    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const token = localStorage.getItem("token");

        const res = await axios.post(
          "https://women-centric-hzmm.onrender.com/api/sos/activate",
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: "Emergency Location",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.data.success === false) {
          alert(res.data.message);
          setCountdown(null);
          setIsActivating(false);
          return;
        }

        alert("🚨 SOS Activated Successfully");

        setSosActive(true);
        startWatching();
        setCountdown(null);
        setIsActivating(false);
      });
    } catch (error) {
      console.log(error);
      alert("Failed to activate SOS");
      setCountdown(null);
      setIsActivating(false);
    }
  };

  return (
    <div className="sos-container">
      {/* HEADER */}

      <div className="sos-header">
        <ShieldAlert size={60} />

        <h1>Emergency SOS Center</h1>

        <p>Your safety is our highest priority</p>
      </div>

      {/* SOS BUTTON */}

      <div className="sos-button-section">
        <button
          className="big-sos-btn"
          onClick={startSOS}
          disabled={isActivating || sosActive}
        >
          {sosActive ? "SOS ACTIVE" : "SOS"}
        </button>

        {countdown !== null && (
          <div className="countdown-box">
            <h2>{countdown}</h2>

            <p>Emergency Alert Activating...</p>
          </div>
        )}
      </div>

      {sosActive && (
        <button className="stop-sos-btn" onClick={stopSOS} title="I'm Safe">
          ✓
        </button>
      )}

      {/* STATUS CARDS */}

      <div className="sos-status-grid">
        <div className="sos-status-card">
          <MapPin size={35} />
          <h3>Live Location</h3>
          <p>Your current location will be shared instantly.</p>
        </div>

        <div className="sos-status-card">
          <Users size={35} />
          <h3>Guardian Alert</h3>
          <p>Linked guardians will receive emergency alerts.</p>
        </div>

        <div className="sos-status-card">
          <Phone size={35} />
          <h3>Emergency Contact</h3>
          <p>Emergency contacts will be notified immediately.</p>
        </div>
      </div>

      {/* WHAT HAPPENS */}

      <div className="sos-action-card">
        <h2>What Happens After SOS?</h2>

        <div className="sos-action-list">
          <div>
            <CheckCircle size={20} />
            <span>Emergency Email Sent</span>
          </div>

          <div>
            <CheckCircle size={20} />
            <span>Live Location Shared</span>
          </div>

          <div>
            <CheckCircle size={20} />
            <span>Guardian Alert Triggered</span>
          </div>

          <div>
            <CheckCircle size={20} />
            <span>Real-Time Tracking Started</span>
          </div>
        </div>
      </div>

      {/* HELPLINES */}

      <div className="sos-helpline-card">
        <h2>Emergency Helplines</h2>

        <div className="sos-helpline-grid">
          <div>
            <h3>1091</h3>
            <p>Women Helpline</p>
          </div>

          <div>
            <h3>112</h3>
            <p>Emergency</p>
          </div>

          <div>
            <h3>100</h3>
            <p>Police</p>
          </div>

          <div>
            <h3>108</h3>
            <p>Ambulance</p>
          </div>
        </div>
      </div>

      {/* SAFETY TIPS */}

      <div className="sos-tips-card">
        <AlertTriangle size={30} />

        <div>
          <h3>Safety Tip</h3>

          <p>
            Move towards a crowded place, contact your trusted guardian and keep
            your phone accessible.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SOSPage;