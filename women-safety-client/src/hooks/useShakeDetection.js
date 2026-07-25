import { useEffect, useRef } from "react";
import axios from "axios";

export default function useShakeDetection() {
  const lastShakeTimeRef = useRef(0);
  const shakeCountRef = useRef(0);
  const lastX = useRef(null);
  const lastY = useRef(null);
  const lastZ = useRef(null);

  const SHAKE_THRESHOLD = 15; // acceleration change threshold
  const SHAKE_WINDOW_MS = 3000; // 3 second window
  const REQUIRED_SHAKES = 4; // 3-5 shakes

  useEffect(() => {
    const token = localStorage.getItem("token");

    const setActiveStatus = async (active) => {
      try {
        await axios.put(
          "http://localhost:5000/api/user/shake-status",
          { active },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.log(err);
      }
    };

    const triggerShakeSOS = async () => {
      try {
        const pos = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        );

        await axios.post(
          "http://localhost:5000/api/sos/trigger",
          {
            message: "Shake detection triggered emergency",
            location: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            },
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("🚨 Shake Detected — SOS Triggered!");
      } catch (err) {
        console.log(err);
      }
    };

    const handleMotion = (event) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;

      const { x, y, z } = acc;

      if (lastX.current !== null) {
        const deltaX = Math.abs(x - lastX.current);
        const deltaY = Math.abs(y - lastY.current);
        const deltaZ = Math.abs(z - lastZ.current);

        if (deltaX + deltaY + deltaZ > SHAKE_THRESHOLD) {
          const now = Date.now();

          if (now - lastShakeTimeRef.current < SHAKE_WINDOW_MS) {
            shakeCountRef.current += 1;
          } else {
            shakeCountRef.current = 1;
          }

          lastShakeTimeRef.current = now;

          if (shakeCountRef.current >= REQUIRED_SHAKES) {
            shakeCountRef.current = 0;
            triggerShakeSOS();
          }
        }
      }

      lastX.current = x;
      lastY.current = y;
      lastZ.current = z;
    };

    const enableMotion = async () => {
      // iOS 13+ needs explicit permission
      if (
        typeof DeviceMotionEvent !== "undefined" &&
        typeof DeviceMotionEvent.requestPermission === "function"
      ) {
        try {
          const permission = await DeviceMotionEvent.requestPermission();
          if (permission !== "granted") return;
        } catch (err) {
          console.log(err);
          return;
        }
      }

      window.addEventListener("devicemotion", handleMotion);
      setActiveStatus(true);
    };

    enableMotion();

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
      setActiveStatus(false);
    };
  }, []);
}