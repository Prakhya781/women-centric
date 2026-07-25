import React from "react";
import { useNavigate } from "react-router-dom";

import { ShieldCheck, ChevronRight, User, Users } from "lucide-react";

import "./SafetyAppWelcome.css";

import heroImage from "../assets/women-safety-hero.png";

export default function SafetyAppWelcome() {
  const navigate = useNavigate();

  const handleRole = (role) => {
    navigate(`/signup?role=${role}`);
  };

  return (
    <div className="welcome-page">
      <div className="bg-glow glow-one"></div>
      <div className="bg-glow glow-two"></div>

      <nav className="navbar">
        <div className="logo-section">
          <div className="logo-circle">
            <ShieldCheck className="logo-icon" />
          </div>

          <div>
            <h2>SafeHer</h2>
            <p>Women Safety Platform</p>
          </div>
        </div>
      </nav>

      <div className="main-container">
        <div className="left-side">
          <div className="hero-image-wrapper">
            <div className="hero-ring"></div>

            <div className="hero-image-card">
              <img src={heroImage} alt="Women Safety" className="hero-image" />
            </div>
          </div>

          <div className="content-area">
            <div className="tagline">AI Powered Protection Platform</div>

            <h1>
              Your Safety,
              <br />
              <span>Our Priority</span>
            </h1>

            <p>
              Smart protection, AI-based threat detection, emergency SOS,
              guardian tracking, and real-time security support for women
              everywhere.
            </p>
          </div>
        </div>

        <div className="right-side">
          <div className="right-card-container">
            <h2>Choose Your Role</h2>

            <p className="right-subtitle">
              Continue securely according to your role
            </p>

            <div
              className="role-card pink-card"
              onClick={() => handleRole("user")}
            >
              <div className="card-left">
                <div className="icon-box pink-box">
                  <User className="role-icon pink-icon" />
                </div>

                <div className="role-content">
                  <span>I am a</span>

                  <h3>Woman / User</h3>

                  <p>
                    Access SOS, AI detection, emergency recording and live
                    safety tools.
                  </p>
                </div>
              </div>

              <div className="arrow-btn pink-arrow">
                <ChevronRight />
              </div>
            </div>

            <div
              className="role-card purple-card"
              onClick={() => handleRole("guardian")}
            >
              <div className="card-left">
                <div className="icon-box purple-box">
                  <Users className="role-icon purple-icon" />
                </div>

                <div className="role-content">
                  <span>I am a</span>

                  <h3 className="purple-heading">Guardian / Parent</h3>

                  <p>
                    Track live location, receive alerts, and monitor loved ones
                    in emergencies.
                  </p>
                </div>
              </div>

              <div className="arrow-btn purple-arrow">
                <ChevronRight />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
