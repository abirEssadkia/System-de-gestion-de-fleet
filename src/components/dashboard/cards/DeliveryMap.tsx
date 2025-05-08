import React, { useMemo } from 'react';
import { DashboardCard, DashboardCardTitle } from '@/components/dashboard/DashboardCard';
import { MapPin, AlertTriangle, BellDot, AlertCircle, Siren, Fuel, Clock, Map } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToString } from 'react-dom/server';
import { getAlertPointsByType } from '@/utils/alertsData';
import { useQuery } from '@tanstack/react-query';
import { getLocations, getFallbackLocations, Location } from '@/services/locationService';

interface Point {
  lat: number;
  lng: number;
  description?: string;
  type?: 'speed' | 'fuel' | 'activity' | 'geofence' | 'time';
}

interface DeliveryMapProps {
  title: string;
  points?: Point[];
  type?: 'speed' | 'fuel' | 'activity' | 'geofence' | 'time' | 'all';
  handleClick?: (type: string, title: string, data: any, description?: string) => void;
}

// Component to set bounds of map to include all markers
const SetBoundsToMarkers = ({ points }: { points: Point[] }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (points.length > 0) {
      // Create an array of LatLng objects
      const latLngs = points.map(point => L.latLng(point.lat, point.lng));
      
      // Create a bounds object
      const bounds = L.latLngBounds(latLngs);
      
      // Fit the map to these bounds with some padding
      map.fitBounds(bounds, { 
        padding: [20, 20],
        maxZoom: 14 // Limit max zoom level for dashboard small maps
      });
    }
  }, [map, points]);
  
  return null;
};

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
const getPointsForLocation = (locationName: string): Point[] => {
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

export const DeliveryMap: React.FC<DeliveryMapProps> = ({ 
  title, 
  points, 
  type = 'all', 
  handleClick 
}) => {
  // Fetch locations from API
  const { data: locations, isLoading, error } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
    onSuccess: (data) => {
      console.log('Locations loaded in DeliveryMap');
    },
    onError: () => {
      console.error('Error fetching locations in DeliveryMap');
      return getFallbackLocations();
    }
  });

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

  // Check if this location exists in our fetched locations
  const locationExists = useMemo(() => {
    if (!locations) return true; // Default to true while loading
    return locations.some(loc => 
      loc.name === title || 
      loc.originalName === title || 
      loc.name === title.replace('Parc_', '')
    );
  }, [locations, title]);

  const openDetails = () => {
    if (handleClick) {
      handleClick('map', title, mapPoints, `${title} delivery issues`);
    }
  };

  // Calculate map center based on average of point coordinates
  const getMapCenter = useMemo((): [number, number] => {
    if (mapPoints.length === 0) return [31.7917, -7.0926]; // Default center of Morocco

    const sumLat = mapPoints.reduce((sum, point) => sum + point.lat, 0);
    const sumLng = mapPoints.reduce((sum, point) => sum + point.lng, 0);
    
    return [sumLat / mapPoints.length, sumLng / mapPoints.length];
  }, [mapPoints]);

  // Calculate appropriate zoom level based on the spread of points
  const getBoundsZoom = useMemo(() => {
    if (mapPoints.length <= 1) return 13; // Default zoom for single point
    
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
    
    // For small preview maps on dashboard, make sure we can see all points
    if (latDiff > 0.05 || lngDiff > 0.05) return 12;
    if (latDiff > 0.02 || lngDiff > 0.02) return 13;
    return 14;
  }, [mapPoints]);

  // Generate different alert icons for variety
  const createAlertIcon = (index: number, pointType?: string) => {
    // For dashboard maps, use smaller icons
    let iconType: string;
    
    // If the point has a specific type, use it, otherwise use a cycling pattern
    if (pointType) {
      iconType = pointType;
    } else {
      iconType = ['speed', 'fuel', 'activity', 'geofence', 'time'][index % 5] || 'speed';
    }
    
    let iconHtml;
    
    switch(iconType) {
      case 'speed':
        iconHtml = renderToString(<AlertTriangle className="h-6 w-6 text-red-500 fill-red-100" />);
        break;
      case 'fuel':
        iconHtml = renderToString(<Fuel className="h-6 w-6 text-amber-500 fill-amber-100" />);
        break;
      case 'activity':
        iconHtml = renderToString(<Clock className="h-6 w-6 text-orange-500 fill-orange-100" />);
        break;
      case 'geofence':
        iconHtml = renderToString(<Map className="h-6 w-6 text-violet-500 fill-violet-100" />);
        break;
      case 'time':
        iconHtml = renderToString(<Clock className="h-6 w-6 text-blue-500 fill-blue-100" />);
        break;
      default:
        iconHtml = renderToString(<AlertCircle className="h-6 w-6 text-red-500 fill-red-100" />);
    }
    
    return L.divIcon({
      html: iconHtml,
      className: 'custom-alert-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24]
    });
  };

  if (isLoading) {
    return (
      <DashboardCard className="col-span-1 min-h-[200px]">
        <DashboardCardTitle>{title || 'Loading...'}</DashboardCardTitle>
        <div className="flex justify-center items-center h-[150px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fleet-navy"></div>
        </div>
      </DashboardCard>
    );
  }

  if (error || !locationExists) {
    return (
      <DashboardCard className="col-span-1 min-h-[200px]">
        <DashboardCardTitle>{title || 'Error'}</DashboardCardTitle>
        <div className="flex justify-center items-center h-[150px] text-center text-gray-500">
          <p>Location data unavailable</p>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard 
      className="col-span-1 min-h-[200px] cursor-pointer hover:shadow-md transition-shadow" 
      onClick={openDetails}
    >
      <DashboardCardTitle>{title}</DashboardCardTitle>
      
      <div className="relative h-[150px] rounded-lg mt-2 overflow-hidden">
        <MapContainer 
          center={getMapCenter} 
          zoom={getBoundsZoom} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {mapPoints.map((point, index) => (
            <Marker 
              key={index} 
              position={[point.lat, point.lng]}
              icon={createAlertIcon(index, point.type)}
            >
              <Popup>
                {point.description || `Issue at ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`}
              </Popup>
            </Marker>
          ))}
          
          {/* Add component to automatically set bounds */}
          <SetBoundsToMarkers points={mapPoints} />
        </MapContainer>
        
        <div className="absolute bottom-2 right-2 bg-white/80 px-2 py-1 rounded text-xs text-gray-500 z-[400]">
          {mapPoints.length} alert{mapPoints.length > 1 ? 's' : ''} detected
        </div>
      </div>
    </DashboardCard>
  );
};
