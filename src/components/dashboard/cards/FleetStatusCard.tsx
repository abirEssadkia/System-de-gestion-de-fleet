
import React from 'react';
import { DashboardCard, DashboardCardTitle } from '@/components/dashboard/DashboardCard';
import { Selector } from '@/components/dashboard/Selector';

interface FleetStatusCardProps {
  handleDiagramClick: (type: 'donut' | 'line' | 'bar' | 'progress', title: string, data: any, description?: string) => void;
}

export const FleetStatusCard = ({ handleDiagramClick }: FleetStatusCardProps) => {
  const fleetStatus = [
    { label: 'Running', value: 80, color: '#18C29C', percentage: 80 },
    { label: 'Idle', value: 13, color: '#FFB400', percentage: 13 },
    { label: 'Stopped', value: 5, color: '#FF5A5F', percentage: 5 },
    { label: 'No data', value: 2, color: '#4A5568', percentage: 2 },
  ];

  return (
    <DashboardCard className="col-span-1" delay="100">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <DashboardCardTitle>RTL Fleet Status</DashboardCardTitle>
          <Selector 
            label="Location" 
            options={['All Locations', 'Rabat', 'Casablanca', 'Marrakech', 'Nador', 'Ouarzazate', 'Fes', 'Agadir', 'Tanger']} 
          />
        </div>
        
        <div 
          className="flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => handleDiagramClick('donut', 'RTL Fleet Status', fleetStatus, 'This chart shows the current status of all vehicles in your fleet, categorized by their operational state.')}
        >
          <div className="w-32 h-32 relative mb-4">
            <img 
              src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%2318C29C' d='M50 0A50 50 0 1 1 50 100A50 50 0 0 1 50 0'/%3E%3Cpath fill='%23FFB400' d='M50 0A50 50 0 0 1 100 50L50 50Z'/%3E%3Cpath fill='%23FF5A5F' d='M100 50A50 50 0 0 1 85 85L50 50Z'/%3E%3Cpath fill='%234A5568' d='M85 85A50 50 0 0 1 50 100L50 50Z'/%3E%3C/svg%3E" 
              alt="Fleet Status" 
              className="w-full h-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-base font-medium">100 Assets</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 mt-2">
          {fleetStatus.map((status, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: status.color }}
                ></div>
                <span className="text-sm">{status.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{status.value}</span>
                <span className="text-xs text-gray-500">({status.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
};
