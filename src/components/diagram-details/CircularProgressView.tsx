
import React from 'react';
import { CircularProgress } from '@/components/dashboard/CircularProgress';

interface CircularProgressViewProps {
  data: number;
}

export const CircularProgressView: React.FC<CircularProgressViewProps> = ({ data }) => {
  return (
    <div className="flex justify-center my-8">
      <CircularProgress 
        value={typeof data === 'number' ? data : 0} 
        size={200}
        color="#2A6ED2"
      >
        <div className="text-center">
          <div className="text-4xl font-bold">{data}</div>
        </div>
      </CircularProgress>
    </div>
  );
};
