
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
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
  displayTotal?: boolean;
  totalLabel?: string;
  innerRadius?: number;
  outerRadius?: number;
}

export const DonutChart = ({ 
  items, 
  className, 
  displayTotal = true, 
  totalLabel = "Assets", 
  innerRadius = 60, 
  outerRadius = 80 
}: DonutChartProps) => {
  // Calculer le total pour l'afficher au centre
  const total = items.reduce((sum, item) => sum + item.value, 0);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    return null; // Pas de labels sur le diagramme pour éviter l'encombrement
  };
  
  return (
    <div className={cn("flex flex-col", className)}>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={items}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
          >
            {items.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any, name: any, props: any) => [`${value} (${props.payload.percentage}%)`, props.payload.label]}
          />
          {displayTotal && (
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
              <tspan x="50%" dy="-0.5em" fontSize="16" fontWeight="bold">
                {total}
              </tspan>
              <tspan x="50%" dy="1.5em" fontSize="12" fill="#666">
                {totalLabel}
              </tspan>
            </text>
          )}
        </PieChart>
      </ResponsiveContainer>
      
      <div className="space-y-2 mt-4">
        {items.map((status, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: status.color }}
              ></div>
              <span className="text-sm">{status.label}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{status.value}</span>
              <span className="text-xs text-gray-500">({status.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
