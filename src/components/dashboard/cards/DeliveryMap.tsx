
import React from 'react';
import { DashboardCard, DashboardCardTitle } from '@/components/dashboard/DashboardCard';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useQuery } from '@tanstack/react-query';
import { getLocations, getFallbackLocations } from '@/services/locationService';
import { Point } from '@/components/map-detail-view/types';
import { SetBoundsToMarkers } from '@/components/map-detail-view/SetBoundsToMarkers';
import { useMapCoordinates } from './utils/mapCoordinates';
import { MapMarkers } from './utils/MapMarkers';
import { LoadingState } from './utils/LoadingState';
import { ErrorState } from './utils/ErrorState';
import { useLocationMapPoints } from '@/hooks/useLocationMapPoints';

interface DeliveryMapProps {
  title: string;
  points?: Point[];
  type?: 'speed' | 'fuel' | 'activity' | 'geofence' | 'time' | 'all';
  handleClick?: (type: string, title: string, data: any, description?: string) => void;
}

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
    onError: (error) => {
      console.error('Error fetching locations in DeliveryMap', error);
      return getFallbackLocations();
    }
  });

  // Get map points
  const mapPoints = useLocationMapPoints({ title, points, type });

  // Check if this location exists in our fetched locations
  const locationExists = React.useMemo(() => {
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

  // Get map center and zoom
  const { getMapCenter, getBoundsZoom } = useMapCoordinates(mapPoints);

  if (isLoading) {
    return <LoadingState title={title} />;
  }

  if (error || !locationExists) {
    return <ErrorState title={title} />;
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
          
          <MapMarkers mapPoints={mapPoints} />
          
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
