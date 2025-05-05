
import React from 'react';
import { Button } from '@/components/ui/button';
import { Gauge } from 'lucide-react';

interface PerformanceInsightsProps {
  idleCost: number;
  fuelCost: number;
  selectedPeriod: string;
}

export const PerformanceInsights: React.FC<PerformanceInsightsProps> = ({
  idleCost,
  fuelCost,
  selectedPeriod,
}) => {
  return (
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
  );
};
