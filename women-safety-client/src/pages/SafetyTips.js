// src/components/SafetyTips.js

import React, { useEffect, useState } from "react";

import axios from "axios";

import { Shield, MapPin, AlertTriangle, Phone, PhoneCall } from "lucide-react";

import "./SafetyTips.css";

export default function SafetyTips() {
  const [tips, setTips] = useState([]);

  useEffect(() => {
    fetchTips();
  }, []);

  // ================= FETCH TIPS =================

  const fetchTips = async () => {
    try {
      const response = await axios.get("https://women-centric-hzmm.onrender.com/api/tips");

      setTips(response.data.tips);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= ICONS =================

  const getIcon = (iconName) => {
    switch (iconName) {
      case "Shield":
        return <Shield size={34} />;

      case "MapPin":
        return <MapPin size={34} />;

      case "AlertTriangle":
        return <AlertTriangle size={34} />;

      case "Phone":
        return <Phone size={34} />;

      case "PhoneCall":
        return <PhoneCall size={34} />;

      default:
        return <Shield size={34} />;
    }
  };

  return (
    <div className="tips-page">
      {/* ================= HEADER ================= */}

      <div className="tips-header">
        <h1>Women Safety Tips</h1>

        <p>
          Stay aware, stay prepared, and stay safe with smart safety guidance
          designed for everyday protection.
        </p>
      </div>

      {/* ================= TIPS ================= */}

      <div className="tips-grid">
        {tips.map((tip) => (
          <div className="tip-card" key={tip._id}>
            {/* ICON */}

            <div className="tip-icon">{getIcon(tip.icon)}</div>

            {/* CONTENT */}

            <div className="tip-content">
              <span className="tip-category">{tip.category}</span>

              <h2>{tip.title}</h2>

              <p>{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
