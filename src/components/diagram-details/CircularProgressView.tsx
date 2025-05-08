
import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface CircularProgressViewProps {
  data: number;
}

export const CircularProgressView: React.FC<CircularProgressViewProps> = ({ data }) => {
  // S'assurer que la valeur est un nombre entre 0 et 100
  const value = typeof data === 'number' ? Math.min(Math.max(data, 0), 100) : 0;
  
  return (
    <div className="flex justify-center my-8">
      <div className="w-64">
        <CircularProgressbar
          value={value}
          text={`${value}%`}
          styles={buildStyles({
            rotation: 0.25,
            strokeLinecap: 'round',
            textSize: '16px',
            pathTransitionDuration: 0.5,
            pathColor: `#2A6ED2`,
            textColor: '#333333',
            trailColor: '#e6e6e6',
          })}
        />
        
        <div className="mt-8 text-center">
          <h3 className="text-xl font-semibold">Fleet Utilization</h3>
          <p className="text-gray-600 mt-2">
            This metric represents how effectively your fleet is being utilized. A higher percentage indicates better resource management.
          </p>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md">
            <h4 className="font-medium text-blue-800">Performance Insights:</h4>
            <ul className="list-disc list-inside text-sm mt-2 text-blue-700">
              <li>Current utilization is at {value}%</li>
              <li>Industry average is around 65%</li>
              {value < 65 && (
                <li>Consider optimizing vehicle scheduling to improve utilization</li>
              )}
              {value >= 65 && value < 80 && (
                <li>Good utilization rate, maintain current operations</li>
              )}
              {value >= 80 && (
                <li>Excellent utilization! Consider if fleet expansion may be needed</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
