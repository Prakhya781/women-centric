// src/components/AuthPage.js

import React, { useState } from "react";

import axios from "axios";

import { useLocation, useNavigate } from "react-router-dom";

import { ShieldCheck, User, Users, Lock, Mail, Phone } from "lucide-react";

import "./Signup.css";

import heroImage from "../assets/women-safety-hero.png";

export default function Signup() {
  const location = useLocation();

  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);

  const role = queryParams.get("role");

  const [activeTab, setActiveTab] = useState("signup");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",

    emergencyContact1: "",
    emergencyContact2: "",

    bloodGroup: "",

    guardianEmail: "",
    guardianPhone: "",

    relationship: "",

    liveLocation: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ================= SIGNUP =================

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://women-centric-hzmm.onrender.com/api/auth/signup",
        {
          ...formData,
          role,
        },
      );

      console.log("SIGNUP RESPONSE:", response.data);

      // ================= SAVE TOKEN =================

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // ================= SAVE ROLE =================

      const userRole = response?.data?.user?.role;

      if (userRole) {
        localStorage.setItem("role", userRole);
      }

      alert(response.data.message || "Signup Successful");

      // ================= ROLE BASED REDIRECT =================

      if (userRole === "guardian") {
        navigate("/guardian-dashboard");
      } else {
        navigate("/women-dashboard");
      }
    } catch (error) {
      console.log("SIGNUP ERROR:", error);

      console.log("BACKEND ERROR:", error?.response?.data);

      alert(error?.response?.data?.message || "Signup Failed");
    }
  };

  // ================= LOGIN =================

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://women-centric-hzmm.onrender.com/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
      );

      console.log("LOGIN RESPONSE:", response.data);

      // ================= SAVE TOKEN =================

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // ================= GET ROLE =================

      const userRole = response?.data?.user?.role;

      if (userRole) {
        localStorage.setItem("role", userRole);
      }

      alert(response.data.message || "Login Successful");

      // ================= ROLE BASED REDIRECT =================

      if (userRole === "guardian") {
        navigate("/guardian-dashboard");
      } else {
        navigate("/women-dashboard");
      }
    } catch (error) {
      console.log("LOGIN ERROR:", error);

      console.log("BACKEND ERROR:", error?.response?.data);

      alert(error?.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div
      className="auth-page"
      style={{
        backgroundImage: `url(${heroImage})`,
      }}
    >
      {/* DARK OVERLAY */}

      <div className="overlay"></div>

      {/* GLOW EFFECTS */}

      <div className="pink-glow"></div>
      <div className="purple-glow"></div>

      {/* LOGO */}

      <div className="logo-area">
        <div className="logo-circle">
          <ShieldCheck className="logo-icon" />
        </div>

        <div>
          <h2>SafeHer</h2>
          <p>Women Safety Platform</p>
        </div>
      </div>

      {/* GLASS CARD */}

      <div className="auth-card">
        {/* ROLE BADGE */}

        <div className="role-badge">
          {role === "user" ? (
            <>
              <User size={18} />
              <span>Woman / User</span>
            </>
          ) : (
            <>
              <Users size={18} />
              <span>Guardian / Parent</span>
            </>
          )}
        </div>

        {/* TOGGLE */}

        <div className="toggle-area">
          <button
            type="button"
            className={activeTab === "signup" ? "active-btn" : ""}
            onClick={() => setActiveTab("signup")}
          >
            Signup
          </button>

          <button
            type="button"
            className={activeTab === "login" ? "active-btn" : ""}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
        </div>

        {/* HEADING */}

        <h1>
          {activeTab === "signup" ? "Create Secure Account" : "Welcome Back"}
        </h1>

        <p className="subtitle">
          AI powered safety ecosystem for women and guardians
        </p>

        {/* ================= SIGNUP FORM ================= */}

        {activeTab === "signup" ? (
          <form onSubmit={handleSignup}>
            <div className="women-input-box">
              <User className="women-input-icon" />

              <input
                type="text"
                placeholder="Full Name"
                name="name"
                onChange={handleChange}
                required
              />
            </div>

            <div className="women-input-box">
              <Mail className="women-input-icon" />

              <input
                type="email"
                placeholder="Email Address"
                name="email"
                onChange={handleChange}
                required
              />
            </div>

            <div className="women-input-box">
              <Phone className="women-input-icon" />

              <input
                type="text"
                placeholder="Phone Number"
                name="phone"
                onChange={handleChange}
                required
              />
            </div>

            <div className="women-input-box">
              <Lock className="women-input-icon" />

              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                required
              />
            </div>

            {/* ================= WOMAN FIELDS ================= */}

            {role === "user" && (
              <>
                <input
                  className="extra-input"
                  type="text"
                  placeholder="Emergency Contact 1"
                  name="emergencyContact1"
                  onChange={handleChange}
                />

                <input
                  className="extra-input"
                  type="text"
                  placeholder="Emergency Contact 2"
                  name="emergencyContact2"
                  onChange={handleChange}
                />

                <input
                  className="extra-input"
                  type="text"
                  placeholder="Blood Group"
                  name="bloodGroup"
                  onChange={handleChange}
                />

                <input
                  className="extra-input"
                  type="email"
                  placeholder="Guardian Email"
                  name="guardianEmail"
                  onChange={handleChange}
                />

                <input
                  className="extra-input"
                  type="text"
                  placeholder="Guardian Phone"
                  name="guardianPhone"
                  onChange={handleChange}
                />

                <div className="checkbox-area">
                  <input
                    type="checkbox"
                    name="liveLocation"
                    onChange={handleChange}
                  />

                  <label>Enable Live Location Access</label>
                </div>
              </>
            )}

            {/* ================= GUARDIAN FIELDS ================= */}

            {role === "guardian" && (
              <select name="relationship" onChange={handleChange}>
                <option value="">Select Relationship</option>

                <option value="Father">Father</option>

                <option value="Mother">Mother</option>

                <option value="Brother">Brother</option>

                <option value="Friend">Friend</option>

                <option value="Husband">Husband</option>
              </select>
            )}

            <button className="submit-btn">Create Account</button>
          </form>
        ) : (
          // ================= LOGIN FORM =================

          <form onSubmit={handleLogin}>
            <div className="women-input-box">
              <Mail className="women-input-icon" />

              <input
                type="email"
                placeholder="Email Address"
                name="email"
                onChange={handleChange}
                required
              />
            </div>

            <div className="women-input-box">
              <Lock className="women-input-icon" />

              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                required
              />
            </div>

            <button className="submit-btn">Login Securely</button>
          </form>
        )}
      </div>
    </div>
  );
}
