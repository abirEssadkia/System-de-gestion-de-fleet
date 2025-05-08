
import React from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { Point } from './types';

// Component to set bounds of map to include all markers
export const SetBoundsToMarkers = ({ points }: { points: Point[] }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (points.length > 0) {
      // Create an array of LatLng objects
      const latLngs = points.map(point => L.latLng(point.lat, point.lng));
      
      // Create a bounds object
      const bounds = L.latLngBounds(latLngs);
      
      // Fit the map to these bounds with some padding
      map.fitBounds(bounds, { 
        padding: [50, 50],
        maxZoom: 16 // Limit max zoom level
      });
    }
  }, [map, points]);
  
  return null;
};
