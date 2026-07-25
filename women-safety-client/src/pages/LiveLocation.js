import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { MapPin, Navigation, ShieldCheck, Power, Clock } from "lucide-react";

import "./LiveLocation.css";

export default function LiveLocation() {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    address: "",
  });

  const [sharing, setSharing] = useState(false);

  const [watchId, setWatchId] = useState(null);

  const [remainingTime, setRemainingTime] = useState(0);

  const [sharingEndTime, setSharingEndTime] = useState(null);
  const reverseGeocode = async (lat, lng) => {
  try {
    const res = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          format: "json",
          lat,
          lon: lng,
        },
      }
    );

    return res.data.display_name || "";
  } catch (err) {
    console.log(err);
    return "";
  }
};
  const getUserId = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch (err) {
    return null;
  }
};

  // ================= FETCH LOCATION =================

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/location/current-location",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.location) {
        setLocation({
          latitude: response.data.location.latitude,
          longitude: response.data.location.longitude,
          address: response.data.location.address || "",
        });

        setSharing(response.data.location.liveLocationEnabled);

        if (response.data.location.locationSharingEndTime) {
          setSharingEndTime(
            new Date(response.data.location.locationSharingEndTime),
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ================= STOP SHARING =================

  const stopLocationSharing = useCallback(async () => {
    try {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }

      setSharing(false);
      setRemainingTime(0);
      setSharingEndTime(null);

      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:5000/api/location/update-location",
        {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address,
          liveLocationEnabled: false,
        },
        
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      await axios.delete(
  `http://localhost:5000/api/location/${getUserId()}`
);
      await axios.post(
  "http://localhost:5000/api/location/updateWoman",
  {
    womanId: getUserId(),
    latitude: location.latitude,
    longitude: location.longitude,
  }
);

      alert("Location Sharing Stopped");
    } catch (error) {
      console.log(error);
    }
  }, [watchId, location]);

  // ================= ACTUAL TIMER =================

  useEffect(() => {
    if (!sharing || !sharingEndTime) return;

    const interval = setInterval(() => {
      const now = new Date();

      const diff = Math.floor(
        (sharingEndTime.getTime() - now.getTime()) / 1000,
      );

      if (diff <= 0) {
        stopLocationSharing();
        clearInterval(interval);
        return;
      }

      setRemainingTime(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [sharing, sharingEndTime, stopLocationSharing]);

  // ================= START SHARING =================

  const startLocationSharing = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    const selectedMinutes = prompt(
      "Location kitni der share karni hai? (minutes)",
      "15",
    );

    if (!selectedMinutes) return;

    const minutes = parseInt(selectedMinutes);

    if (isNaN(minutes) || minutes <= 0) {
      alert("Enter valid duration");
      return;
    }

    const endTime = new Date();
    endTime.setMinutes(endTime.getMinutes() + minutes);

    setSharingEndTime(endTime);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const address = await reverseGeocode(latitude, longitude);
        

        setLocation({
          latitude,
          longitude,
          address,
        });

        setSharing(true);

        const token = localStorage.getItem("token");
 try {
        await axios.put(
          "http://localhost:5000/api/location/update-location",
          {
            latitude,
            longitude,
            address,
            liveLocationEnabled: true,
            duration: minutes,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
    } catch (error) {
      if (error.response?.status === 400) {
        alert(error.response.data.message); // "Location sharing already active. Stop it first."
      } else {
        alert("Failed to start location sharing");
      }
      console.log(error);
      return; // yahin ruk jao, watchPosition mat lagao
    }

    setLocation({ latitude, longitude, address });
    setSharing(true)
        await axios.post(
  "http://localhost:5000/api/location/updateWoman",
  {
    womanId: getUserId(),
    latitude,
    longitude,
  }
);

        const id = navigator.geolocation.watchPosition(
          async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const address = await reverseGeocode(latitude, longitude);

            setLocation((prev) => ({
              ...prev,
              latitude,
              longitude,
              address,
            }));

            await axios.put(
              "http://localhost:5000/api/location/update-location",
              {
                latitude,
                longitude,
                address,
                liveLocationEnabled: true,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            await axios.post(
  "http://localhost:5000/api/location/updateWoman",
  {
    womanId: getUserId(),
    latitude,
    longitude,
  }
);
            
          },
          (err) => {
            console.log(err);
          },
          {
            enableHighAccuracy: false,
            maximumAge: 60000,
            timeout: 20000,
          },
        );

        setWatchId(id);
      },

      (error) => {
        console.log(error);

        alert(`Location Error\nCode: ${error.code}\n${error.message}`);
      },

      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 60000,
      },
    );
  };

  

  // ================= FORMAT TIMER =================

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="location-page">
      <div className="location-header">
        <div>
          <h1>Live Location Tracking</h1>

          <p>Share your real-time location securely with linked guardians.</p>
        </div>

        <div className={`status-badge ${sharing ? "active" : "inactive"}`}>
          <ShieldCheck size={18} />
          {sharing ? "Sharing Live" : "Not Sharing"}
        </div>
      </div>

      {sharing && (
        <div className="timer-box">
          <Clock size={22} />
          <span>{formatTime(remainingTime)} Remaining</span>
        </div>
      )}

      <div className="map-card">
        <iframe
          title="live-map"
          width="100%"
          height="100%"
          loading="lazy"
          allowFullScreen
          src={
            location.latitude && location.longitude
              ? `https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`
              : ""
          }
        ></iframe>
      </div>

      <div className="location-grid">
        <div className="location-info-card">
          <MapPin size={30} />

          <div>
            <h3>Current Place</h3>
            <p>{location.address || "Fetching Location..."}</p>
          </div>
        </div>

        <div className="location-info-card">
          <Navigation size={30} />

          <div>
            <h3>Coordinates</h3>
            <p>
              {location.latitude || "N/A"} , {location.longitude || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="location-buttons">
        <button className="start-btn" onClick={startLocationSharing}>
          <Power size={20} />
          Start Sharing
        </button>

        <button className="stop-btn" onClick={stopLocationSharing}>
          <Power size={20} />
          Stop Sharing
        </button>
      </div>
    </div>
  );
}
