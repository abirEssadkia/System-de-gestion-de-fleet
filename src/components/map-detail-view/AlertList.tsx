
import React from 'react';
import { AlertIcon } from './AlertIcon';
import { Point } from './types';

interface AlertListProps {
  points: Point[];
}

export const AlertList: React.FC<AlertListProps> = ({ points }) => {
  if (points.length === 0) {
    return <p className="text-fleet-dark-gray">No alerts found with the selected filters.</p>;
  }
  
  return (
    <ul className="space-y-2 text-fleet-dark-gray max-h-60 overflow-y-auto">
      {points.map((point, index) => {
        const pointType = point.type || ['speed', 'fuel', 'activity', 'geofence', 'time'][index % 5] || 'speed';
        return (
          <li key={index} className="flex items-start">
            <AlertIcon type={pointType} />
            <span className="ml-2">
              {point.description || `Alert at ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`}
            </span>
          </li>
        );
      })}
    </ul>
  );
};
