
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
  chartType?: string; // Pour supporter les différents types de graphiques
}

export const DonutChart: React.FC<DonutChartProps> = ({ items, className, chartType = 'donut' }) => {
  const total = items.reduce((acc, item) => acc + item.value, 0);
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  // Si aucun élément, retourner un cercle vide
  if (items.length === 0) {
    return (
      <div className={cn('relative', className)}>
        <svg className="w-full h-full" viewBox="0 0 42 42">
          <circle 
            cx="21" 
            cy="21" 
            r={radius} 
            fill="transparent" 
            stroke="#f1f1f1" 
            strokeWidth="8"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <svg className="w-full h-full" viewBox="0 0 42 42">
        {/* Background circle */}
        <circle 
          cx="21" 
          cy="21" 
          r={radius} 
          fill="transparent" 
          stroke="#f1f1f1" 
          strokeWidth="8"
        />
        
        {/* Colored segments */}
        {items.map((item, index) => {
          const percentage = total > 0 ? item.value / total : 0;
          const strokeDasharray = `${circumference * percentage} ${circumference * (1 - percentage)}`;
          const currentOffset = offset;
          offset += percentage;
          
          const strokeDashoffset = circumference * (1 - currentOffset);
          
          return (
            <circle
              key={index}
              cx="21"
              cy="21"
              r={radius}
              fill="transparent"
              stroke={item.color}
              strokeWidth="8"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transformOrigin: '50% 50%',
                transform: 'rotate(-90deg)',
                transition: 'stroke-dasharray 0.8s ease, stroke-dashoffset 0.8s ease'
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};
