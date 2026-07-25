import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./SafeRoute.css";

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function SafeRoute() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState("");

  const [destinationCoords, setDestinationCoords] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);

  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);

  // Get current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.log(err);
        alert("Location permission denied");
      },
    );
  }, []);

  // Find route using OSRM (FREE)
  const findRoute = async () => {
    if (!destination) return alert("Enter destination");
    if (!currentLocation) return alert("Current location not found");

    try {
      setLoading(true);

      // 1. Get destination coordinates (Nominatim)
      const geo = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${destination}&limit=1`,
      );

      if (!geo.data.length) {
        alert("Destination not found");
        setLoading(false);
        return;
      }

      const destLat = parseFloat(geo.data[0].lat);
      const destLng = parseFloat(geo.data[0].lon);

      setDestinationCoords({ lat: destLat, lng: destLng });

      // 2. OSRM ROUTE API (FREE)
      const osrmURL = `https://router.project-osrm.org/route/v1/driving/
        ${currentLocation.lng},${currentLocation.lat};
        ${destLng},${destLat}
        ?overview=full&geometries=geojson`.replace(/\s/g, "");

      const routeRes = await axios.get(osrmURL);

      const route = routeRes.data.routes[0];

      // Convert coordinates for Leaflet
      const coords = route.geometry.coordinates.map((c) => [c[1], c[0]]);

      setRouteCoords(coords);

      // Distance (meters → km)
      setDistance((route.distance / 1000).toFixed(2));

      // Duration (sec → min)
      setDuration(Math.ceil(route.duration / 60));

      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("Route fetch failed (OSRM error)");
      setLoading(false);
    }
  };

  return (
    <div className="safe-route-page">
      <div className="route-header">
        <h1>Safe Route Navigation</h1>
        <p>Find fastest and safest route</p>
      </div>

      <div className="route-card">
        <input
          type="text"
          placeholder="Enter destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

        <button className="route-btn" onClick={findRoute}>
          {loading ? "Finding..." : "Find Route"}
        </button>
      </div>

      {currentLocation && (
        <MapContainer
          center={[currentLocation.lat, currentLocation.lng]}
          zoom={13}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Current Location */}
          <Marker position={[currentLocation.lat, currentLocation.lng]}>
            <Popup>Your Location</Popup>
          </Marker>

          {/* Destination */}
          {destinationCoords && (
            <Marker position={[destinationCoords.lat, destinationCoords.lng]}>
              <Popup>Destination</Popup>
            </Marker>
          )}

          {/* Route Line */}
          {routeCoords.length > 0 && (
            <Polyline
              positions={routeCoords}
              pathOptions={{ color: "red", weight: 5 }}
            />
          )}
        </MapContainer>
      )}

      {/* Stats */}
      <div className="route-stats">
        <div className="stat-card">
          <h3>Distance</h3>
          <p>{distance ? `${distance} KM` : "--"}</p>
        </div>

        <div className="stat-card">
          <h3>ETA</h3>
          <p>{duration ? `${duration} mins` : "--"}</p>
        </div>
      </div>
    </div>
  );
}
