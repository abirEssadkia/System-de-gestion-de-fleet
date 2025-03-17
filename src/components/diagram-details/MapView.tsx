
import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Point {
  lat: number;
  lng: number;
  description?: string;
}

interface MapViewProps {
  data: Point[];
}

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
    if (data.length <= 1) return 13; // Default zoom for single point
    
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
    
    // Adjust zoom based on distance (larger distance = lower zoom)
    if (latDiff > 0.1 || lngDiff > 0.1) return 11;
    if (latDiff > 0.05 || lngDiff > 0.05) return 12;
    if (latDiff > 0.01 || lngDiff > 0.01) return 13;
    return 14;
  }, [data]);

  const customMarkerIcon = new L.Icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

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
            icon={customMarkerIcon}
          >
            <Popup>
              {point.description || `Issue at ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <div className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-md shadow-sm text-sm z-[400]">
        {data.length} delivery/pickup issue{data.length > 1 ? 's' : ''} detected
      </div>
    </div>
  );
};
