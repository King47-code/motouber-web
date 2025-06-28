import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function LocationSearch({ 
  label,           // "Pickup" or "Destination"
  initialCoords,   // { lat, lng } or null
  onSelect         // callback({ name, coords })
}) {
  const token = process.env.REACT_APP_MAPBOX_TOKEN;
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [highlight, setHighlight] = useState(0);
  const ref = useRef();

  // Reverse-geocode initialCoords into a place name
  useEffect(() => {
    if (initialCoords) {
      const { lng, lat } = initialCoords;
      axios
        .get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`, {
          params: { access_token: token }
        })
        .then(res => {
          const place = res.data.features[0]?.place_name;
          if (place) {
            setQuery(place);
            onSelect({ name: place, coords: initialCoords });
          }
        });
    }
  }, [initialCoords, token, onSelect]);

  // Fetch suggestions when user types
  useEffect(() => {
    if (!query) return setSuggestions([]);
    const cancel = axios.CancelToken.source();
    axios
      .get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`, {
        params: {
          access_token: token,
          autocomplete: true,
          limit: 5
        },
        cancelToken: cancel.token
      })
      .then(res => {
        setSuggestions(res.data.features);
        setHighlight(0);
      })
      .catch(() => {});
    return () => cancel.cancel();
  }, [query, token]);

  // Handle arrow keys & enter
  const onKeyDown = e => {
    if (e.key === 'ArrowDown') {
      setHighlight(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      setHighlight(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && suggestions[highlight]) {
      select(suggestions[highlight]);
      e.preventDefault();
    }
  };

  const select = feature => {
    const coords = { lat: feature.center[1], lng: feature.center[0] };
    setQuery(feature.place_name);
    setSuggestions([]);
    onSelect({ name: feature.place_name, coords });
  };

  return (
    <div style={{ position: 'relative', marginBottom: '1rem' }} ref={ref}>
      <label style={{ color: '#374151', fontWeight: '600' }}>{label}</label>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={`Enter ${label.toLowerCase()}`}
        style={{
          width: '100%',
          padding: '0.5rem',
          margin: '0.25rem 0 0.5rem',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          fontSize: '1rem'
        }}
      />
      {suggestions.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '100%', left: 0, right: 0,
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '0.375rem',
          maxHeight: '10rem',
          overflowY: 'auto',
          zIndex: 1000,
          listStyle: 'none',
          margin: 0, padding: 0
        }}>
          {suggestions.map((feat, i) => (
            <li
              key={feat.id}
              onMouseDown={() => select(feat)}
              style={{
                padding: '0.5rem',
                background: i === highlight ? '#f3f4f6' : '#fff',
                cursor: 'pointer'
              }}
            >
              {feat.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
