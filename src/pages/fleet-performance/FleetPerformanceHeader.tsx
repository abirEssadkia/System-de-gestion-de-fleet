
import React from 'react';
import { Gauge, Brain } from 'lucide-react';
import { Selector } from '@/components/dashboard/Selector';

interface FleetPerformanceHeaderProps {
  selectedVehicle: string;
  selectedPeriod: string;
  predictionMode: 'actual' | 'ml';
  onVehicleChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
  onPredictionModeChange: (value: string) => void;
}

export const FleetPerformanceHeader: React.FC<FleetPerformanceHeaderProps> = ({
  selectedVehicle,
  selectedPeriod,
  predictionMode,
  onVehicleChange,
  onPeriodChange,
  onPredictionModeChange,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold text-fleet-navy flex items-center">
        <Gauge size={24} className="mr-2 text-blue-500" /> 
        Fleet Performance Predictions
        <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md flex items-center">
          <Brain size={12} className="mr-1" /> AI Powered
        </span>
      </h1>
      
      <div className="flex space-x-2">
        <Selector 
          label="Vehicles" 
          options={selectedVehicle ? [selectedVehicle] : []}
          value={selectedVehicle}
          onChange={onVehicleChange}
        />
        <Selector 
          label="Period" 
          options={['Last 7 days', 'Last 30 days', 'Last 90 days']} 
          value={selectedPeriod}
          onChange={onPeriodChange}
        />
        <Selector
          label="Predictions"
          options={['Actual Data', 'ML Predictions']}
          onChange={onPredictionModeChange}
        />
      </div>
    </div>
  );
};
