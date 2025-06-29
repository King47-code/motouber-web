import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapView() {
  const mapRef = useRef(null);

  useEffect(() => {
    // Ask for current location
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        // Create map centered on user
        const map = new maplibregl.Map({
          container: mapRef.current,
          style: "https://demotiles.maplibre.org/style.json", // free default style
          center: [longitude, latitude],
          zoom: 14,
        });

        // Add marker for current location
        new maplibregl.Marker({ color: "green" })
          .setLngLat([longitude, latitude])
          .addTo(map);

        map.addControl(new maplibregl.NavigationControl(), "top-right");
      },
      (err) => {
        alert("Location access denied. Enable GPS to use map.");
        console.error(err);
      }
    );
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "90vh",
        borderRadius: "12px",
      }}
    />
  );
}
