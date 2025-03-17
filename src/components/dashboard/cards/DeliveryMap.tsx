
import React from 'react';
import { DashboardCard, DashboardCardTitle } from '@/components/dashboard/DashboardCard';
import { MapPin } from 'lucide-react';
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

interface DeliveryMapProps {
  title: string;
  points: Point[];
  handleClick?: (type: string, title: string, data: any, description?: string) => void;
}

export const DeliveryMap: React.FC<DeliveryMapProps> = ({ title, points, handleClick }) => {
  const openDetails = () => {
    if (handleClick) {
      handleClick('map', title, points, `Delivery and pickup issues in ${title}`);
    }
  };

  // Calculate map center based on average of point coordinates
  const getMapCenter = (): [number, number] => {
    if (points.length === 0) return [31.7917, -7.0926]; // Default center of Morocco

    const sumLat = points.reduce((sum, point) => sum + point.lat, 0);
    const sumLng = points.reduce((sum, point) => sum + point.lng, 0);
    
    return [sumLat / points.length, sumLng / points.length];
  };

  const customMarkerIcon = new L.Icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <DashboardCard className="col-span-1 min-h-[200px] cursor-pointer hover:shadow-md transition-shadow" onClick={openDetails}>
      <DashboardCardTitle>{title}</DashboardCardTitle>
      
      <div className="relative h-[150px] rounded-lg mt-2 overflow-hidden">
        <MapContainer 
          center={getMapCenter()} 
          zoom={10} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {points.map((point, index) => (
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
        
        <div className="absolute bottom-2 right-2 bg-white/80 px-2 py-1 rounded text-xs text-gray-500 z-[400]">
          {points.length} issue{points.length > 1 ? 's' : ''} detected
        </div>
      </div>
    </DashboardCard>
  );
};
