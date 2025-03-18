
import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

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

  // Calculate map center based on average of point coordinates
  const getMapCenter = useMemo((): [number, number] => {
    if (mapPoints.length === 0) return [31.7917, -7.0926]; // Default center of Morocco

    const sumLat = mapPoints.reduce((sum, point) => sum + point.lat, 0);
    const sumLng = mapPoints.reduce((sum, point) => sum + point.lng, 0);
    
    return [sumLat / mapPoints.length, sumLng / mapPoints.length];
  }, [mapPoints]);

  // Calculate appropriate zoom level based on the spread of points
  const getBoundsZoom = useMemo(() => {
    if (mapPoints.length <= 1) return 15; // Higher zoom for single point
    
    // Find min/max coordinates to establish bounds
    const lats = mapPoints.map(point => point.lat);
    const lngs = mapPoints.map(point => point.lng);
    
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    // Calculate distance between furthest points
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    
    // Updated zoom logic to get closer to the region
    if (latDiff > 0.1 || lngDiff > 0.1) return 13;
    if (latDiff > 0.05 || lngDiff > 0.05) return 14;
    if (latDiff > 0.01 || lngDiff > 0.01) return 15;
    return 16; // Much closer zoom for very nearby points
  }, [mapPoints]);

  const customMarkerIcon = new L.Icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
  
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
          <div className="w-full h-[600px] mx-auto relative rounded-lg overflow-hidden border border-gray-200">
            <MapContainer 
              center={getMapCenter} 
              zoom={getBoundsZoom} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {mapPoints.map((point, index) => (
                <Marker 
                  key={index} 
                  position={[point.lat, point.lng]}
                  icon={customMarkerIcon}
                >
                  <Popup>
                    {point.description || `Issue at ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          
          {/* Location Details */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            <h2 className="text-xl font-semibold mb-4">Location Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Issue Summary</h3>
                <p className="text-fleet-dark-gray">
                  This map shows all delivery and pickup issues in {title}. Each marker represents a location 
                  where a problem was encountered. Click on markers to see detailed information about each issue.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Issue List</h3>
                <ul className="space-y-2 text-fleet-dark-gray">
                  {mapPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-4 h-4 bg-blue-500 rounded-full mt-1 mr-2 flex-shrink-0"></span>
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
