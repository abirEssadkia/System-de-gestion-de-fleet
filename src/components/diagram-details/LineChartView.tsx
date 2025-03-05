
import React from 'react';
import { LineChart } from '@/components/dashboard/LineChart';

interface LineChartViewProps {
  data: number[];
}

export const LineChartView: React.FC<LineChartViewProps> = ({ data }) => {
  return (
    <div className="my-8 max-w-4xl mx-auto h-80">
      <LineChart 
        data={data}
        labels={Array.from({ length: data.length }, (_, i) => (i + 1).toString())}
        height={300}
      />
    </div>
  );
};
