
import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle, BellDot, AlertCircle, Siren } from 'lucide-react';
import { renderToString } from 'react-dom/server';

// No need for default icons since we'll use custom ones
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

interface Point {
  lat: number;
  lng: number;
  description?: string;
}

interface MapViewProps {
  data: Point[];
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

export const MapView: React.FC<MapViewProps> = ({ data }) => {
  // Calculate map center based on average of point coordinates
  const getMapCenter = useMemo((): [number, number] => {
    if (data.length === 0) return [31.7917, -7.0926]; // Default center of Morocco

    const sumLat = data.reduce((sum, point) => sum + point.lat, 0);
    const sumLng = data.reduce((sum, point) => sum + point.lng, 0);
    
    return [sumLat / data.length, sumLng / data.length];
  }, [data]);

  // Calculate appropriate zoom level based on the spread of points
  const getBoundsZoom = useMemo(() => {
    if (data.length <= 1) return 14; // Higher zoom for single point
    
    // Find min/max coordinates to establish bounds
    const lats = data.map(point => point.lat);
    const lngs = data.map(point => point.lng);
    
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
  }, [data]);

  // Generate different alert icons for variety
  const createAlertIcon = (index: number) => {
    // Choose different alert icons based on index modulo
    const iconType = index % 4;
    let iconHtml;
    
    switch(iconType) {
      case 0:
        iconHtml = renderToString(<AlertTriangle className="h-8 w-8 text-red-500 fill-red-100" />);
        break;
      case 1:
        iconHtml = renderToString(<AlertCircle className="h-8 w-8 text-amber-500 fill-amber-100" />);
        break;
      case 2:
        iconHtml = renderToString(<BellDot className="h-8 w-8 text-orange-500 fill-orange-100" />);
        break;
      case 3:
        iconHtml = renderToString(<Siren className="h-8 w-8 text-red-600 fill-red-100" />);
        break;
      default:
        iconHtml = renderToString(<AlertTriangle className="h-8 w-8 text-red-500 fill-red-100" />);
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
        
        {data.map((point, index) => (
          <Marker 
            key={index} 
            position={[point.lat, point.lng]}
            icon={createAlertIcon(index)}
          >
            <Popup>
              {point.description || `Issue at ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`}
            </Popup>
          </Marker>
        ))}
        
        {/* Add component to automatically set bounds */}
        <SetBoundsToMarkers points={data} />
      </MapContainer>
      
      <div className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-md shadow-sm text-sm z-[400]">
        {data.length} delivery/pickup issue{data.length > 1 ? 's' : ''} detected
      </div>
    </div>
  );
};
