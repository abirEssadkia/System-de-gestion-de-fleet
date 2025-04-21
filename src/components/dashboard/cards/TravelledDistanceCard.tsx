
import React from 'react';
import { DashboardCard, DashboardCardTitle } from '@/components/dashboard/DashboardCard';
import { LineChart } from '@/components/dashboard/LineChart';
import { Selector } from '@/components/dashboard/Selector';

interface TravelledDistanceCardProps {
  handleDiagramClick: (type: 'donut' | 'line' | 'bar' | 'progress', title: string, data: any, description?: string) => void;
}

export const TravelledDistanceCard = ({ handleDiagramClick }: TravelledDistanceCardProps) => {
  const distanceData = [1000, 1200, 1100, 1800, 3000, 2700, 4200, 3800, 3200, 4000, 3000, 2500, 3500, 3000];
  const distanceLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];

  // Same options as FleetStatusCard
  const locationOptions = [
    'All Locations', 'Rabat', 'Casablanca', 'Marrakech', 'Nador', 'Ouarzazate', 'Fes', 'Agadir', 'Tanger'
  ];

  return (
    <DashboardCard className="col-span-1" delay="300">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <DashboardCardTitle>Travelled Distance</DashboardCardTitle>
          <div className="flex space-x-2">
            <Selector 
              label="Location" 
              options={locationOptions}
            />
            <Selector 
              label="Vehicles" 
              options={['All Vehicles']} 
            />
          </div>
        </div>
        
        <div className="mt-2 mb-3">
          <div className="text-sm font-medium text-fleet-dark-gray">Total travelled distance = 16 720 km</div>
          <div className="text-sm font-medium text-fleet-dark-gray">Avg. Travelled distance per vehicle = 119 km</div>
        </div>
        
        <div 
          className="flex-1 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => handleDiagramClick('line', 'Travelled Distance', distanceData, 'This chart visualizes the distance travelled by your fleet over time, helping you identify trends and peak usage periods.')}
        >
          <LineChart 
            data={distanceData} 
            labels={distanceLabels}
            color="#2A6ED2"
          />
          <div className="text-xs text-center text-fleet-dark-gray mt-1">HEURE</div>
        </div>
      </div>
    </DashboardCard>
  );
};
