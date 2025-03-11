
import React from 'react';
import { MapPin } from 'lucide-react';

interface Point {
  lat: number;
  lng: number;
  description?: string;
}

interface MapViewProps {
  data: Point[];
}

export const MapView: React.FC<MapViewProps> = ({ data }) => {
  return (
    <div className="my-8 w-full h-[400px] mx-auto relative bg-[#f8f9fa] rounded-lg overflow-hidden border border-gray-200">
      {/* Map grid lines */}
      <div className="absolute inset-0" style={{ 
        backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>
      
      {/* Map roads */}
      <div className="absolute left-1/4 top-0 bottom-0 w-[3px] bg-gray-300"></div>
      <div className="absolute right-1/3 top-0 bottom-0 w-[3px] bg-gray-300"></div>
      <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-gray-300"></div>
      <div className="absolute top-1/4 left-0 right-0 h-[3px] bg-gray-300"></div>
      
      {/* Problem points - display one pin for each issue */}
      {data.map((point, index) => {
        // Calculate position based on lat/lng
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
            <MapPin size={36} color="#ea384c" fill="#ea384c" strokeWidth={1.5} className="animate-pulse" />
            <div className="absolute hidden group-hover:block bg-white p-2 rounded shadow-md text-sm -mt-1 ml-5 whitespace-nowrap z-10">
              {point.description || `Issue at ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`}
            </div>
          </div>
        );
      })}
      
      <div className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-md shadow-sm text-sm">
        {data.length} delivery/pickup issue{data.length > 1 ? 's' : ''} detected
      </div>
    </div>
  );
};
