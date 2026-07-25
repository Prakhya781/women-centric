import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "./map.css";

// fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapCard = () => {
  const [position, setPosition] = useState(null);
  const [openMap, setOpenMap] = useState(false);
  const [address, setAddress] = useState("Fetching location...");

  // 📍 GET LOCATION + ADDRESS
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setPosition([lat, lng]);

        // 🌍 REVERSE GEOCODING (REAL ADDRESS)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          );

          const data = await res.json();

          const place =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.suburb ||
            data.address?.county;

          const road = data.address?.road;

          setAddress(
            `${road ? road + ", " : ""}${place || "Unknown Location"}`,
          );
        } catch (err) {
          console.log(err);
          setAddress(`Lat: ${lat.toFixed(3)}, Lng: ${lng.toFixed(3)}`);
        }
      },
      (err) => {
        console.log(err);
        setAddress("Location access denied");
      },
    );
  }, []);

  return (
    <>
      {/* MAP CARD */}
      <div className="map-card">
        <div className="card-header">
          <h2>Live Location</h2>
          <span onClick={() => setOpenMap(true)}>View Map</span>
        </div>

        <div className="map-preview">
          {position ? (
            <p>📍 {address}</p>
          ) : (
            <p>Getting your live location...</p>
          )}
        </div>

        <div className="location-footer">
          <div>
            <h4>{address}</h4>
            <p>India</p>
          </div>

          <button className="live-btn">Live</button>
        </div>
      </div>

      {/* FULL MAP MODAL */}
      {openMap && position && (
        <div className="map-modal">
          <div className="map-box">
            <button className="close-btn" onClick={() => setOpenMap(false)}>
              ✖
            </button>

            <MapContainer
              center={position}
              zoom={17}
              style={{ height: "100%", width: "100%" }}
            >
              {/* 🧭 BETTER TILE (streets + labels) */}
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <Marker position={position}>
                <Popup>
                  📍 You are here <br />
                  {address}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default MapCard;
