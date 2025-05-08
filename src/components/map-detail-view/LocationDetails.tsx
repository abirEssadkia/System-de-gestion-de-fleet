
import React from 'react';
import { Point } from './types';
import { AlertList } from './AlertList';

interface LocationDetailsProps {
  mapPoints: Point[];
  alertType: string;
}

export const LocationDetails: React.FC<LocationDetailsProps> = ({ mapPoints, alertType }) => {
  return (
    <div className="mt-8 border-t border-gray-100 pt-6">
      <h2 className="text-xl font-semibold mb-4">Location Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Alert Summary</h3>
          <p className="text-fleet-dark-gray">
            This map shows {mapPoints.length} {alertType !== 'all' ? `${alertType} ` : ''}alerts. 
            Each marker represents a location where an alert was generated. 
            Click on markers to see detailed information about each alert.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Alert List</h3>
          <AlertList points={mapPoints} />
        </div>
      </div>
    </div>
  );
};
