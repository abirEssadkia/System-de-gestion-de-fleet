
import React, { useState } from 'react';
import { DashboardCard, DashboardCardTitle } from '@/components/dashboard/DashboardCard';
import { Selector } from '@/components/dashboard/Selector';
import { useQuery } from '@tanstack/react-query';
import { getVehicles } from '@/services/fleetService';
import { Brain, TrendingUp } from 'lucide-react';

interface FleetIdleCardProps {
  handleDiagramClick: (type: 'donut' | 'line' | 'bar' | 'progress', title: string, data: any, description?: string) => void;
}

export const FleetIdleCard = ({ handleDiagramClick }: FleetIdleCardProps) => {
  const [predictionMode, setPredictionMode] = useState<'actual' | 'ml'>('actual');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('All Vehicles');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Last 7 days');
  
  const { data: vehiclesData = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicles,
  });

  // Transform vehicles into options format
  const vehicleOptions = ['All Vehicles', ...vehiclesData.map(v => `${v.model} (${v.licensePlate})`)];

  // Values based on prediction mode and period
  let idleHours = predictionMode === 'actual' ? 68 : 42;
  let fuelWaste = predictionMode === 'actual' ? 47.6 : 29.4;
  
  // Adjust values based on selected period
  if (selectedPeriod === 'Last 30 days') {
    idleHours = predictionMode === 'actual' ? 289 : 178;
    fuelWaste = predictionMode === 'actual' ? 196.2 : 124.5;
  } else if (selectedPeriod === 'Last 90 days') {
    idleHours = predictionMode === 'actual' ? 824 : 512;
    fuelWaste = predictionMode === 'actual' ? 576.8 : 358.4;
  }

  return (
    <DashboardCard className="col-span-1" delay="400">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-5">
          <DashboardCardTitle>Fleet Idle</DashboardCardTitle>
          <div className="flex space-x-2">
            <Selector 
              label="Vehicles" 
              options={vehicleOptions}
              value={selectedVehicle}
              onChange={(value) => setSelectedVehicle(value)}
            />
            <Selector 
              label="Period" 
              options={['Last 7 days', 'Last 30 days', 'Last 90 days']} 
              value={selectedPeriod}
              onChange={(value) => setSelectedPeriod(value)}
            />
            <Selector
              label="Predictions"
              options={['Actual Data', 'ML Predictions']}
              onChange={(value) => setPredictionMode(value === 'ML Predictions' ? 'ml' : 'actual')}
            />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center space-y-6">
          <div 
            className="text-center cursor-pointer hover:bg-white/5 rounded-lg p-3 transition-colors"
            onClick={() => handleDiagramClick('progress', 'Total Fleet Idle', idleHours, 'This metric shows the total time your fleet has been idle, which can help identify opportunities to improve operational efficiency.')}
          >
            <div className="flex items-center justify-center mb-1">
              {predictionMode === 'actual' ? (
                <img 
                  src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' stroke='%23FFB400' stroke-width='2' d='M12,3 C16.971,3 21,7.029 21,12 C21,16.971 16.971,21 12,21 C7.029,21 3,16.971 3,12 C3,7.029 7.029,3 12,3 Z M12,7 L12,12 L16,12'/%3E%3C/svg%3E" 
                  alt="Clock" 
                  className="w-8 h-8 mb-1"
                />
              ) : (
                <Brain className="w-8 h-8 mb-1 text-green-400" />
              )}
            </div>
            <div className="text-2xl font-bold">
              {predictionMode === 'ml' ? 'ML Predicted Idle' : 'Total Fleet Idle'}
            </div>
            <div className="text-4xl font-bold mt-1">
              {idleHours} hours
              {predictionMode === 'ml' && (
                <div className="text-sm text-green-400 flex items-center justify-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" /> 38% reduction predicted
                </div>
              )}
            </div>
          </div>
          
          <div 
            className="text-center cursor-pointer hover:bg-white/5 rounded-lg p-3 transition-colors"
            onClick={() => handleDiagramClick('progress', predictionMode === 'ml' ? 'Predicted Fuel Waste' : 'Approx Fuel Waste', fuelWaste, 'This metric estimates the amount of fuel wasted during idle time, which has both financial and environmental implications.')}
          >
            <div className="flex items-center justify-center mb-1">
              {predictionMode === 'actual' ? (
                <img 
                  src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' stroke='%23FF5A5F' stroke-width='2' d='M3,7 L12,7 L12,12 M12,17 L21,17 M5,3 L19,3 C20.105,3 21,3.895 21,5 L21,7 L3,7 L3,5 C3,3.895 3.895,3 5,3 Z M3,7 L3,19 C3,20.105 3.895,21 5,21 L19,21 C20.105,21 21,20.105 21,19 L21,7'/%3E%3C/svg%3E" 
                  alt="Fuel" 
                  className="w-8 h-8 mb-1"
                />
              ) : (
                <Brain className="w-8 h-8 mb-1 text-green-400" />
              )}
            </div>
            <div className="text-2xl font-bold">
              {predictionMode === 'ml' ? 'ML Predicted Fuel Waste' : 'Approx Fuel Waste'}
            </div>
            <div className="text-4xl font-bold mt-1">
              {fuelWaste} Liter
              {predictionMode === 'ml' && (
                <div className="text-sm text-green-400 flex items-center justify-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" /> 38% reduction predicted
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};
