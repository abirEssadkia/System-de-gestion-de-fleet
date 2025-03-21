import React, { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle, BellDot, AlertCircle, Siren, Fuel, Clock, Map, BellRing } from 'lucide-react';
import { renderToString } from 'react-dom/server';
import { getAlertPointsByType, alerts as allAlerts, Alert } from '@/utils/alertsData';
import { FilterOptions } from '@/components/dashboard/FilterPanel';

// No need for default icons since we'll use custom ones
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

interface Point {
  lat: number;
  lng: number;
  description?: string;
  type?: 'speed' | 'fuel' | 'activity' | 'geofence' | 'time';
}

interface MapViewProps {
  data?: Point[];
  type?: 'speed' | 'fuel' | 'activity' | 'geofence' | 'time' | 'all';
  filters?: FilterOptions;
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
        padding: [50, 50],
        maxZoom: 15 // Limit max zoom level
      });
    }
  }, [map, points]);
  
  return null;
};

export const MapView: React.FC<MapViewProps> = ({ data, type = 'all', filters }) => {
  // Filter alerts based on the provided filters
  const mapPoints = useMemo(() => {
    // If data is explicitly provided, use it
    if (data && data.length > 0) return data;
    
    // Otherwise, apply filters to the alerts data
    let filteredAlerts = [...allAlerts];
    
    // Filter by alert type (from prop or filter)
    const alertType = filters?.alertType || type;
    if (alertType !== 'all') {
      filteredAlerts = filteredAlerts.filter(alert => alert.type === alertType);
    }
    
    // Filter by vehicle if selected
    if (filters?.selectedVehicles && filters.selectedVehicles.length > 0) {
      filteredAlerts = filteredAlerts.filter(alert => 
        filters.selectedVehicles.includes(alert.vehicleId)
      );
    }
    
    // Filter by date range
    if (filters?.startDate) {
      const startDate = new Date(filters.startDate);
      filteredAlerts = filteredAlerts.filter(alert => 
        new Date(alert.timestamp) >= startDate
      );
    }
    
    if (filters?.endDate) {
      const endDate = new Date(filters.endDate);
      // Set to end of day
      endDate.setHours(23, 59, 59, 999);
      filteredAlerts = filteredAlerts.filter(alert => 
        new Date(alert.timestamp) <= endDate
      );
    }
    
    // Filter by location/zone if selected
    if (filters?.selectedZone) {
      filteredAlerts = filteredAlerts.filter(alert => 
        alert.location?.includes(filters.selectedZone)
      );
    }
    
    // Convert filtered alerts to map points
    return filteredAlerts.map(alert => ({
      lat: alert.coordinates?.lat || 0,
      lng: alert.coordinates?.lng || 0,
      description: `${alert.title} (${alert.vehicleId}): ${alert.description}`,
      type: alert.type
    }));
  }, [data, type, filters]);

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

  // Generate different alert icons for variety
  const createAlertIcon = (index: number, pointType?: string) => {
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
        iconHtml = renderToString(<AlertTriangle className="h-8 w-8 text-red-500 fill-red-100" />);
        break;
      case 'fuel':
        iconHtml = renderToString(<Fuel className="h-8 w-8 text-amber-500 fill-amber-100" />);
        break;
      case 'activity':
        iconHtml = renderToString(<Clock className="h-8 w-8 text-orange-500 fill-orange-100" />);
        break;
      case 'geofence':
        iconHtml = renderToString(<Map className="h-8 w-8 text-violet-500 fill-violet-100" />);
        break;
      case 'time':
        iconHtml = renderToString(<Clock className="h-8 w-8 text-blue-500 fill-blue-100" />);
        break;
      default:
        iconHtml = renderToString(<AlertCircle className="h-8 w-8 text-red-500 fill-red-100" />);
    }
    
    return L.divIcon({
      html: iconHtml,
      className: 'custom-alert-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  };

  return (
    <div className="my-8 w-full h-[400px] mx-auto relative rounded-lg overflow-hidden border border-gray-200">
      <MapContainer 
        center={getMapCenter} 
        zoom={getBoundsZoom} 
        style={{ height: '100%', width: '100%' }}
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
      
      <div className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-md shadow-sm text-sm z-[400]">
        {mapPoints.length} alert{mapPoints.length > 1 ? 's' : ''} detected
      </div>
    </div>
  );
};
