import { useMemo } from 'react';
import { Point } from '@/components/map-detail-view/types';
import { getAlertPointsByType } from '@/utils/alertsData';

// Sample locations data for the delivery maps in Morocco
const locationCoordinates: Record<string, { lat: number, lng: number, points: Point[] }> = {
  'Casablanca': {
    lat: 33.5731, 
    lng: -7.5898,
    points: [
      {lat: 33.5731, lng: -7.5898, description: "Delivery failed at Maârif"},
      {lat: 33.5950, lng: -7.6190, description: "Package return at Sidi Belyout"}
    ]
  },
  'Marrakech': {
    lat: 31.6295, 
    lng: -7.9811,
    points: [
      {lat: 31.6295, lng: -7.9811, description: "Delayed pickup at Medina"},
      {lat: 31.6425, lng: -8.0022, description: "Missed delivery at Hivernage"},
      {lat: 31.6140, lng: -8.0352, description: "Late delivery at Palmeraie"}
    ]
  },
  'Fes': {
    lat: 34.0181, 
    lng: -5.0078,
    points: [
      {lat: 34.0181, lng: -5.0078, description: "Delivery issue at Rcif"},
      {lat: 34.0330, lng: -4.9830, description: "Package return at Bab Jdid"}
    ]
  },
  'Nador': {
    lat: 35.1740, 
    lng: -2.9287,
    points: [
      {lat: 35.1740, lng: -2.9287, description: "Failed pickup at City Center"},
      {lat: 35.1680, lng: -2.9380, description: "Delivery exception at Boulevard Hassan II"},
      {lat: 35.1611, lng: -2.9500, description: "Delayed delivery at Corniche"}
    ]
  },
  'Agadir': {
    lat: 30.4278, 
    lng: -9.5981,
    points: [
      {lat: 30.4278, lng: -9.5981, description: "Late delivery at Marina"},
      {lat: 30.4060, lng: -9.5900, description: "Missed pickup at Founty"}
    ]
  },
  'Ouarzazate': {
    lat: 30.9335,
    lng: -6.9370,
    points: [
      {lat: 30.9335, lng: -6.9370, description: "Package return at City Center"},
      {lat: 30.9200, lng: -6.9100, description: "Pickup issue at Atlas Studios"},
      {lat: 30.9150, lng: -6.8930, description: "Delivery problem at Tabounte"}
    ]
  },
  'Rabat': {
    lat: 34.0209, 
    lng: -6.8416,
    points: [
      {lat: 34.0209, lng: -6.8416, description: "Delayed delivery at Hassan"},
      {lat: 34.0100, lng: -6.8300, description: "Package return at Agdal"}
    ]
  },
  'Tanger': {
    lat: 35.7812, 
    lng: -5.8137,
    points: [
      {lat: 35.7812, lng: -5.8137, description: "Failed delivery at Marina Bay"},
      {lat: 35.7690, lng: -5.8330, description: "Missed pickup at Old Medina"},
      {lat: 35.7590, lng: -5.8033, description: "Delivery issue at Malabata"}
    ]
  }
};

// Helper function to get points for a location, considering API city name vs our data
export const getPointsForLocation = (locationName: string): Point[] => {
  // Clean up location name (remove 'Parc_' if it exists)
  const cleanName = locationName.replace('Parc_', '');
  
  // Direct match
  if (locationCoordinates[cleanName]) {
    return locationCoordinates[cleanName].points;
  }
  
  // Handle special case for Casa -> Casablanca
  if (cleanName === 'Casa') {
    return locationCoordinates['Casablanca'].points;
  }
  
  // Return empty array if no match
  return [];
};

interface UseLocationMapPointsProps {
  title: string;
  points?: Point[];
  type?: 'speed' | 'fuel' | 'activity' | 'geofence' | 'time' | 'all';
}

export const useLocationMapPoints = ({ title, points, type = 'all' }: UseLocationMapPointsProps) => {
  // Use the alerts data if no points are provided
  const mapPoints = useMemo(() => {
    if (points && points.length > 0) return points;
    
    // If we have a title that matches a location, use those points
    if (title && locationCoordinates[title]) {
      return locationCoordinates[title].points;
    }
    
    // Otherwise fall back to alert points by type
    return getAlertPointsByType(type);
  }, [points, title, type]);

  return mapPoints;
};
