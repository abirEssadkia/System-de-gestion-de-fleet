
import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface DiagramDetails {
  title: string;
  type: 'donut' | 'line' | 'bar' | 'progress';
  data: any;
  description?: string;
}

interface DiagramDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  details: DiagramDetails | null;
  className?: string;
}

export const DiagramDetailsPopup: React.FC<DiagramDetailsPopupProps> = ({
  isOpen,
  onClose,
  details,
  className,
}) => {
  if (!isOpen || !details) return null;

  const renderDetailContent = () => {
    switch (details.type) {
      case 'donut':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Status Distribution</h3>
            <div className="grid grid-cols-2 gap-4">
              {Array.isArray(details.data) && details.data.map((item: any, index: number) => (
                <div key={index} className="bg-white/5 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-lg font-bold">{item.value}</div>
                    <div className="text-sm text-gray-400">({item.percentage}%)</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-white/5 rounded-lg">
              <h4 className="font-medium mb-2">Insights</h4>
              <p className="text-sm text-gray-300">
                {details.description || `${details.title} shows the current distribution of your fleet. 
                Most of your vehicles are currently in "Running" state, which indicates good fleet utilization.`}
              </p>
            </div>
          </div>
        );

      case 'line':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Trend Analysis</h3>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <span>Highest value:</span>
                  <span className="font-bold">{Math.max(...(Array.isArray(details.data) ? details.data : [0]))} km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Lowest value:</span>
                  <span className="font-bold">{Math.min(...(Array.isArray(details.data) ? details.data : [0]))} km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average:</span>
                  <span className="font-bold">
                    {Array.isArray(details.data) 
                      ? Math.round(details.data.reduce((a, b) => a + b, 0) / details.data.length) 
                      : 0} km
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-white/5 rounded-lg">
              <h4 className="font-medium mb-2">Insights</h4>
              <p className="text-sm text-gray-300">
                {details.description || `${details.title} shows the trend over time. 
                There's a noticeable peak in the middle of the period, which might indicate increased activity or longer routes.`}
              </p>
            </div>
          </div>
        );

      case 'progress':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Utilization Details</h3>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span>Current utilization:</span>
                <span className="font-bold">{details.data}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${details.data}%` }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-sm text-gray-400">Target</div>
                <div className="text-lg font-bold">85%</div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-sm text-gray-400">Industry Avg</div>
                <div className="text-lg font-bold">72%</div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-white/5 rounded-lg">
              <h4 className="font-medium mb-2">Insights</h4>
              <p className="text-sm text-gray-300">
                {details.description || `${details.title} is currently at ${details.data}%, which is 
                ${details.data >= 85 ? 'above' : 'below'} the target of 85% and 
                ${details.data >= 72 ? 'above' : 'below'} the industry average of 72%.`}
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-white/5 rounded-lg">
            <p>No detailed information available for this diagram.</p>
          </div>
        );
    }
  };

  return (
    <div className={cn(
      "fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in",
      className
    )}>
      <div 
        className="bg-fleet-gray-dark border border-gray-700 rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">{details.title}</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          {renderDetailContent()}
        </div>
      </div>
    </div>
  );
};
