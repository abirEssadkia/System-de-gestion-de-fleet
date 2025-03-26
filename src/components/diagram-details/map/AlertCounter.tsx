
import React from 'react';

interface AlertCounterProps {
  count: number;
}

export const AlertCounter: React.FC<AlertCounterProps> = ({ count }) => {
  return (
    <div className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-md shadow-sm text-sm z-[400]">
      {count} alert{count > 1 ? 's' : ''} detected
    </div>
  );
};
