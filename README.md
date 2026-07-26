# 🛡️ SafeHer — AI-Powered Women Safety Platform

SafeHer is a full-stack women's safety web application that connects women with their trusted guardians through real-time SOS alerts, live location tracking, and AI-powered risk analysis.

---

## 🚀 Features

### Woman (User) Side
- **Emergency SOS** — One-tap SOS with a 5-second countdown, instant guardian email alert with live tracking link
- **Live Location Sharing** — Real-time location sharing with guardians for a set duration, auto-expires
- **AI Protection** — Describe a situation and get instant AI-based risk analysis (LOW/MEDIUM/HIGH), with auto-SOS trigger on high risk
- **Shake Detection** — Shake the phone 3–5 times to silently trigger an SOS (useful when the phone can't be unlocked)
- **Movement Tracking** — Detects suspicious movement patterns (sudden high speed, prolonged inactivity during SOS) and alerts the guardian
- **Guardian Linking** — Send/accept guardian requests via email
- **Emergency Contacts** — Store and manage emergency contact details and blood group
- **Fake Call** — Simulate an incoming call to escape uncomfortable situations
- **Safe Route** — Route safety guidance
- **Incident Reporting** — Report incidents with AI-assessed risk level, photo evidence, and location
- **Safety Tips** — Rotating safety tips
- **Notifications** — In-app alerts for SOS, AI, reports, and guardian activity
- **Public Tracking Page** — Shareable live-tracking link (no login required) for guardians to follow a woman's location during SOS

### Guardian Side
- Guardian dashboard with linked woman's live status
- Real-time SOS alerts and location
- Notifications, incident reports, and emergency contacts of the linked woman
- Safety status overview

---

## 🧰 Tech Stack

**Frontend:** React, React Router, Axios, Leaflet + OpenStreetMap, Lucide Icons, Bootstrap

**Backend:** Node.js, Express.js, MongoDB with Mongoose, JWT Authentication, Nodemailer (Gmail), Multer (file uploads)

**Other:** Geolocation API, DeviceMotion API (Shake Detection), Nominatim (reverse geocoding)

---

## 📁 Project Structure

```
safeher/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Dashboard, Signup, Welcome, etc.
│   │   ├── pages/              # SOSPage, LiveLocation, AIProtection, etc.
│   │   ├── hooks/               # useShakeDetection
│   │   └── App.js
│
├── server/                    # Express backend
│   ├── controllers/           # sos, location, guardian, dashboard, ai, incident, auth
│   ├── models/                 # User, Location, GuardianLink, Notification, Incident, EmergencyContact
│   ├── routes/                  # sos, location, guardian, dashboard, user, auth
│   ├── middleware/             # authMiddleware
│   └── server.js
│
└── README.md
```

---

## 👥 User Roles

| Role | Access |
|------|--------|
| **Woman (`user`)** | SOS, live location, AI protection, guardian linking, incident reports |
| **Guardian (`guardian`)** | View linked woman's status, SOS alerts, notifications, incident reports |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Gmail account with an App Password (for Nodemailer)

### Backend

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:3000
```

```bash
npm start
```

### Frontend

```bash
cd client
npm install
```

Create a `.env` file in `client/`:

```env
REACT_APP_API_URL=https://women-centric-hzmm.onrender.com
```

```bash
npm start
```

---

## 🔑 Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user/guardian |
| POST | `/api/auth/login` | Login |
| POST | `/api/sos/activate` | Activate SOS |
| POST | `/api/sos/deactivate` | Deactivate SOS |
| PUT | `/api/location/update-location` | Update live location |
| GET | `/api/location/track/:token` | Public tracking (guardian view) |
| GET | `/api/dashboard/status` | Dashboard summary (safety status, AI protection, etc.) |
| POST | `/api/ai/analyze` | AI risk analysis of a situation |
| POST | `/api/guardian/send-request` | Send guardian link request |
| POST | `/api/guardian/accept/:id` | Accept guardian request |
| POST | `/api/incident/create` | Report an incident |

---

## 🌱 Roadmap

- [ ] Move hardcoded `localhost` URLs to environment variables for production
- [ ] Cloud file storage (Cloudinary/S3) for profile images
- [ ] Rate limiting on SOS/auth endpoints
- [ ] Guardian-side SOS alerts, notifications, and safety status pages
- [ ] Payment integration (Razorpay) for premium features
- [ ] Deploy: Frontend (Vercel/Netlify), Backend (Render/Railway), DB (MongoDB Atlas)

---

## 📞 Emergency Helplines (India)

| Number | Service |
|--------|---------|
| 1091 | Women Helpline |
| 112 | Emergency |
| 100 | Police |
| 108 | Ambulance |

---

## 📄 License

This project is currently a personal/academic project and not yet publicly licensed.

## 👤 Author

Built and maintained by Prakhya.