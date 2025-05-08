
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface LineChartViewProps {
  data: number[] | Array<{hour: number, distance: number, id: string}>;
}

export const LineChartView: React.FC<LineChartViewProps> = ({ data }) => {
  // Déterminer si les données sont au format de base de données ou simple tableau de nombres
  const isDbFormat = typeof data === 'object' && data !== null && !Array.isArray(data) && 'hour' in data;
  
  // Transformer les données au format approprié pour Recharts
  const chartData = Array.isArray(data) 
    ? (typeof data[0] === 'number' 
        ? (data as number[]).map((value, index) => ({ name: (index + 1).toString(), value }))
        : (data as Array<{hour: number, distance: number, id: string}>).map(item => ({ 
            name: `${item.hour}h`, 
            value: item.distance 
          })))
    : [{ name: '1', value: 0 }]; // Données par défaut si le format est incorrect

  return (
    <div className="my-8 max-w-4xl mx-auto h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            label={{ value: 'Heure', position: 'insideBottomRight', offset: -10 }}
          />
          <YAxis 
            label={{ value: 'Distance (km)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip formatter={(value) => [`${value} km`, 'Distance']} />
          <Legend verticalAlign="top" height={36} />
          <Line
            name="Distance parcourue"
            type="monotone"
            dataKey="value"
            stroke="#2A6ED2"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
