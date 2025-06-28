// File: client/src/components/MapSelector.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
});

// Helper component to allow clicking on the map
function LocationMarker({ position, onChange }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng);
    },
  });
  return position ? <Marker position={position} /> : null;
}

export default function MapSelector({ onLocationSelect }) {
  // default position = Accra (lat, lng)
  const [position, setPosition] = useState({ lat: 5.6037, lng: -0.1870 });

  // Notify parent each time position changes
  useEffect(() => {
    onLocationSelect(position);
  }, [position, onLocationSelect]);

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: '200px', borderRadius: '0.5rem', marginBottom: '1rem' }}
      scrollWheelZoom={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker position={position} onChange={setPosition} />
    </MapContainer>
  );
}
