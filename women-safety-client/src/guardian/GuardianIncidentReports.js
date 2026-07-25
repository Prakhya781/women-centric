import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { AlertTriangle, MapPin } from "lucide-react";

import "./GuardianIncidentReports.css";

export default function GuardianIncidentReports() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchIncidents = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://women-centric-hzmm.onrender.com/api/guardian/incidents",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setIncidents(res.data.incidents);
        setError("");
      }
    } catch (err) {
      console.log(err);

      setError(err?.response?.data?.message || "Failed to load incidents");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();

    const interval = setInterval(fetchIncidents, 15000);

    return () => clearInterval(interval);
  }, [fetchIncidents]);

  if (loading) {
    return (
      <div className="gincident-page">
        <div className="gincident-loading">
          <h2>Loading Incident Reports...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gincident-page">
        <div className="gincident-empty">
          <AlertTriangle size={40} />
          <h2>{error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="gincident-page">
      <div className="gincident-header">
        <div>
          <h1>Incident Reports</h1>
          <p>Incidents reported by the linked woman</p>
        </div>
      </div>

      {incidents.length === 0 ? (
        <div className="gincident-empty">
          <AlertTriangle size={40} />
          <h2>No Incidents Reported</h2>
          <p>No incident reports have been filed yet.</p>
        </div>
      ) : (
        <div className="gincident-grid">
          {incidents.map((item) => (
            <div className="gincident-card" key={item._id}>
              <div className="gincident-top">
                <h3>{item.title}</h3>

                <span className="gincident-risk">{item.category}</span>
              </div>

              <p className="gincident-desc">{item.description}</p>

              <div className="gincident-meta">
                <div>
                  <MapPin size={16} />
                  <span>{item.location || "Location not specified"}</span>
                </div>
              </div>

              <div className="gincident-footer">
                <small>{new Date(item.createdAt).toLocaleString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}