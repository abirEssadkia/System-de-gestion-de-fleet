
import React from 'react';
import { cn } from '@/lib/utils';

interface DonutChartItemProps {
  label: string;
  value: number;
  color: string;
  percentage: number;
}

interface DonutChartProps {
  items: DonutChartItemProps[];
  className?: string;
}

export const DonutChart = ({ items, className }: DonutChartProps) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center space-x-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span className="text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 relative flex items-center justify-center">
        <svg width="150" height="150" viewBox="0 0 150 150">
          <circle
            cx="75"
            cy="75"
            r="60"
            fill="transparent"
            stroke="#F7F9FC"
            strokeWidth="15"
          />
          
          {items.map((item, index) => {
            const previousPercentages = items
              .slice(0, index)
              .reduce((sum, current) => sum + current.percentage, 0);
              
            return (
              <circle
                key={index}
                cx="75"
                cy="75"
                r="60"
                fill="transparent"
                stroke={item.color}
                strokeWidth="15"
                strokeDasharray={`${(item.percentage * 360) / 100} ${360 - (item.percentage * 360) / 100}`}
                strokeDashoffset={`${90 + (previousPercentages * 360) / 100}`}
                style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
                className="transition-all duration-1000 ease-in-out"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold">{items[0].percentage}%</span>
        </div>
      </div>
    </div>
  );
};
