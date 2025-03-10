
import React from 'react';
import { DashboardCard, DashboardCardTitle } from '@/components/dashboard/DashboardCard';
import { MapPin } from 'lucide-react';

interface Point {
  lat: number;
  lng: number;
}

interface DeliveryMapProps {
  title: string;
  points: Point[];
}

export const DeliveryMap: React.FC<DeliveryMapProps> = ({ title, points }) => {
  return (
    <DashboardCard className="col-span-1 min-h-[200px]">
      <DashboardCardTitle>{title}</DashboardCardTitle>
      
      <div className="relative h-[150px] bg-gray-100 rounded-lg mt-2">
        {/* Simplified map representation */}
        <div className="absolute inset-0 bg-[#f8f9fa] rounded-lg overflow-hidden">
          {/* Map grid lines */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
          
          {/* Map roads */}
          <div className="absolute left-1/4 top-0 bottom-0 w-[2px] bg-gray-300"></div>
          <div className="absolute right-1/3 top-0 bottom-0 w-[2px] bg-gray-300"></div>
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-300"></div>
          <div className="absolute top-1/4 left-0 right-0 h-[2px] bg-gray-300"></div>
          
          {/* Problem points */}
          {points.map((point, index) => {
            // Calculate position based on lat/lng (simplified for visual purposes)
            const left = ((point.lng + 180) / 360) * 100;
            const top = ((90 - point.lat) / 180) * 100;
            
            return (
              <div 
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ 
                  left: `${left}%`,
                  top: `${top}%`
                }}
              >
                <MapPin size={24} color="#ea384c" fill="#ea384c" strokeWidth={1.5} className="animate-pulse" />
                <div className="absolute hidden group-hover:block bg-white p-1 rounded shadow-md text-xs -mt-1 ml-3 whitespace-nowrap z-10">
                  Issue at {point.lat.toFixed(2)}, {point.lng.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="absolute bottom-2 right-2 bg-white/80 px-2 py-1 rounded text-xs text-gray-500">
          {points.length} issue{points.length > 1 ? 's' : ''} detected
        </div>
      </div>
    </DashboardCard>
  );
};
