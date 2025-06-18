import React, { useCallback, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

interface GoogleMapComponentProps {
  coordinates: {
    lat: number;
    lng: number;
  };
  title?: string;
  className?: string;
  zoom?: number;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ 
  coordinates, 
  title = "Property Location",
  className = "h-64 w-full",
  zoom = 14 
}) => {
  const [showInfo, setShowInfo] = useState(false);

  const onLoad = useCallback((map: google.maps.Map) => {
    // Optional: You can store the map instance if needed
  }, []);

  const onUnmount = useCallback((map: google.maps.Map) => {
    // Cleanup if needed
  }, []);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className={`${className} bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center`}>
        <p className="text-gray-500 dark:text-gray-400">Google Maps API key not configured</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={coordinates}
          zoom={zoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          <Marker
            position={coordinates}
            onClick={() => setShowInfo(true)}
          />
          
          {showInfo && (
            <InfoWindow
              position={coordinates}
              onCloseClick={() => setShowInfo(false)}
            >
              <div className="p-2">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600">
                  {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                </p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GoogleMapComponent;