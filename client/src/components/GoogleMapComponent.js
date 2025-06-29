// File: client/src/components/GoogleMapComponent.js
import React, { useCallback, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px'
};

const center = {
  lat: 5.5600,  // default location: Accra
  lng: -0.2050
};

function GoogleMapComponent({ onLocationChange }) {
  const [mapCenter, setMapCenter] = useState(center);
  const [markerPosition, setMarkerPosition] = useState(center);
  const autocompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const location = place.geometry.location;
      const newPosition = {
        lat: location.lat(),
        lng: location.lng()
      };
      setMapCenter(newPosition);
      setMarkerPosition(newPosition);
      onLocationChange(place.formatted_address);
    }
  };

  const handleMapClick = (event) => {
    const clicked = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    setMarkerPosition(clicked);
    setMapCenter(clicked);
  };

  return isLoaded ? (
    <>
      <Autocomplete onLoad={ref => (autocompleteRef.current = ref)} onPlaceChanged={handlePlaceChanged}>
        <input
          type="text"
          placeholder="Enter your pickup location"
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            fontSize: '16px'
          }}
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={14}
        onClick={handleMapClick}
      >
        <Marker position={markerPosition} />
      </GoogleMap>
    </>
  ) : <p>Loading map...</p>;
}

export default GoogleMapComponent;
