// src/guardian/GuardianSOS.js

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import {
  Siren,
  MapPin,
  Clock,
  Phone,
  Navigation2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

import "./GuardianSOS.css";

export default function GuardianSOS({ setActiveMenu }) {
  const [sosData, setSosData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH SOS STATUS =================

  const fetchSOS = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://women-centric-hzmm.onrender.com/api/guardian/sos",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setSosData(res.data.sos);
        setError("");
      }
    } catch (err) {
      console.log(err);

      setError(
        err?.response?.data?.message || "Failed to load SOS status"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSOS();

    const interval = setInterval(fetchSOS, 5000);

    return () => clearInterval(interval);
  }, [fetchSOS]);

  // ================= HELPERS =================

  const getTimeAgo = (date) => {
    if (!date) return "";

    const diffMs = Date.now() - new Date(date).getTime();

    const mins = Math.floor(diffMs / 60000);

    if (mins < 1) return "Just now";

    if (mins < 60) return `${mins} min ago`;

    const hrs = Math.floor(mins / 60);

    return `${hrs} hr ${mins % 60} min ago`;
  };

  const openDirections = () => {
    if (!sosData?.location?.latitude || !sosData?.location?.longitude) return;

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${sosData.location.latitude},${sosData.location.longitude}`,
      "_blank"
    );
  };

  const callWoman = () => {
    if (!sosData?.phone) return;

    window.location.href = `tel:${sosData.phone}`;
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="gsos-page">
        <div className="gsos-loading">
          <h2>Loading SOS Status...</h2>
        </div>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="gsos-page">
        <div className="gsos-empty">
          <AlertTriangle size={40} />
          <h2>{error}</h2>
        </div>
      </div>
    );
  }

  // ================= EMPTY =================

  if (!sosData) {
    return (
      <div className="gsos-page">
        <div className="gsos-empty">
          <ShieldCheck size={40} />
          <h2>No Data Available</h2>
        </div>
      </div>
    );
  }

  // ================= MAIN =================

  return (
    <div className="gsos-page">
      {/* HEADER */}

      <div className="gsos-header">
        <div>
          <h1>SOS Alerts</h1>
          <p>Real-time emergency status of {sosData.name}</p>
        </div>

        <div
          className={`gsos-online-badge ${
            sosData.online ? "online" : "offline"
          }`}
        >
          {sosData.online ? "🟢 Online" : `⚫ ${sosData.lastSeen || "Offline"}`}
        </div>
      </div>

      {/* ================= ACTIVE SOS ================= */}

      {sosData.sosActive ? (
        <div className="gsos-alert-card active">
          <div className="gsos-alert-top">
            <div className="gsos-siren-circle">
              <Siren size={40} />
            </div>

            <div>
              <h2>Emergency SOS Active</h2>

              <p>{sosData.name} has triggered an emergency alert</p>

              <span className="gsos-time">
                <Clock size={14} /> Started {getTimeAgo(sosData.sosStartedAt)}
              </span>
            </div>
          </div>

          <div className="gsos-location-box">
            <MapPin size={20} />

            <div>
              <h4>Current Location</h4>

              <p>
                {sosData.location.address ||
                  sosData.location.currentLocation ||
                  "Location Unavailable"}
              </p>

              {sosData.location.latitude && (
                <small>
                  {sosData.location.latitude}, {sosData.location.longitude}
                </small>
              )}
            </div>
          </div>

          <div className="gsos-actions">
            <button className="gsos-btn call-btn" onClick={callWoman}>
              <Phone size={18} /> Call {sosData.name}
            </button>

            <button className="gsos-btn direction-btn" onClick={openDirections}>
              <Navigation2 size={18} /> Get Directions
            </button>

            {setActiveMenu && (
              <button
                className="gsos-btn location-btn"
                onClick={() => setActiveMenu("Live Location")}
              >
                <MapPin size={18} /> View Live Tracking
              </button>
            )}
          </div>

          <div className="gsos-helpline-row">
            <div>
              <h3>100</h3>
              <p>Police</p>
            </div>

            <div>
              <h3>108</h3>
              <p>Ambulance</p>
            </div>

            <div>
              <h3>1091</h3>
              <p>Women Helpline</p>
            </div>
          </div>
        </div>
      ) : (
        // ================= SAFE STATE =================

        <div className="gsos-alert-card safe">
          <div className="gsos-safe-circle">
            <ShieldCheck size={50} />
          </div>

          <h2>No Active Emergency</h2>

          <p>
            {sosData.name} is currently safe. You'll be notified instantly if
            an SOS is triggered.
          </p>

          <div className="gsos-location-box">
            <MapPin size={20} />

            <div>
              <h4>Last Known Location</h4>

              <p>
                {sosData.location.address ||
                  sosData.location.currentLocation ||
                  "Location Unavailable"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}