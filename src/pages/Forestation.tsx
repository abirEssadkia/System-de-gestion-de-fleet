
import React, { useState } from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { Brain, TrendingUp, Gauge } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Selector } from '@/components/dashboard/Selector';
import { useQuery } from '@tanstack/react-query';
import { getVehicles } from '@/services/fleetService';

const Forestation = () => {
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
  const idleCost = idleHours * 25; // Estimated cost of €25 per idle hour (driver wages, wear and tear)
  const totalCost = fuelCost + idleCost;
  
  return (
    <div className="min-h-screen bg-fleet-gray">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
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
          
          <p className="text-gray-600 mb-6">
            Advanced analytics that use machine learning to predict fleet performance metrics and identify optimization opportunities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {predictionMode === 'actual' ? (
                    <img 
                      src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' stroke='%23FFB400' stroke-width='2' d='M12,3 C16.971,3 21,7.029 21,12 C21,16.971 16.971,21 12,21 C7.029,21 3,16.971 3,12 C3,7.029 7.029,3 12,3 Z M12,7 L12,12 L16,12'/%3E%3C/svg%3E" 
                      alt="Clock" 
                      className="w-10 h-10 mb-1"
                    />
                  ) : (
                    <Brain className="w-10 h-10 mb-1 text-blue-400" />
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-1">
                  {predictionMode === 'ml' ? 'ML Predicted Idle' : 'Total Fleet Idle'}
                </h3>
                <div className="text-3xl font-bold">
                  {idleHours} hours
                </div>
                {predictionMode === 'ml' && (
                  <div className="text-sm text-green-400 flex items-center justify-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" /> 38% reduction predicted
                  </div>
                )}
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {predictionMode === 'actual' ? (
                    <img 
                      src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' stroke='%23FF5A5F' stroke-width='2' d='M3,7 L12,7 L12,12 M12,17 L21,17 M5,3 L19,3 C20.105,3 21,3.895 21,5 L21,7 L3,7 L3,5 C3,3.895 3.895,3 5,3 Z M3,7 L3,19 C3,20.105 3.895,21 5,21 L19,21 C20.105,21 21,20.105 21,19 L21,7'/%3E%3C/svg%3E" 
                      alt="Fuel" 
                      className="w-10 h-10 mb-1"
                    />
                  ) : (
                    <Brain className="w-10 h-10 mb-1 text-blue-400" />
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-1">
                  {predictionMode === 'ml' ? 'ML Predicted Fuel Usage' : 'Fuel Usage'}
                </h3>
                <div className="text-3xl font-bold">
                  {fuelWaste.toFixed(1)} Liters
                </div>
                {predictionMode === 'ml' && (
                  <div className="text-sm text-green-400 flex items-center justify-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" /> 38% reduction predicted
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Brain className="w-10 h-10 mb-1 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-1">
                  Estimated Cost Savings
                </h3>
                <div className="text-3xl font-bold">
                  €{predictionMode === 'ml' ? Math.round((idleCost * 0.38) + (fuelCost * 0.38)) : 0}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  With ML optimization
                </div>
              </div>
            </Card>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h2 className="text-xl font-bold text-blue-800 flex items-center mb-4">
              <Gauge size={20} className="mr-2" /> 
              Performance Insights & Recommendations
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <p className="text-gray-700 mb-2"><strong>Idle Time Cost Impact:</strong></p>
                  <div className="text-4xl font-bold text-blue-700">€{Math.round(idleCost)}</div>
                  <p className="text-sm text-gray-500 mt-1">Based on estimated cost of €25 per idle hour</p>
                </div>
                
                <div>
                  <p className="text-gray-700 mb-2"><strong>Fuel Cost Impact:</strong></p>
                  <div className="text-4xl font-bold text-blue-700">€{Math.round(fuelCost)}</div>
                  <p className="text-sm text-gray-500 mt-1">Based on current fuel price of €1.80 per liter</p>
                </div>
              </div>
              
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-gray-700 mb-3">
                    <strong>Fleet Optimization Recommendations:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Implement idle-reduction strategies to save approximately €{Math.round(idleCost * 0.38)} per {selectedPeriod.toLowerCase()}</li>
                    <li>Optimize route planning to reduce fuel consumption by up to 38%</li>
                    <li>Consider driver training programs focused on fuel-efficient driving</li>
                    <li>Schedule maintenance to improve vehicle efficiency</li>
                  </ul>
                </div>
                
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                  <Gauge className="mr-2" /> Generate Performance Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Forestation;
