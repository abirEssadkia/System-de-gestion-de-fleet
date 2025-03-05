
import React from 'react';
import { DonutChart } from '@/components/dashboard/DonutChart';

interface DonutChartViewProps {
  data: any;
}

export const DonutChartView: React.FC<DonutChartViewProps> = ({ data }) => {
  return (
    <div className="flex justify-center my-8">
      <div className="w-64 h-64 relative">
        <DonutChart 
          items={data}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};
