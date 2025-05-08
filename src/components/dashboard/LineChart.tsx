
import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';

interface LineChartProps {
  data: number[] | Array<{hour: number, distance: number}>;
  labels?: string[];
  height?: number;
  width?: string;
  color?: string;
  fillColor?: string;
  className?: string;
  isFromDatabase?: boolean;
}

export const LineChart = ({
  data,
  labels,
  height = 140,
  width = '100%',
  color = '#2A6ED2',
  fillColor = 'rgba(42, 110, 210, 0.1)',
  className,
  isFromDatabase = false,
}: LineChartProps) => {
  // Transformer les données si nécessaire
  const chartData = isFromDatabase 
    ? (data as Array<{hour: number, distance: number}>).map(item => ({ 
        name: `${item.hour}h`, 
        value: item.distance 
      }))
    : (data as number[]).map((value, index) => ({ 
        name: labels ? labels[index] : `${index + 1}`, 
        value 
      }));

  return (
    <div className={cn("w-full", className)} style={{ width, height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={chartData}
          margin={{
            top: 5,
            right: 20,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            fontSize={10}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis 
            fontSize={10}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip formatter={(value) => [`${value}`, 'Valeur']} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 3, stroke: color, fill: 'white', strokeWidth: 2 }}
            activeDot={{ r: 5 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};
