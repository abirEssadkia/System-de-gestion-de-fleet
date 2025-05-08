
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
  value: number;
  size?: number;
  color?: string;
  bgColor?: string;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

export const CircularProgress = ({
  value,
  size = 120,
  color = '#2A6ED2',
  bgColor = '#E5E7EB',
  strokeWidth = 10,
  className,
  children,
}: CircularProgressProps) => {
  const [progress, setProgress] = useState(0);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    // Animation du démarrage
    setTimeout(() => {
      if (mounted.current) {
        setProgress(value);
      }
    }, 300);

    return () => {
      mounted.current = false;
    };
  }, [value]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        {/* Cercle de fond */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Cercle de progression */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      
      {/* Contenu au centre */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
