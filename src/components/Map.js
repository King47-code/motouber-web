// File: src/components/Map.js
import React from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 5.6037, // Accra default
  lng: -0.1870,
};

function Map({ pickupLocation, setPickupLocation }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps…</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={pickupLocation || center}
      zoom={14}
      onClick={(event) =>
        setPickupLocation({
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        })
      }
    >
      {pickupLocation && <Marker position={pickupLocation} />}
    </GoogleMap>
  );
}

export default Map;
  