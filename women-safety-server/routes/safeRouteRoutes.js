const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/route", async (req, res) => {
  try {
    const { startLat, startLng, endLat, endLng } = req.body;

    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        coordinates: [
          [startLng, startLat],
          [endLng, endLat],
        ],
      },
      {
        headers: {
          Authorization: process.env.ORS_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    res.json(response.data);
  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      message: "Route fetch failed",
    });
  }
});
console.log("ORS KEY =", process.env.ORS_API_KEY);

module.exports = router;
