
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { alerts as allAlerts } from '@/utils/alertsData';
import { FilterOptions } from '@/components/dashboard/FilterPanel';
import { SetBoundsToMarkers } from './map/SetBoundsToMarkers';
import { useMapCoordinates } from './map/MapCoordinates';
import { useMapPointsFilter } from './map/MapPointsFilter';
import { AlertCounter } from './map/AlertCounter';
import { MapMarkers } from './map/MapMarkers';
import { useDiagramDetails } from '@/hooks/useDiagramDetails';

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
  showFullMapButton?: boolean;
  title?: string;
}

export const MapView: React.FC<MapViewProps> = ({ 
  data, 
  type = 'all', 
  filters,
  showFullMapButton = false,
  title = 'Alerts Map'
}) => {
  // Get filtered map points
  const mapPoints = useMapPointsFilter({ data, type, filters, allAlerts });
  
  // Get map coordinates
  const { getMapCenter, getBoundsZoom } = useMapCoordinates(mapPoints);
  
  // Get diagram details hook
  const { handleDiagramClick } = useDiagramDetails();
  
  // Handle open in new window
  const handleOpenFullMap = () => {
    handleDiagramClick('map', title, mapPoints, `Map of ${mapPoints.length} ${type} alerts`);
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
        
        <MapMarkers points={mapPoints} />
        
        {/* Add component to automatically set bounds */}
        <SetBoundsToMarkers points={mapPoints} />
      </MapContainer>
      
      <AlertCounter 
        count={mapPoints.length} 
        showButton={showFullMapButton}
        onClick={handleOpenFullMap}
      />
    </div>
  );
};
