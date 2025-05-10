
import { MapCoordinate } from '@/components/map-detail-view/types';

// Sample coordinates for different locations
const locationCoordinates: Record<string, MapCoordinate[]> = {
  'Casablanca': [
    { lat: 33.5731, lng: -7.5898, label: 'Delivery delay', type: 'time' },
    { lat: 33.5931, lng: -7.6098, label: 'Vehicle stopped', type: 'activity' },
    { lat: 33.5531, lng: -7.5698, label: 'Low fuel alert', type: 'fuel' }
  ],
  'Marrakech': [
    { lat: 31.6295, lng: -7.9811, label: 'Speeding incident', type: 'speed' },
    { lat: 31.6495, lng: -7.9611, label: 'Geofence exit', type: 'geofence' }
  ],
  'Fes': [
    { lat: 34.0181, lng: -5.0078, label: 'Delivery completed', type: 'activity' },
    { lat: 34.0381, lng: -5.0278, label: 'Maintenance needed', type: 'activity' }
  ],
  'Nador': [
    { lat: 35.1740, lng: -2.9287, label: 'Driver break', type: 'time' },
    { lat: 35.1640, lng: -2.9187, label: 'Route deviation', type: 'geofence' }
  ],
  'Agadir': [
    { lat: 30.4278, lng: -9.5981, label: 'Speeding alert', type: 'speed' },
    { lat: 30.4178, lng: -9.5881, label: 'Long idle time', type: 'time' }
  ],
  'Ouarzazate': [
    { lat: 30.9335, lng: -6.9370, label: 'Harsh braking', type: 'activity' },
    { lat: 30.9235, lng: -6.9270, label: 'Fuel refill needed', type: 'fuel' }
  ],
  'Rabat': [
    { lat: 34.0209, lng: -6.8416, label: 'Traffic delay', type: 'time' },
    { lat: 34.0309, lng: -6.8516, label: 'Unscheduled stop', type: 'activity' }
  ],
  'Tanger': [
    { lat: 35.7595, lng: -5.8340, label: 'Border crossing', type: 'geofence' },
    { lat: 35.7695, lng: -5.8240, label: 'Speed violation', type: 'speed' }
  ]
};

// Default coordinates for missing locations
const defaultCoordinates: MapCoordinate[] = [
  { lat: 31.7917, lng: -7.0926, label: 'Alert', type: 'activity' }
];

// Function to get coordinates for a specific location
export const getCoordinatesForLocation = (location: string): MapCoordinate[] => {
  const normalizedLocation = location.trim();
  
  // Check if we have coordinates for this location
  for (const [key, coords] of Object.entries(locationCoordinates)) {
    if (normalizedLocation.toLowerCase().includes(key.toLowerCase())) {
      return coords;
    }
  }
  
  // Return default coordinates if no match found
  console.warn(`No coordinates found for location: ${location}, using defaults`);
  return defaultCoordinates;
};

// Types
export interface MapCoordinate {
  lat: number;
  lng: number;
  label?: string;
  type: string;
}
