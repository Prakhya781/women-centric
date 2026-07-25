import React from "react";

import { Routes, Route } from "react-router-dom";

import SafetyAppWelcome from "./components/SafetyAppWelcome";

import Signup from "./components/Signup";

import WomenDashboard from "./components/WomenDashboard";
import PublicTrackingPage from "./pages/PublicTrackingPage";

import GuardianDashboard from "./components/GuardianDashboard";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SafetyAppWelcome />} />

      <Route path="/signup" element={<Signup />} />

      <Route path="/women-dashboard" element={<WomenDashboard />} />
      <Route
    path="/track/:token"
    element={<PublicTrackingPage/>}
/>

      <Route path="/guardian-dashboard" element={<GuardianDashboard />} />
    </Routes>
  );
}

export default App;
