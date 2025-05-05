
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getVehicles } from '@/services/fleetService';

export const useFleetPerformanceData = () => {
  const [predictionMode, setPredictionMode] = useState<'actual' | 'ml'>('ml');
  const [selectedPeriod, setSelectedPeriod] = useState('Last 7 days');
  const [selectedVehicle, setSelectedVehicle] = useState('All Vehicles');
  
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
  
  // Calculate additional metrics
  const fuelCost = fuelWaste * 1.8; // Assuming €1.80 per liter
  const idleCost = idleHours * 25; // Estimated cost of €25 per idle hour
  const totalCost = fuelCost + idleCost;
  const costSavings = predictionMode === 'ml' ? Math.round((idleCost * 0.38) + (fuelCost * 0.38)) : 0;

  const handlePredictionModeChange = (value: string) => {
    setPredictionMode(value === 'ML Predictions' ? 'ml' : 'actual');
  };

  return {
    predictionMode,
    selectedPeriod,
    selectedVehicle,
    vehicleOptions,
    idleHours,
    fuelWaste,
    fuelCost,
    idleCost,
    totalCost,
    costSavings,
    setSelectedPeriod,
    setSelectedVehicle,
    handlePredictionModeChange
  };
};
