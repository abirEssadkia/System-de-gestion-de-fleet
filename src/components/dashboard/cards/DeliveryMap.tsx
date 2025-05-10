
import React from 'react';
import { DashboardCard, DashboardCardTitle } from '@/components/dashboard/DashboardCard';
import { useMapPoints } from '@/hooks/useMapPoints';
import { MapMarkers } from '@/components/dashboard/cards/utils/MapMarkers';
import { LoadingState } from '@/components/dashboard/cards/utils/LoadingState';
import { ErrorState } from '@/components/dashboard/cards/utils/ErrorState';

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
  
  return (
    <DashboardCard className="col-span-1 min-h-[200px]">
      <DashboardCardTitle>{title}</DashboardCardTitle>
      <div
        className="relative h-[150px] rounded-md overflow-hidden cursor-pointer"
        onClick={handleMapClick}
      >
        <div className="absolute inset-0 bg-gray-100">
          <MapMarkers points={mapPoints} />
        </div>
      </div>
    </DashboardCard>
  );
};
