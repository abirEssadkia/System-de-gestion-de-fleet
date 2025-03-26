
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface Point {
  lat: number;
  lng: number;
  description?: string;
  type?: 'speed' | 'fuel' | 'activity' | 'geofence' | 'time';
}

interface SetBoundsToMarkersProps {
  points: Point[];
}

export const SetBoundsToMarkers: React.FC<SetBoundsToMarkersProps> = ({ points }) => {
  const map = useMap();
  
  useEffect(() => {
    if (points.length > 0) {
      // Create an array of LatLng objects
      const latLngs = points.map(point => L.latLng(point.lat, point.lng));
      
      // Create a bounds object
      const bounds = L.latLngBounds(latLngs);
      
      // Fit the map to these bounds with some padding
      map.fitBounds(bounds, { 
        padding: [50, 50],
        maxZoom: 15 // Limit max zoom level
      });
    }
  }, [map, points]);
  
  return null;
};
