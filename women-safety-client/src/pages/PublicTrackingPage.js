import React, { useEffect, useState } from "react";
import axios from "axios";
import { useMap } from "react-leaflet";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import { useParams } from "react-router-dom";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "./PublicTrackingPage.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}
const womanIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",

  iconSize: [45,45],

  iconAnchor:[22,45]
});

export default function PublicTrackingPage(){

const {token}=useParams();

const [data,setData]=useState(null);

const [loading,setLoading]=useState(true);

const loadLocation=async()=>{

try{

const res=await axios.get(

`http://localhost:5000/api/location/track/${token}`

);

setData(res.data);

setLoading(false);

}

catch(err){

setLoading(false);

}

};
useEffect(()=>{

loadLocation();

const interval=setInterval(()=>{

loadLocation();

},5000);

return()=>clearInterval(interval);

},[token]);

if(loading){

return(

<div className="tracking-loading">

<h2>Loading Live Location...</h2>

</div>

);

}

if(!data?.success){

return(

<div className="tracking-loading">

<div className="tracking-loading">

<div>

<h2>

Tracking Link Expired

</h2>

<p>

The SOS session has ended or this link is no longer valid.

</p>

</div>

</div>

</div>

);

}

const woman=data.woman;

const location=data.location;

return(

<div className="public-track-container">

<div className="track-header">

<h1>

🚨 SafeHer Live Tracking

</h1>

</div>

<div className="track-info">

<img

src={
woman.profileImage
? `http://localhost:5000/${woman.profileImage}`
: "https://via.placeholder.com/100"
}

alt=""

className="track-profile"

/>

<div>

<h2>

{woman.name}

</h2>

<p>

Battery :

{woman.battery}%

</p>

<p>

Status :

{woman.online?

"🟢 Online"

:

"⚫ Offline"}

</p>

<p>

SOS :

{woman.sosActive?

"🚨 ACTIVE"

:

"SAFE"}

</p>

<p>

{location.address}

</p>

</div>

</div>

<div className="track-map">

<MapContainer center={[location.latitude, location.longitude]} zoom={16} style={{ height: "600px", width: "100%" }}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  <RecenterMap lat={location.latitude} lng={location.longitude} />
  <Marker position={[location.latitude, location.longitude]} icon={womanIcon}>
    <Popup><h3>{woman.name}</h3><p>{location.address}</p></Popup>
  </Marker>
</MapContainer>

</div>

</div>

);

}