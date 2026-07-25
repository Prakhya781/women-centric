import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "./GuardianLiveLocation.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const womanIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
});

const guardianIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
});


function ChangeMapView({ center }) {
  const map = useMap();
  

  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);

  return null;
}

export default function GuardianLiveLocation() {
  const [womanLocation, setWomanLocation] = useState(null);
  const [guardianLocation, setGuardianLocation] = useState(null);

  const [womanAddress, setWomanAddress] = useState("");
  const [guardianAddress, setGuardianAddress] = useState("");

  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const [route, setRoute] = useState([]);

  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(true);

  const watchId = useRef(null);

  const [linkedWomanId, setLinkedWomanId] = useState(null);
 const getWomanLocation = async () => {
  try {

    const res = await axios.get(
      `https://women-centric-hzmm.onrender.com/api/location/${linkedWomanId}`
    );

    if (res.data.success) {

      const { latitude, longitude } = res.data.location;

      setWomanLocation([
        Number(latitude),
        Number(longitude),
      ]);

    }

  } catch (err) {

    // Woman is not sharing live location
    if (err.response?.status === 403) {

      setWomanLocation(null);

      return;

    }

    console.log(err);

  }
};
  const fetchLinkedWoman = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "https://women-centric-hzmm.onrender.com/api/guardian/myWoman",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.success) {
      setLinkedWomanId(res.data.womanId);
    }
  } catch (err) {
    console.log(err);
  }
};

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: {
            format: "json",
            lat,
            lon: lng,
          },
        }
      );

      return res.data.display_name;
    } catch {
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

  const updateGuardianLocation = async (lat, lng) => {
    try {
      await axios.post(
        "https://women-centric-hzmm.onrender.com/api/location/updateGuardian",
        {
          guardianId: getUserId(),
          latitude: lat,
          longitude: lng,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const calculateRoute = async () => {
    if (!guardianLocation || !womanLocation) return;

    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${guardianLocation[1]},${guardianLocation[0]};${womanLocation[1]},${womanLocation[0]}?overview=full&geometries=geojson`;

      const res = await axios.get(url);

      const data = res.data.routes[0];

      setDistance((data.distance / 1000).toFixed(2));

      setDuration((data.duration / 60).toFixed(0));

      const coords = data.geometry.coordinates.map((item) => [
        item[1],
        item[0],
      ]);

      setRoute(coords);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
  fetchLinkedWoman();
}, []);

useEffect(() => {
  if (!linkedWomanId) return;

  getWomanLocation();

  const interval = setInterval(() => {
    getWomanLocation();
  }, 5000);

  return () => clearInterval(interval);
}, [linkedWomanId]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    watchId.current = navigator.geolocation.watchPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setGuardianLocation([lat, lng]);

        await updateGuardianLocation(lat, lng);
      },
      (err) => console.log(err),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  useEffect(() => {
    const loadAddresses = async () => {
      if (womanLocation) {
        const addr = await reverseGeocode(
          womanLocation[0],
          womanLocation[1]
        );
        setWomanAddress(addr);
      }

      if (guardianLocation) {
        const addr = await reverseGeocode(
          guardianLocation[0],
          guardianLocation[1]
        );
        setGuardianAddress(addr);
      }

      setLoading(false);
    };

    loadAddresses();
  }, [womanLocation, guardianLocation]);

  useEffect(() => {
    calculateRoute();
  }, [guardianLocation, womanLocation]);

  const stopTracking = () => {
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
      setTracking(false);
    }
  };

  const startTracking = () => {
    if (!navigator.geolocation) return;

    watchId.current = navigator.geolocation.watchPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setGuardianLocation([lat, lng]);

        await updateGuardianLocation(lat, lng);
      },
      (err) => console.log(err),
      {
        enableHighAccuracy: true,
      }
    );

    setTracking(true);
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        ></div>

        <h5 className="mt-3">
          Loading Live Location...
        </h5>
      </div>
    );
  }

  const center =
    womanLocation ||
    guardianLocation || [
      28.6139,
      77.209,
    ];

  return (
    <div className="container-fluid py-4">

      <div className="row mb-4">

        <div className="col-md-12">

          <div className="card shadow border-0">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <h3 className="fw-bold text-primary">
                  Guardian Live Tracking
                </h3>

                {tracking ? (
                  <button
                    className="btn btn-danger"
                    onClick={stopTracking}
                  >
                    Stop Tracking
                  </button>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={startTracking}
                  >
                    Start Tracking
                  </button>
                )}

              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="row">

        <div className="col-lg-4">

          <div className="card shadow mb-3">

            <div className="card-header bg-dark text-white">
              Woman Location
            </div>

            <div className="card-body">

              <p>
                <strong>Latitude:</strong>{" "}
                {womanLocation?.[0]}
              </p>

              <p>
                <strong>Longitude:</strong>{" "}
                {womanLocation?.[1]}
              </p>

              <p className="small">
                {womanAddress}
              </p>

            </div>

          </div>

          <div className="card shadow mb-3">

            <div className="card-header bg-dark text-white">
              Guardian Location
            </div>

            <div className="card-body">

              <p>
                <strong>Latitude:</strong>{" "}
                {guardianLocation?.[0]}
              </p>

              <p>
                <strong>Longitude:</strong>{" "}
                {guardianLocation?.[1]}
              </p>

              <p className="small">
                {guardianAddress}
              </p>

            </div>

          </div>
                    <div className="card shadow">

            <div className="card-header bg-dark text-white">
              Route Details
            </div>

            <div className="card-body">

              <h5>
                Distance : {distance} km
              </h5>

              <h5>
                Estimated Time : {duration} min
              </h5>

            </div>

          </div>

        </div>

        <div className="col-lg-8">

          <div
            className="shadow rounded overflow-hidden"
            style={{ height: "650px" }}
          >{
  !womanLocation &&

  <div className="alert alert-warning">

      Woman is not sharing live location.

  </div>

}

            <MapContainer
              center={center}
              zoom={15}
              scrollWheelZoom={true}
              style={{
                height: "100%",
                width: "100%",
              }}
            >
              <ChangeMapView center={center} />

              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {womanLocation && (
                <Marker
                  position={womanLocation}
                  icon={womanIcon}
                >
                  <Popup>
                    <div>
                      <h6>Woman Location</h6>
                      <p>{womanAddress}</p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {guardianLocation && (
                <Marker
                  position={guardianLocation}
                  icon={guardianIcon}
                >
                  <Popup>
                    <div>
                      <h6>Guardian Location</h6>
                      <p>{guardianAddress}</p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {route.length > 0 && (
                <Polyline
                  positions={route}
                  pathOptions={{
                    color: "blue",
                    weight: 5,
                  }}
                />
              )}
            </MapContainer>

          </div>

        </div>

      </div>

    </div>
  );
}