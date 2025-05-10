
import { useState, useEffect } from 'react';
import { getCoordinatesForLocation } from '@/components/dashboard/cards/utils/mapCoordinates';
import { Point } from '@/components/map-detail-view/types';

export const useMapPoints = (locationName: string) => {
  const [mapPoints, setMapPoints] = useState<Point[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchMapPoints = async () => {
      try {
        setIsLoading(true);
        // Get coordinates based on location name
        const coordinates = getCoordinatesForLocation(locationName);
        
        if (!coordinates || coordinates.length === 0) {
          throw new Error(`No coordinates found for ${locationName}`);
        }
        
        // Transform coordinates to map points
        const points: Point[] = coordinates.map(coord => ({
          lat: coord.lat,
          lng: coord.lng,
          description: coord.label || '',
          type: coord.type as 'speed' | 'fuel' | 'activity' | 'geofence' | 'time'
        }));
        
        setMapPoints(points);
        setError(null);
      } catch (err) {
        console.error(`Error loading map points for ${locationName}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMapPoints();
  }, [locationName]);
  
  // Prepare map data for detail view
  const mapData = {
    center: mapPoints.length > 0 
      ? { lat: mapPoints[0].lat, lng: mapPoints[0].lng } 
      : { lat: 31.7917, lng: -7.0926 }, // Center of Morocco
    points: mapPoints,
    locationName
  };
  
  return { mapPoints, isLoading, error, mapData };
};
