
import React from 'react';
import { cn } from '@/lib/utils';

export interface DonutChartItem {
  name: string;
  value: number;
  color: string;
}

export interface DonutChartProps {
  items: DonutChartItem[];
  className?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({ items, className }) => {
  const total = items.reduce((acc, item) => acc + item.value, 0);
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className={cn('relative', className)}>
      <svg className="w-full h-full" viewBox="0 0 42 42">
        <circle className="text-gray-100" strokeWidth="4" stroke="currentColor" fill="transparent" r={radius} cx="21" cy="21" />
        
        {items.map((item, index) => {
          const percentage = total > 0 ? item.value / total : 0;
          const strokeDasharray = `${circumference * percentage} ${circumference * (1 - percentage)}`;
          const currentOffset = offset;
          offset += percentage;
          
          const strokeDashoffset = circumference * (1 - currentOffset);
          
          return (
            <circle
              key={index}
              className="stroke-current transition-all duration-500"
              strokeWidth="4"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke={item.color}
              fill="transparent"
              r={radius}
              cx="21"
              cy="21"
              style={{
                transformOrigin: '50% 50%',
                transform: 'rotate(-90deg)',
                transition: 'stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease'
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};
