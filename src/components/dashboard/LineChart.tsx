
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface LineChartProps {
  data: number[];
  labels: string[];
  height?: number;
  width?: string;
  color?: string;
  fillColor?: string;
  className?: string;
}

export const LineChart = ({
  data,
  labels,
  height = 140,
  width = '100%',
  color = '#2A6ED2',
  fillColor = 'rgba(42, 110, 210, 0.1)',
  className,
}: LineChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (data.length < 2) return;
    
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;
    
    // Find min and max values
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    
    // Calculate scales
    const xScale = chartWidth / (data.length - 1);
    const yScale = chartHeight / (maxValue - minValue || 1);
    
    // Draw y-axis grid lines
    ctx.beginPath();
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    
    const gridCount = 5;
    for (let i = 0; i <= gridCount; i++) {
      const y = padding.top + chartHeight - (i / gridCount) * chartHeight;
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();
    }
    
    // Draw axis labels
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#6B7280';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= gridCount; i++) {
      const value = minValue + (i / gridCount) * (maxValue - minValue);
      const y = padding.top + chartHeight - (i / gridCount) * chartHeight;
      ctx.fillText(Math.round(value).toString(), padding.left - 5, y + 3);
    }
    
    // Draw x-axis labels
    ctx.textAlign = 'center';
    const labelStep = Math.ceil(data.length / 6);
    
    for (let i = 0; i < data.length; i += labelStep) {
      const x = padding.left + i * xScale;
      ctx.fillText(labels[i], x, canvas.height - padding.bottom + 15);
    }
    
    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    
    data.forEach((value, index) => {
      const x = padding.left + index * xScale;
      const y = padding.top + chartHeight - (value - minValue) * yScale;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw fill
    ctx.lineTo(padding.left + (data.length - 1) * xScale, padding.top + chartHeight);
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    
    // Draw data points
    data.forEach((value, index) => {
      const x = padding.left + index * xScale;
      const y = padding.top + chartHeight - (value - minValue) * yScale;
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
    
  }, [data, labels, height, color, fillColor]);
  
  return (
    <div className={cn("w-full", className)} style={{ width }}>
      <canvas ref={canvasRef} className="w-full" height={height} />
    </div>
  );
};
