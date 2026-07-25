import React, { useEffect, useState } from "react";
import axios from "axios";
import "./GuardianRequests.css";

export default function GuardianRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/guardian/requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const acceptRequest = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/guardian/accept/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchRequests();
    } catch (err) {
      console.log(err);
    }
  };

  const rejectRequest = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/guardian/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchRequests();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="guardian-request-page">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="guardian-request-page">

      <h1>Guardian Requests</h1>

      {requests.length === 0 ? (
        <div className="empty-box">
          No Pending Requests
        </div>
      ) : (
        requests.map((item) => (
          <div className="request-card" key={item._id}>

            <div>

              <h2>{item.womanId.name}</h2>

              <p>{item.womanId.email}</p>

            </div>

            <div className="request-buttons">

              <button
                className="accept-btn"
                onClick={() => acceptRequest(item._id)}
              >
                Accept
              </button>

              <button
                className="reject-btn"
                onClick={() => rejectRequest(item._id)}
              >
                Reject
              </button>

            </div>

          </div>
        ))
      )}

    </div>
  );
}