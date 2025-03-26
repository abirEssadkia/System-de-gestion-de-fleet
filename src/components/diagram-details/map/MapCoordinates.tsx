
import { useMemo } from 'react';

interface Point {
  lat: number;
  lng: number;
  description?: string;
  type?: 'speed' | 'fuel' | 'activity' | 'geofence' | 'time';
}

export const useMapCoordinates = (mapPoints: Point[]) => {
  // Calculate map center based on average of point coordinates
  const getMapCenter = useMemo((): [number, number] => {
    if (mapPoints.length === 0) return [31.7917, -7.0926]; // Default center of Morocco

    const sumLat = mapPoints.reduce((sum, point) => sum + point.lat, 0);
    const sumLng = mapPoints.reduce((sum, point) => sum + point.lng, 0);
    
    return [sumLat / mapPoints.length, sumLng / mapPoints.length];
  }, [mapPoints]);

  // Calculate appropriate zoom level based on the spread of points
  const getBoundsZoom = useMemo(() => {
    if (mapPoints.length <= 1) return 14; // Higher zoom for single point
    
    // Find min/max coordinates to establish bounds
    const lats = mapPoints.map(point => point.lat);
    const lngs = mapPoints.map(point => point.lng);
    
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    // Calculate distance between furthest points
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    
    // More focused zoom levels
    if (latDiff > 0.1 || lngDiff > 0.1) return 12;
    if (latDiff > 0.05 || lngDiff > 0.05) return 13;
    if (latDiff > 0.01 || lngDiff > 0.01) return 14;
    return 15; // Much closer zoom for very nearby points
  }, [mapPoints]);

  return { getMapCenter, getBoundsZoom };
};
