
import React, { useMemo } from 'react';
import { DashboardCard, DashboardCardTitle } from '@/components/dashboard/DashboardCard';
import { MapPin, AlertTriangle, BellDot, AlertCircle, Siren, Fuel, Clock, Map } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToString } from 'react-dom/server';
import { getAlertPointsByType } from '@/utils/alertsData';

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

export const DeliveryMap: React.FC<DeliveryMapProps> = ({ title, points, type = 'all', handleClick }) => {
  // Use the alerts data if no points are provided
  const mapPoints = useMemo(() => {
    if (points && points.length > 0) return points;
    return getAlertPointsByType(type);
  }, [points, type]);

  const openDetails = () => {
    if (handleClick) {
      handleClick('map', title, mapPoints, `${title} in ${title}`);
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

  return (
    <DashboardCard className="col-span-1 min-h-[200px] cursor-pointer hover:shadow-md transition-shadow" onClick={openDetails}>
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
