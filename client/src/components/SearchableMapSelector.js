// File: client/src/components/SearchableMapSelector.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet defaults
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
});

// Click-to-move marker
function LocationMarker({ position, onChange }) {
  useMapEvents({ click(e) { onChange({ lat: e.latlng.lat, lng: e.latlng.lng, name: null }); } });
  return position ? <Marker position={position} /> : null;
}

export default function SearchableMapSelector({
  label,
  initialPosition = { lat: 5.6037, lng: -0.1870, name: 'Accra, Ghana' },
  onLocationSelect
}) {
  const [position, setPosition] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // 1) Auto-locate with GPS once on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const p = { lat: coords.latitude, lng: coords.longitude, name: 'Current location' };
          setPosition(p);
          setPlaceName(p.name);
          onLocationSelect(p);
        },
        () => locateFallback()
      );
    } else {
      locateFallback();
    }
    function locateFallback() {
      setPosition(initialPosition);
      setPlaceName(initialPosition.name);
      onLocationSelect(initialPosition);
    }
  }, []);

  // 2) When position changes (via GPS, map click, or suggestion), notify parent
  useEffect(() => {
    if (position) onLocationSelect({ ...position, name: placeName });
  }, [position, placeName]);

  // 3) Perform search when user clicks "Search"
  const doSearch = () => {
    if (!query) return setResults([]);
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`
    )
      .then(r => r.json())
      .then(data => setResults(data))
      .catch(() => setResults([]));
  };

  // 4) When user picks a suggestion
  const pick = (r) => {
    const p = { lat: parseFloat(r.lat), lng: parseFloat(r.lon) };
    setPosition(p);
    setPlaceName(r.display_name);
    setResults([]);
    setQuery(r.display_name);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
        {label}
      </label>
      <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
        <input
          type="text"
          placeholder={`Search ${label.toLowerCase()}`}
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            flex: 1,
            padding: '0.5rem 1rem',
            border: '1px solid #ccc',
            borderRadius: '0.375rem 0 0 0.375rem',
            fontSize: '1rem'
          }}
        />
        <button
          onClick={doSearch}
          style={{
            padding: '0 1rem',
            background: '#047857',
            color: '#fff',
            border: 'none',
            borderRadius: '0 0.375rem 0.375rem 0',
            cursor: 'pointer'
          }}
        >
          Search
        </button>
      </div>

      {results.length > 0 && (
        <ul style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          border: '1px solid #ddd',
          borderRadius: '0.375rem',
          maxHeight: '8rem',
          overflowY: 'auto'
        }}>
          {results.map(r => (
            <li
              key={r.place_id}
              onClick={() => pick(r)}
              style={{
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                borderBottom: '1px solid #eee'
              }}
            >
              {r.display_name}
            </li>
          ))}
        </ul>
      )}

      {/* Map below */}
      <MapContainer
        center={position || initialPosition}
        zoom={13}
        style={{ height: '200px', borderRadius: '0.5rem', marginTop: '0.5rem' }}
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker position={position} onChange={(pos) => { setPosition(pos); setPlaceName(null); }} />
      </MapContainer>
    </div>
  );
}
