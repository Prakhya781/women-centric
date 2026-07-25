import React, { useEffect, useState, useCallback } from "react";

import axios from "axios";

import "./Notifications.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const token = localStorage.getItem("token");

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://women-centric-hzmm.onrender.com/api/notifications/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setNotifications(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const deleteNotification = async (id) => {
    try {
      await axios.delete(
        `https://women-centric-hzmm.onrender.com/api/notifications/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="notifications-page">
      <h1>🔔 Notifications</h1>

      {notifications.length === 0 ? (
        <p>No notifications found</p>
      ) : (
        notifications.map((item) => (
          <div className="notification-card" key={item._id}>
            <h3>{item.title}</h3>

            <p>{item.message}</p>

            <small>{new Date(item.createdAt).toLocaleString()}</small>

            <button onClick={() => deleteNotification(item._id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}
