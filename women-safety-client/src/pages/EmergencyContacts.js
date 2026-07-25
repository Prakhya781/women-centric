import React, { useEffect, useState } from "react";

import axios from "axios";

import { Plus, Phone, Mail, Trash2, Edit, ShieldCheck } from "lucide-react";

import "./EmergencyContacts.css";

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    relation: "",
    phone: "",
    email: "",
    priority: "Secondary",
  });

  const [editingId, setEditingId] = useState(null);

  // ================= FETCH CONTACTS =================

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/emergency-contacts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setContacts(response.data.contacts);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  // ================= ADD / UPDATE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/emergency-contacts/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        alert("Contact Updated");
      } else {
        await axios.post(
          "http://localhost:5000/api/emergency-contacts",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        alert("Contact Added");
      }

      setFormData({
        name: "",
        relation: "",
        phone: "",
        email: "",
        priority: "Secondary",
      });

      setEditingId(null);

      fetchContacts();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= EDIT =================

  const handleEdit = (contact) => {
    setFormData(contact);

    setEditingId(contact._id);
  };

  // ================= DELETE =================

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/emergency-contacts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Contact Deleted");

      fetchContacts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="contacts-page">
      {/* HEADER */}

      <div className="contacts-header">
        <div>
          <h1>Emergency Contacts</h1>

          <p>Manage trusted people who can help you during emergencies.</p>
        </div>
      </div>

      {/* FORM */}

      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          placeholder="Relation"
          name="relation"
          value={formData.relation}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          placeholder="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="Primary">Primary</option>

          <option value="Secondary">Secondary</option>
        </select>

        <button type="submit">
          <Plus size={18} />

          {editingId ? "Update Contact" : "Add Contact"}
        </button>
      </form>

      {/* CONTACTS */}

      <div className="contacts-grid">
        {contacts.map((contact) => (
          <div className="contact-card" key={contact._id}>
            <div className="card-top">
              <div className="avatar">{contact.name.charAt(0)}</div>

              <div>
                <h2>{contact.name}</h2>

                <p>{contact.relation}</p>
              </div>
            </div>

            <div className="contact-info">
              <div>
                <Phone size={18} />

                <span>{contact.phone}</span>
              </div>

              <div>
                <Mail size={18} />

                <span>{contact.email}</span>
              </div>
            </div>

            <div className="priority-badge">
              <ShieldCheck size={16} />

              {contact.priority}
            </div>

            <div className="card-buttons">
              <button className="edit-btn" onClick={() => handleEdit(contact)}>
                <Edit size={18} />
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(contact._id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
