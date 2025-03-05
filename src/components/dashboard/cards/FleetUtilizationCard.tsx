
import React from 'react';
import { DashboardCard, DashboardCardTitle } from '@/components/dashboard/DashboardCard';
import { CircularProgress } from '@/components/dashboard/CircularProgress';
import { Selector } from '@/components/dashboard/Selector';

interface FleetUtilizationCardProps {
  handleDiagramClick: (type: 'donut' | 'line' | 'bar' | 'progress', title: string, data: any, description?: string) => void;
}

export const FleetUtilizationCard = ({ handleDiagramClick }: FleetUtilizationCardProps) => {
  return (
    <DashboardCard className="col-span-1" delay="200">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <DashboardCardTitle>Fleet Utilization</DashboardCardTitle>
          <Selector 
            label="Period" 
            options={['Last 7 days', 'Last 30 days', 'Last 90 days']} 
          />
        </div>
        
        <div 
          className="flex-1 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => handleDiagramClick('progress', 'Fleet Utilization', 80, 'This metric represents how effectively your fleet is being utilized. A higher percentage indicates better resource management.')}
        >
          <CircularProgress value={80} size={150} color="#2A6ED2">
            <div className="text-center">
              <div className="text-4xl font-bold">80%</div>
            </div>
          </CircularProgress>
        </div>
      </div>
    </DashboardCard>
  );
};
