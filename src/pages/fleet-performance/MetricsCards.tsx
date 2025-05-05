
import React from 'react';
import { Card } from '@/components/ui/card';
import { Brain, TrendingUp } from 'lucide-react';

interface MetricsCardsProps {
  idleHours: number;
  fuelWaste: number;
  predictionMode: 'actual' | 'ml';
  costSavings: number;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({
  idleHours,
  fuelWaste,
  predictionMode,
  costSavings
}) => {
  return (
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
            €{costSavings}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            With ML optimization
          </div>
        </div>
      </Card>
    </div>
  );
};
