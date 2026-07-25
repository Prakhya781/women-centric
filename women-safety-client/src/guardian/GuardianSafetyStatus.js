// ============================================================
// 7. src/guardian/GuardianSafetyStatus.js
// ============================================================

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import {
  ShieldCheck,
  BatteryCharging,
  MapPin,
  Wifi,
  WifiOff,
  Siren,
  Clock,
} from "lucide-react";

import "./GuardianSafetyStatus.css";

export default function GuardianSafetyStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/guardian/safety-status",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setStatus(res.data.status);
        setError("");
      }
    } catch (err) {
      console.log(err);

      setError(err?.response?.data?.message || "Failed to load safety status");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();

    const interval = setInterval(fetchStatus, 8000);

    return () => clearInterval(interval);
  }, [fetchStatus]);

  const getBatteryColor = (level) => {
    if (level <= 20) return "#ef4444";
    if (level <= 50) return "#f59e0b";
    return "#22c55e";
  };

  if (loading) {
    return (
      <div className="gsafety-page">
        <div className="gsafety-loading">
          <h2>Loading Safety Status...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gsafety-page">
        <div className="gsafety-empty">
          <ShieldCheck size={40} />
          <h2>{error}</h2>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="gsafety-page">
        <div className="gsafety-empty">
          <ShieldCheck size={40} />
          <h2>No Data Available</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="gsafety-page">
      <div className="gsafety-header">
        <div>
          <h1>Safety Status</h1>
          <p>Live safety overview of {status.name}</p>
        </div>
      </div>

      <div className="gsafety-grid">
        <div
          className={`gsafety-card ${
            status.safetyStatus === "SAFE" ? "safe" : "danger"
          }`}
        >
          <ShieldCheck size={30} />
          <h4>Overall Status</h4>
          <h2>{status.safetyStatus}</h2>
        </div>

        <div className="gsafety-card">
          <BatteryCharging
            size={30}
            color={getBatteryColor(status.battery)}
          />
          <h4>Battery Level</h4>
          <h2 style={{ color: getBatteryColor(status.battery) }}>
            {status.battery}%
          </h2>
        </div>

        <div className={`gsafety-card ${status.online ? "safe" : ""}`}>
          {status.online ? <Wifi size={30} /> : <WifiOff size={30} />}
          <h4>Connectivity</h4>
          <h2>{status.online ? "Online" : "Offline"}</h2>
          {!status.online && <p>Last seen: {status.lastSeen}</p>}
        </div>

        <div
          className={`gsafety-card ${status.sosActive ? "danger" : "safe"}`}
        >
          <Siren size={30} />
          <h4>SOS Status</h4>
          <h2>{status.sosActive ? "ACTIVE" : "Normal"}</h2>
        </div>
      </div>

      <div className="gsafety-detail-card">
        <div className="gsafety-detail-row">
          <MapPin size={22} color="#8b5cf6" />
          <div>
            <h4>Current Location</h4>
            <p>{status.currentLocation || "Not Available"}</p>
          </div>
        </div>
        <div className="gsafety-detail-row">
  <MapPin size={22} color="#ff4da6" />
  <div>
    <h4>Coordinates</h4>
    <p>
      {status.latitude && status.longitude
        ? `${status.latitude}, ${status.longitude}`
        : "Not Available"}
    </p>
  </div>
</div>

        <div className="gsafety-detail-row">
          <ShieldCheck
            size={22}
            color={status.liveLocationEnabled ? "#22c55e" : "#6b7280"}
          />
          <div>
            <h4>Live Location Sharing</h4>
            <p>{status.liveLocationEnabled ? "Enabled" : "Disabled"}</p>
          </div>
        </div>

        <div className="gsafety-detail-row">
          <Clock size={22} color="#f59e0b" />
          <div>
            <h4>Last Location Update</h4>
            <p>
              {status.locationUpdatedAt
                ? new Date(status.locationUpdatedAt).toLocaleString()
                : "Not Available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}