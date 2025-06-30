// File: client/src/components/MapWithRoute.js
import React, { useState, useRef, useEffect } from 'react';
import {
  GoogleMap,
  LoadScript,
  Autocomplete,
  Marker,
  DirectionsRenderer
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem',
};

const centerDefault = { lat: 5.6037, lng: -0.1870 }; // Accra

export default function MapWithRoute({ onReady }) {
  const [map, setMap] = useState(null);
  const [pickup, setPickup] = useState(null);
  const [dest, setDest]     = useState(null);
  const [error, setError]   = useState('');
  const [directions, setDirections] = useState(null);

  const pickupRef = useRef();
  const destRef   = useRef();

  // 1) On mount, auto-center on user:
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => {
        map?.panTo({ lat: coords.latitude, lng: coords.longitude });
      },
      () => {},
      { enableHighAccuracy: true }
    );
  }, [map]);

  // 2) When both places set, fetch route:
  useEffect(() => {
    if (pickup && dest) {
      setError('');
      const DirectionsServiceOptions = {
        origin: pickup.geometry.location,
        destination: dest.geometry.location,
        travelMode: 'DRIVING'
      };
      new window.google.maps.DirectionsService().route(
        DirectionsServiceOptions,
        (result, status) => {
          if (status === 'OK' && result) {
            setDirections(result);
          } else {
            setError('Could not fetch directions');
          }
        }
      );
    } else {
      setDirections(null);
    }
  }, [pickup, dest]);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={['places']}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <Autocomplete
          onLoad={auto => (pickupRef.current = auto)}
          onPlaceChanged={() => {
            const place = pickupRef.current.getPlace();
            if (!place.geometry) return setError('Pickup not recognized');
            setPickup(place);
          }}
        >
          <input
            type="text"
            placeholder="Pickup location"
            style={{ flex: 1, padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }}
          />
        </Autocomplete>

        <Autocomplete
          onLoad={auto => (destRef.current = auto)}
          onPlaceChanged={() => {
            const place = destRef.current.getPlace();
            if (!place.geometry) return setError('Destination not recognized');
            setDest(place);
          }}
        >
          <input
            type="text"
            placeholder="Destination (optional)"
            style={{ flex: 1, padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }}
          />
        </Autocomplete>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={centerDefault}
        zoom={13}
        onLoad={mapInstance => setMap(mapInstance)}
      >
        {pickup && <Marker position={pickup.geometry.location} />}
        {dest   && <Marker position={dest.geometry.location} />}

        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{ suppressMarkers: true }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}
