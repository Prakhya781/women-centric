// ============================================================
// 3. src/guardian/GuardianNotifications.js
// ============================================================

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { Bell, ShieldAlert, Sparkles, FileWarning, Users } from "lucide-react";

import "./GuardianNotifications.css";

export default function GuardianNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/guardian/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setNotifications(res.data.notifications);
        setError("");
      }
    } catch (err) {
      console.log(err);

      setError(
        err?.response?.data?.message || "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const getIcon = (type) => {
    switch (type) {
      case "SOS":
        return <ShieldAlert size={22} color="#ef4444" />;

      case "AI":
        return <Sparkles size={22} color="#8b5cf6" />;

      case "REPORT":
        return <FileWarning size={22} color="#f59e0b" />;

      case "GUARDIAN":
        return <Users size={22} color="#22c55e" />;

      default:
        return <Bell size={22} color="#ff4da6" />;
    }
  };

  if (loading) {
    return (
      <div className="gnotif-page">
        <div className="gnotif-loading">
          <h2>Loading Notifications...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gnotif-page">
        <div className="gnotif-empty">
          <Bell size={40} />
          <h2>{error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="gnotif-page">
      <div className="gnotif-header">
        <div>
          <h1>Notifications</h1>
          <p>Recent alerts and updates about the linked woman</p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="gnotif-empty">
          <Bell size={40} />
          <h2>No Notifications</h2>
          <p>There are no notifications to show right now.</p>
        </div>
      ) : (
        <div className="gnotif-list">
          {notifications.map((item) => (
            <div className={`gnotif-card ${item.type?.toLowerCase()}`} key={item._id}>
              <div className="gnotif-icon">{getIcon(item.type)}</div>

              <div className="gnotif-content">
                <h4>{item.title}</h4>
                <p>{item.message}</p>
                <small>{new Date(item.createdAt).toLocaleString()}</small>
              </div>

              {!item.isRead && <span className="gnotif-dot" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}