import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface MapProps {
  coordinates: {
    lat: number;
    lng: number;
  };
  className?: string;
}

const Map: React.FC<MapProps> = ({ coordinates, className = "h-64 w-full" }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY || 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGFtcGxlIn0.example';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [coordinates.lng, coordinates.lat],
      zoom: 14,
    });

    // Add marker
    new mapboxgl.Marker({
      color: '#3B82F6',
    })
      .setLngLat([coordinates.lng, coordinates.lat])
      .addTo(map.current);

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [coordinates]);

  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default Map;