// ============================================================
// 11. src/guardian/GuardianProfile.js
// (Guardian edits ONLY his own profile — reuses existing
//  /api/auth/profile + /api/auth/update-profile endpoints)
// ============================================================

import React, { useEffect, useState } from "react";
import axios from "axios";

import { User, Mail, Phone, Save, Users } from "lucide-react";

import "./GuardianProfile.css";

export default function GuardianProfile() {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    relationship: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("https://women-centric-hzmm.onrender.com/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfileData(res.data.user);
      setError("");
    } catch (err) {
      console.log(err);

      setError("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const res = await axios.put(
        "https://women-centric-hzmm.onrender.com/api/auth/update-profile",
        {
          name: profileData.name,
          phone: profileData.phone,
          relationship: profileData.relationship,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message || "Profile Updated");
    } catch (err) {
      console.log(err);

      alert("Profile Update Failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="gprofile-page">
        <div className="gprofile-loading">
          <h2>Loading Profile...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gprofile-page">
        <div className="gprofile-loading">
          <h2>{error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="gprofile-page">
      <div className="gprofile-topbar">
        <div>
          <h1>Profile Settings</h1>
          <p>Manage your guardian account information</p>
        </div>

        <button
          className="gprofile-save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="gprofile-card">
        <div className="gprofile-header">
          <div className="gprofile-avatar">
            <Users size={30} />
          </div>

          <div>
            <h2>{profileData.name}</h2>
            <p>Guardian Account</p>
          </div>
        </div>

        <div className="gprofile-form">
          <div className="gprofile-input-group">
            <label>Full Name</label>

            <div className="gprofile-input">
              <User className="gprofile-icon" />

              <input
                type="text"
                name="name"
                value={profileData.name || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="gprofile-input-group">
            <label>Email Address</label>

            <div className="gprofile-input disabled">
              <Mail className="gprofile-icon" />

              <input type="email" value={profileData.email || ""} disabled />
            </div>
          </div>

          <div className="gprofile-input-group">
            <label>Phone Number</label>

            <div className="gprofile-input">
              <Phone className="gprofile-icon" />

              <input
                type="text"
                name="phone"
                value={profileData.phone || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="gprofile-input-group">
            <label>Relationship</label>

            <select
              name="relationship"
              value={profileData.relationship || ""}
              onChange={handleChange}
              className="gprofile-select"
            >
              <option value="">Select Relationship</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Brother">Brother</option>
              <option value="Friend">Friend</option>
              <option value="Husband">Husband</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}