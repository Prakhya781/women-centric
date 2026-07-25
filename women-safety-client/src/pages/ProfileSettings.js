import React, { useEffect, useState } from "react";

import axios from "axios";

import { User, Mail, Phone, Save, Camera, Link, MapPin } from "lucide-react";

import "./ProfileSettings.css";

export default function ProfileSettings() {
  const [guardianStatus, setGuardianStatus] = useState("Not Linked");
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    bloodGroup: "",
    emergencyContact1: "",
    emergencyContact2: "",
    guardianEmail: "",
    guardianPhone: "",
    liveLocation: false,
    currentLocation: "",
  });

  const [loading, setLoading] = useState(true);

  const [linkingGuardian, setLinkingGuardian] = useState(false);

  // ================= FETCH PROFILE =================

  useEffect(() => {
  fetchProfile();
  fetchGuardianStatus();
}, []);

  // ================= LOCATION TRACKER =================

  useEffect(() => {
    if (profileData.liveLocation) {
      getCurrentLocation();
    }
  }, [profileData.liveLocation]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
          );

          const locationName =
            response.data.address.city ||
            response.data.address.town ||
            response.data.address.village ||
            "Unknown Location";

          setProfileData((prev) => ({
            ...prev,
            currentLocation: locationName,
          }));
        } catch (error) {
          console.log(error);
        }
      },
      (error) => {
        console.log(error);
      },
    );
  };
  const fetchGuardianStatus = async () => {
  try {

    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/api/guardian/my-status",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setGuardianStatus(res.data.status);

  } catch (err) {
    console.log(err);
  }
};

  // ================= FETCH PROFILE =================

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProfileData(response.data.user);

      setLoading(false);
    } catch (error) {
      console.log(error);

      alert("Failed to fetch profile");
    }
  };

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProfileData({
      ...profileData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ================= SAVE PROFILE =================

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:5000/api/auth/update-profile",
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(response.data.message);
    } catch (error) {
      console.log(error);

      alert("Profile Update Failed");
    }
  };

  // ================= LINK GUARDIAN =================
const handleGuardianLink = async () => {
  try {

    setLinkingGuardian(true);

    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/guardian/send-request",
      {
        guardianEmail: profileData.guardianEmail,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Guardian Request Sent");

    fetchGuardianStatus();

  } catch (err) {

    alert(err.response?.data?.message);

  } finally {

    setLinkingGuardian(false);

  }
};
  if (loading) {
    return (
      <div className="loading-box">
        <h2>Loading Profile...</h2>
      </div>
    );
  }

  return (
    <div className="profile-settings-page">
      {/* TOPBAR */}

      <div className="profile-topbar">
        <div>
          <h1>Profile Settings</h1>

          <p>Manage your personal and emergency information</p>
        </div>

        <button className="profile-save-btn" onClick={handleSave}>
          <Save size={18} />
          Save Changes
        </button>
      </div>

      {/* PROFILE CARD */}

      <div className="profile-card">
        {/* PROFILE HEADER */}

        <div className="profile-header">
          <div className="profile-image">
            <Camera size={30} />
          </div>

          <div>
            <h2>{profileData.name}</h2>

            <p>Women Safety User</p>
          </div>
        </div>

        {/* FORM */}

        <div className="profile-form">
          {/* NAME */}

          <div className="input-group">
            <label>Full Name</label>

            <div className="dashboard-input">
              <User className="dashboard-icon" />

              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* EMAIL */}

          <div className="input-group">
            <label>Email Address</label>

            <div className="dashboard-input">
              <Mail className="dashboard-icon" />

              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* PHONE */}

          <div className="input-group">
            <label>Phone Number</label>

            <div className="dashboard-input">
              <Phone className="dashboard-icon" />

              <input
                type="text"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* BLOOD GROUP */}

          <div className="input-group">
            <label>Blood Group</label>

            <input
              type="text"
              className="simple-input"
              name="bloodGroup"
              value={profileData.bloodGroup}
              onChange={handleChange}
            />
          </div>

          {/* EMERGENCY CONTACT 1 */}

          <div className="input-group">
            <label>Emergency Contact 1</label>

            <input
              type="text"
              className="simple-input"
              name="emergencyContact1"
              value={profileData.emergencyContact1}
              onChange={handleChange}
            />
          </div>

          {/* EMERGENCY CONTACT 2 */}

          <div className="input-group">
            <label>Emergency Contact 2</label>

            <input
              type="text"
              className="simple-input"
              name="emergencyContact2"
              value={profileData.emergencyContact2}
              onChange={handleChange}
            />
          </div>

          {/* GUARDIAN EMAIL */}

          <div className="input-group">
            <label>Guardian Email</label>

            <input
              type="email"
              className="simple-input"
              name="guardianEmail"
              value={profileData.guardianEmail}
              onChange={handleChange}
            />
          </div>

          {/* GUARDIAN PHONE */}

          <div className="input-group">
            <label>Guardian Phone</label>

            <input
              type="text"
              className="simple-input"
              name="guardianPhone"
              value={profileData.guardianPhone}
              onChange={handleChange}
            />
          </div>

          {/* LINK GUARDIAN BUTTON */}

          <div className="profile-guardian-link-box">
            <div>
              <h3>Link Guardian</h3>

              <p>
                Connect your trusted guardian securely with email verification
              </p>
            </div>
<div>

  <button
    className="guardian-link-btn"
    onClick={handleGuardianLink}
    disabled={
      guardianStatus === "Pending" ||
      guardianStatus === "Accepted"
    }
  >
    <Link size={18} />

    {linkingGuardian
      ? "Sending..."
      : guardianStatus === "Pending"
      ? "Request Pending"
      : guardianStatus === "Accepted"
      ? "Guardian Linked ✓"
      : "Link Guardian"}

  </button>

  <p
    style={{
      marginTop: "10px",
      fontWeight: 600,
      color:
        guardianStatus === "Accepted"
          ? "#22c55e"
          : guardianStatus === "Pending"
          ? "#f59e0b"
          : guardianStatus === "Rejected"
          ? "#ef4444"
          : "#888",
    }}
  >

    {guardianStatus === "Accepted" &&
      "Guardian already linked."}

    {guardianStatus === "Pending" &&
      "Waiting for guardian approval."}

    {guardianStatus === "Rejected" &&
      "Previous request rejected. You can send another request."}

    {guardianStatus === "Not Linked" &&
      "No guardian linked."}

  </p>

</div>
          </div>

          {/* LIVE LOCATION */}

          <div className="live-location-box">
            <div>
              <h3>Enable Live Location</h3>

              <p>
                Share your real-time location with guardians during emergency
              </p>

              {profileData.liveLocation && (
                <div className="location-name">
                  <MapPin size={16} />

                  <span>{profileData.currentLocation}</span>
                </div>
              )}
            </div>

            <label className="switch">
              <input
                type="checkbox"
                name="liveLocation"
                checked={profileData.liveLocation}
                onChange={handleChange}
              />

              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
