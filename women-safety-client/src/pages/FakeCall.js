import React, { useState, useEffect } from "react";
import axios from "axios";

import { Phone, PhoneOff, User } from "lucide-react";

import "./FakeCall.css";

export default function FakeCall() {
  const [callerName, setCallerName] = useState("Mom");

  const [callerNumber, setCallerNumber] = useState("9876543210");

  const [delay, setDelay] = useState(30);

  const [incomingCall, setIncomingCall] = useState(false);
  const [ringtone, setRingtone] = useState(null);
  const [callConnected, setCallConnected] = useState(false);

  const [callTimer, setCallTimer] = useState(0);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    let timer;

    if (callConnected) {
      timer = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [callConnected]);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://women-centric-hzmm.onrender.com/api/fake-call/settings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCallerName(res.data.fakeCallName || "Mom");

      setCallerNumber(res.data.fakeCallNumber || "9876543210");
    } catch (error) {
      console.log(error);
    }
  };

  const saveSettings = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "https://women-centric-hzmm.onrender.com/api/fake-call/save",
        {
          fakeCallName: callerName,
          fakeCallNumber: callerNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Settings Saved");
    } catch (error) {
      console.log(error);
    }
  };

  const scheduleFakeCall = () => {
    alert(`Fake Call Scheduled in ${delay} seconds`);

    setTimeout(() => {
      const audio = new Audio("/ringtone.mp3");

      audio.loop = true;

      audio.play().catch((err) => {
        console.log("Ringtone Error:", err);
      });

      setRingtone(audio);

      setIncomingCall(true);
    }, delay * 1000);
  };

  const acceptCall = () => {
    if (ringtone) {
      ringtone.pause();
      ringtone.currentTime = 0;
    }

    setIncomingCall(false);
    setCallConnected(true);
  };

  const declineCall = () => {
    if (ringtone) {
      ringtone.pause();
      ringtone.currentTime = 0;
    }

    setIncomingCall(false);
  };

  const endCall = () => {
    setCallConnected(false);

    setCallTimer(0);
  };

  const formatTime = () => {
    const mins = Math.floor(callTimer / 60);

    const secs = callTimer % 60;

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (incomingCall) {
    return (
      <div className="incoming-call-screen">
        <div className="caller-avatar">
          <User size={60} />
        </div>

        <h1>{callerName}</h1>

        <p>{callerNumber}</p>

        <h3>Incoming Call...</h3>

        <div className="call-actions">
          <button className="accept-btn" onClick={acceptCall}>
            <Phone size={24} />
          </button>

          <button className="decline-btn" onClick={declineCall}>
            <PhoneOff size={24} />
          </button>
        </div>
      </div>
    );
  }

  if (callConnected) {
    return (
      <div className="call-connected-screen">
        <div className="caller-avatar">
          <User size={60} />
        </div>

        <h1>{callerName}</h1>

        <p>{formatTime()}</p>

        <audio controls autoPlay>
          <source src="/conversation.mp3" type="audio/mpeg" />
        </audio>

        <button className="fake-call-end-call-btn" onClick={endCall}>
          End Call
        </button>
      </div>
    );
  }
  return (
    <div className="fake-call-page">
      <div className="fakecall-page-header">
        <h1>📞 Fake Call Protection</h1>

        <p>
          Schedule a realistic incoming call and safely exit uncomfortable
          situations.
        </p>
      </div>

      {/* TOP CARDS */}

      <div className="fakecall-top-grid">
        <div className="fakecall-stat-card">
          <Phone size={30} />

          <h3>Quick Escape</h3>

          <p>Receive a realistic incoming call instantly.</p>
        </div>

        <div className="fakecall-stat-card">
          <User size={30} />

          <h3>Custom Caller</h3>

          <p>Mom, Dad, Friend, Boss or anyone.</p>
        </div>

        <div className="fakecall-stat-card">
          <PhoneOff size={30} />

          <h3>Safe Exit</h3>

          <p>Leave uncomfortable situations naturally.</p>
        </div>
      </div>

      <div className="fakecall-main-grid">
        <div className="fake-call-card">
          <h2>Configure Fake Call</h2>

          <label>Caller Name</label>

          <input
            type="text"
            value={callerName}
            onChange={(e) => setCallerName(e.target.value)}
          />

          <label>Caller Number</label>

          <input
            type="text"
            value={callerNumber}
            onChange={(e) => setCallerNumber(e.target.value)}
          />

          <label>Call Delay</label>

          <select
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
          >
            <option value={5}>5 Seconds</option>

            <option value={30}>30 Seconds</option>

            <option value={60}>1 Minute</option>

            <option value={120}>2 Minutes</option>

            <option value={300}>5 Minutes</option>
          </select>

          <div className="button-row">
            <button className="save-btn" onClick={saveSettings}>
              Save Settings
            </button>

            <button className="schedule-btn" onClick={scheduleFakeCall}>
              Schedule Call
            </button>
          </div>
        </div>

        {/* SIDE INFO CARD */}

        <div className="fakecall-info-card">
          <h2>How It Helps</h2>

          <div className="info-item">
            <h4>📞 Emergency Escape</h4>

            <p>Receive a realistic incoming call when you need a quick exit.</p>
          </div>

          <div className="info-item">
            <h4>🎭 Realistic Experience</h4>

            <p>Incoming call screen, ringtone and conversation support.</p>
          </div>

          <div className="info-item">
            <h4>🛡 Personal Safety</h4>

            <p>
              Useful during travel, public transport and unknown situations.
            </p>
          </div>
        </div>
      </div>

      {/* FEATURES */}

      <div className="fakecall-features">
        <div className="feature-box">
          <h4>🔊 Custom Ringtone</h4>

          <p>Play ringtone before call is answered.</p>
        </div>

        <div className="feature-box">
          <h4>🎤 Fake Conversation</h4>

          <p>Audio plays after call is accepted.</p>
        </div>

        <div className="feature-box">
          <h4>⏰ Scheduled Trigger</h4>

          <p>Get call after selected delay.</p>
        </div>
      </div>

      <div className="fakecall-tip-card">
        <h3>💡 Safety Tip</h3>

        <p>
          Use Fake Call whenever you feel uncomfortable or need a natural excuse
          to leave a situation safely.
        </p>
      </div>
    </div>
  );
}
