
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { DashboardCard, DashboardCardTitle } from '@/components/dashboard/DashboardCard';
import { useMapPoints } from '@/hooks/useMapPoints';
import { MapMarkers } from '@/components/dashboard/cards/utils/MapMarkers';
import { LoadingState } from '@/components/dashboard/cards/utils/LoadingState';
import { ErrorState } from '@/components/dashboard/cards/utils/ErrorState';
import 'leaflet/dist/leaflet.css';

interface DeliveryMapProps {
  title: string;
  handleClick?: (type: string, title: string, data: any, description?: string) => void;
}

export const DeliveryMap: React.FC<DeliveryMapProps> = ({ title, handleClick }) => {
  const { mapPoints, isLoading, error, mapData } = useMapPoints(title);
  
  const handleMapClick = () => {
    if (handleClick) {
      handleClick('map', title, mapData, `Location tracking for ${title} delivery operations`);
    }
  };
  
  if (isLoading) {
    return <LoadingState title={title} />;
  }
  
  if (error || !mapPoints || mapPoints.length === 0) {
    return <ErrorState title={title} />;
  }
  
  // Calculate map center based on the first point
  const center: [number, number] = mapPoints.length > 0 
    ? [mapPoints[0].lat, mapPoints[0].lng] 
    : [31.7917, -7.0926]; // Default center (Morocco)
  
  return (
    <DashboardCard className="col-span-1 min-h-[200px]">
      <DashboardCardTitle>{title}</DashboardCardTitle>
      <div
        className="relative h-[150px] rounded-md overflow-hidden cursor-pointer"
        onClick={handleMapClick}
      >
        <MapContainer 
          center={center}
          zoom={12} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapMarkers points={mapPoints} />
        </MapContainer>
      </div>
    </DashboardCard>
  );
};
