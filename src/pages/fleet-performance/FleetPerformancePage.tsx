
import React from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { useFleetPerformanceData } from './useFleetPerformanceData';
import { FleetPerformanceHeader } from './FleetPerformanceHeader';
import { MetricsCards } from './MetricsCards';
import { PerformanceInsights } from './PerformanceInsights';

export const FleetPerformancePage: React.FC = () => {
  const {
    predictionMode,
    selectedPeriod,
    selectedVehicle,
    idleHours,
    fuelWaste,
    fuelCost,
    idleCost,
    costSavings,
    setSelectedPeriod,
    setSelectedVehicle,
    handlePredictionModeChange
  } = useFleetPerformanceData();
  
  return (
    <div className="min-h-screen bg-fleet-gray">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <FleetPerformanceHeader 
            selectedVehicle={selectedVehicle}
            selectedPeriod={selectedPeriod}
            predictionMode={predictionMode}
            onVehicleChange={setSelectedVehicle}
            onPeriodChange={setSelectedPeriod}
            onPredictionModeChange={handlePredictionModeChange}
          />
          
          <p className="text-gray-600 mb-6">
            Advanced analytics that use machine learning to predict fleet performance metrics and identify optimization opportunities.
          </p>

          <MetricsCards
            idleHours={idleHours}
            fuelWaste={fuelWaste}
            predictionMode={predictionMode}
            costSavings={costSavings}
          />

          <PerformanceInsights
            idleCost={idleCost}
            fuelCost={fuelCost}
            selectedPeriod={selectedPeriod}
          />
        </div>
      </main>
    </div>
  );
};
