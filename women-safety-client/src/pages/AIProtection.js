import React, { useState, useEffect } from "react";
import axios from "axios";
import "./aiAssistant.css";

const AIProtection = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [isSendingSOS, setIsSendingSOS] = useState(false);
  const [isSendingGuardian, setIsSendingGuardian] = useState(false);

  const token = localStorage.getItem("token");

  // Get current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setLocation({ lat, lng });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          );

          const data = await res.json();

          setAddress(data.display_name || "Location Found");
        } catch (err) {
          console.log(err);
        }
      },
      (err) => console.log(err),
    );
  }, []);

  // AI Analysis
  const checkSafety = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);

      const res = await axios.post(
        "https://women-centric-hzmm.onrender.com/api/ai/analyze",
        {
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setResult(res.data);

      setHistory((prev) => [
        {
          message,
          riskLevel: res.data.riskLevel,
          date: new Date().toLocaleString(),
        },
        ...prev,
      ]);

      if (res.data.riskLevel === "HIGH" || res.data.shouldTriggerSOS) {
        await triggerSOS();
        await notifyGuardian();
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // SOS
  const triggerSOS = async () => {
    try {
      setIsSendingSOS(true);

      await axios.post(
        "https://women-centric-hzmm.onrender.com/api/sos/trigger",
        {
          message,
          location,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("🚨 SOS Triggered Successfully");
    } catch (err) {
      console.log(err);
      alert("Failed to trigger SOS");
    } finally {
      setIsSendingSOS(false);
    }
  };

  // Guardian Alert
  const notifyGuardian = async () => {
    try {
      setIsSendingGuardian(true);

      const res = await axios.post(
        "https://women-centric-hzmm.onrender.com/api/guardian-alert/alert",
        {
          message,
          riskLevel: result?.riskLevel || "HIGH",
          location,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(res.data.message);
    } catch (err) {
      console.log(err);

      alert(err?.response?.data?.message || "Failed to notify guardian");
    } finally {
      setIsSendingGuardian(false);
    }
  };

  // Police Station Search
  const findPoliceStation = () => {
    if (!location) {
      alert("Location unavailable");
      return;
    }

    const url = `https://www.google.com/maps/search/police+station/@${location.lat},${location.lng},15z`;

    window.open(url, "_blank");
  };
  const findHospital = () => {
    if (!location) return;

    window.open(
      `https://www.google.com/maps/search/hospital/@${location.lat},${location.lng},15z`,
      "_blank",
    );
  };

  const findSafePlace = () => {
    if (!location) return;

    window.open(
      `https://www.google.com/maps/search/women+help+center/@${location.lat},${location.lng},15z`,
      "_blank",
    );
  };

  const getRiskColor = (risk) => {
    if (risk === "HIGH") return "#ff4d6d";
    if (risk === "MEDIUM") return "#f59e0b";
    return "#22c55e";
  };

  return (
    <div className="ai-page">
      {/* Header */}

      <div className="ai-header">
        <h1>🛡 AI Protection</h1>

        <p>Analyze your situation and get instant safety guidance</p>
      </div>

      {/* Input Card */}

      <div className="ai-card">
        <h3>Describe Your Situation</h3>

        <textarea
          placeholder="Example: Someone is following me at night..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="quick-prompts">
          <button onClick={() => setMessage("Someone is following me")}>
            Someone is following me
          </button>

          <button onClick={() => setMessage("I feel unsafe in a cab")}>
            Unsafe Cab
          </button>

          <button onClick={() => setMessage("Harassment nearby")}>
            Harassment
          </button>

          <button onClick={() => setMessage("I am lost in an unknown area")}>
            Lost
          </button>
        </div>

        <button className="analyze-btn" onClick={checkSafety}>
          {loading ? "Analyzing..." : "Check Safety"}
        </button>
      </div>
      <div className="location-card">
        <h3>📍 Current Location</h3>

        <p>{address || "Fetching Location..."}</p>

        {location && (
          <small>
            {location.lat.toFixed(4)} ,{location.lng.toFixed(4)}
          </small>
        )}
      </div>

      {/* Result */}

      {result && (
        <div className="result-card">
          <div className="risk-header">
            <h2>Risk Level</h2>

            <span
              className="risk-badge"
              style={{
                background: getRiskColor(result.riskLevel),
              }}
            >
              {result.riskLevel}
            </span>
            <div className="location-bar">
              <div className="location-card">
                <h4>📍 Current Location</h4>
                <p>{address}</p>
              </div>

              <div className="location-card">
                <h4>🌍 Coordinates</h4>
                <p>
                  {location?.lat},{location?.lng}
                </p>
              </div>
            </div>
          </div>

          {/* Meter */}

          <div className="risk-meter">
            <div
              className={`risk-fill ${result.riskLevel.toLowerCase()}`}
            ></div>
          </div>

          <p className="suggestion">{result.suggestion}</p>

          {/* Status */}

          <div className="status-grid">
            <div className="status-card">
              🚨 SOS
              <span>
                {result.shouldTriggerSOS ? "Required" : "Not Required"}
              </span>
            </div>

            <div className="status-card">
              📍 Nearby Help
              <span>{result.nearbyHelpNeeded ? "Needed" : "Not Needed"}</span>
            </div>
          </div>

          {/* Checklist */}

          <div className="checklist">
            <h3>Emergency Checklist</h3>

            <p>✅ GPS Enabled</p>
            <p>✅ Emergency Contacts Available</p>
            <p>✅ Location Sharing Ready</p>
            <p>✅ Emergency Services Reachable</p>
          </div>

          {/* Safety Tips */}

          {result.tips && (
            <div className="tips-box">
              <h3>Safety Tips</h3>

              {result.tips.map((tip, index) => (
                <p key={index}>💡 {tip}</p>
              ))}
            </div>
          )}

          {/* Actions */}

          <div className="action-buttons">
            <button className="sos-action" onClick={triggerSOS}>
              {isSendingSOS ? "Sending..." : "🚨 Trigger SOS"}
            </button>

            <button className="police-action" onClick={findPoliceStation}>
              🚓 Police Station
            </button>

            <button className="hospital-action" onClick={findHospital}>
              🏥 Hospital
            </button>

            <button className="safe-action" onClick={findSafePlace}>
              🛡 Safe Place
            </button>

            <button className="guardian-action" onClick={notifyGuardian}>
              {isSendingGuardian ? "Sending..." : "👨‍👩‍👧 Notify Guardian"}
            </button>
          </div>
        </div>
      )}

      {/* History */}
      

      {history.length > 0 && (
        <div className="history-section">
          <h2>Recent Analysis</h2>

          {history.map((item, index) => (
            <div className="history-card" key={index}>
              <div>
                <p>{item.message}</p>

                <small>{item.date}</small>
              </div>

              <span
                style={{
                  color: getRiskColor(item.riskLevel),
                }}
              >
                {item.riskLevel}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIProtection;
