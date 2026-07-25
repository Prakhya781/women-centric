import React, { useState, useEffect, useCallback } from "react";

import axios from "axios";

import "./ReportIncident.css";

export default function ReportIncident() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Harassment",
    location: "",
  });

  const [reports, setReports] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  // ================= FETCH REPORTS =================

  const fetchReports = useCallback(async () => {
    try {
      const res = await axios.get("https://women-centric-hzmm.onrender.com/api/report/all");

      setReports(res.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT =================

  const submitReport = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(
          `https://women-centric-hzmm.onrender.com/api/report/update/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        alert("Report Updated Successfully");
      } else {
        await axios.post("https://women-centric-hzmm.onrender.com/api/report/create", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Incident Reported Successfully");
      }

      setFormData({
        title: "",
        description: "",
        category: "Harassment",
        location: "",
      });

      setEditingId(null);

      fetchReports();
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.message || "Something went wrong");
    }
  };

  // ================= EDIT =================

  const handleEdit = (report) => {
    setEditingId(report._id);

    setFormData({
      title: report.title,
      description: report.description,
      category: report.category,
      location: report.location,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= DELETE =================

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://women-centric-hzmm.onrender.com/api/report/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Report Deleted");

      fetchReports();
    } catch (error) {
      console.log(error);

      alert("Delete Failed");
    }
  };

  return (
    <div className="report-page">
      <div className="report-header">
        <h1>🚨 Report Incident</h1>

        <p>Help create a safer environment.</p>
      </div>

      {/* FORM */}

      <div className="report-card">
        <form onSubmit={submitReport}>
          <input
            type="text"
            name="title"
            placeholder="Incident Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option>Harassment</option>

            <option>Stalking</option>

            <option>Unsafe Area</option>

            <option>Domestic Violence</option>

            <option>Cyber Crime</option>

            <option>Other</option>
          </select>

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Describe incident..."
            value={formData.description}
            onChange={handleChange}
            required
          />

          <button className="report-btn" type="submit">
            {editingId ? "Update Report" : "Submit Report"}
          </button>
        </form>
      </div>

      {/* REPORTS */}

      <div className="reports-section">
        <h2>📍 Recent Reports</h2>

        {reports.map((report) => (
          <div className="report-item" key={report._id}>
            <div className="report-top">
              <h3>{report.title}</h3>

              <span>{report.category}</span>
            </div>

            <p>📍 {report.location}</p>

            <p>{report.description}</p>

            <small>{new Date(report.createdAt).toLocaleString()}</small>

            <div className="report-actions">
              <button className="edit-btn" onClick={() => handleEdit(report)}>
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(report._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
