// ============================================================
// 9. src/guardian/GuardianEmergencyContacts.js
// ============================================================

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { Phone, Mail, ShieldCheck, Users, Droplet } from "lucide-react";

import "./GuardianEmergencyContacts.css";

export default function GuardianEmergencyContacts() {
  const [contacts, setContacts] = useState([]);
  const [woman, setWoman] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchContacts = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://women-centric-hzmm.onrender.com/api/guardian/emergency-contacts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setContacts(res.data.contacts);
        setWoman(res.data.woman);
        setError("");
      }
    } catch (err) {
      console.log(err);

      setError(err?.response?.data?.message || "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  if (loading) {
    return (
      <div className="gcontacts-page">
        <div className="gcontacts-loading">
          <h2>Loading Emergency Contacts...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gcontacts-page">
        <div className="gcontacts-empty">
          <Users size={40} />
          <h2>{error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="gcontacts-page">
      <div className="gcontacts-header">
        <div>
          <h1>Emergency Contacts</h1>
          <p>Trusted contacts linked to {woman?.name || "the woman"}</p>
        </div>
      </div>

      {woman && (
        <div className="gcontacts-woman-card">
          <div className="gcontacts-woman-item">
            <Droplet size={20} color="#ff4da6" />
            <div>
              <h4>Blood Group</h4>
              <p>{woman.bloodGroup || "Not Provided"}</p>
            </div>
          </div>

          <div className="gcontacts-woman-item">
            <Phone size={20} color="#22c55e" />
            <div>
              <h4>Emergency Contact 1</h4>
              <p>{woman.emergencyContact1 || "Not Provided"}</p>
            </div>
          </div>

          <div className="gcontacts-woman-item">
            <Phone size={20} color="#8b5cf6" />
            <div>
              <h4>Emergency Contact 2</h4>
              <p>{woman.emergencyContact2 || "Not Provided"}</p>
            </div>
          </div>
        </div>
      )}

      {contacts.length === 0 ? (
        <div className="gcontacts-empty">
          <Users size={40} />
          <h2>No Emergency Contacts</h2>
          <p>No additional emergency contacts have been added yet.</p>
        </div>
      ) : (
        <div className="gcontacts-grid">
          {contacts.map((contact) => (
            <div className="gcontacts-card" key={contact._id}>
              <div className="gcontacts-top">
                <div className="gcontacts-avatar">
                  {contact.name.charAt(0)}
                </div>

                <div>
                  <h2>{contact.name}</h2>
                  <p>{contact.relation}</p>
                </div>
              </div>

              <div className="gcontacts-info">
                <div>
                  <Phone size={18} />
                  <span>{contact.phone}</span>
                </div>

                <div>
                  <Mail size={18} />
                  <span>{contact.email || "Not Provided"}</span>
                </div>
              </div>

              <div className="gcontacts-priority">
                <ShieldCheck size={16} />
                {contact.priority}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}