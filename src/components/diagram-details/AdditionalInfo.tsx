
import React from 'react';

interface AdditionalInfoProps {
  title: string;
  data: any;
}

export const AdditionalInfo: React.FC<AdditionalInfoProps> = ({ title, data }) => {
  return (
    <div className="mt-8 border-t border-gray-100 pt-6">
      <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Chart Details</h3>
          <p className="text-fleet-dark-gray">
            This visualization helps you analyze {title.toLowerCase()} data at a glance.
            Use this information to make informed decisions about your fleet management strategy.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Related Metrics</h3>
          <ul className="list-disc pl-5 text-fleet-dark-gray">
            <li>Total vehicles affected: {Array.isArray(data) ? data.length : 1}</li>
            <li>Last updated: {new Date().toLocaleString()}</li>
            <li>Data source: Fleet Management System</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
