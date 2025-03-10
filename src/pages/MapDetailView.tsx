
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft } from 'lucide-react';

interface Point {
  lat: number;
  lng: number;
  description?: string;
}

const MapDetailView = () => {
  const [searchParams] = useSearchParams();
  const [mapPoints, setMapPoints] = useState<Point[]>([]);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const title = searchParams.get('title');
    const dataString = searchParams.get('data');
    
    if (title && dataString) {
      try {
        const data = JSON.parse(dataString);
        setMapPoints(data);
        setTitle(title);
      } catch (error) {
        console.error('Error parsing map data', error);
      }
    }
  }, [searchParams]);

  const handleGoBack = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-fleet-gray p-6">
      <div className="container mx-auto">
        <button 
          onClick={handleGoBack}
          className="flex items-center text-fleet-navy hover:text-fleet-blue mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>
        
        <h1 className="text-2xl font-bold text-fleet-navy mb-2">{title} Delivery Issues</h1>
        <p className="text-fleet-dark-gray mb-6">
          Detailed view of delivery and pickup issues in {title}
        </p>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          {/* Large Map View */}
          <div className="w-full h-[600px] mx-auto relative bg-[#f8f9fa] rounded-lg overflow-hidden border border-gray-200">
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
            
            {/* Problem points */}
            {mapPoints.map((point, index) => {
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
              {mapPoints.length} delivery/pickup issue{mapPoints.length !== 1 ? 's' : ''} detected
            </div>
          </div>
          
          {/* Location Details */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            <h2 className="text-xl font-semibold mb-4">Location Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Issue Summary</h3>
                <p className="text-fleet-dark-gray">
                  This map shows all delivery and pickup issues in {title}. Each pin represents a location 
                  where a problem was encountered. Hover over the pins to see detailed information about each issue.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Issue List</h3>
                <ul className="space-y-2 text-fleet-dark-gray">
                  {mapPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <MapPin className="w-4 h-4 text-red-500 mt-1 mr-2 flex-shrink-0" />
                      <span>{point.description || `Issue at ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapDetailView;
