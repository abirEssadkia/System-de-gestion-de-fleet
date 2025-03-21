
import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, BellDot, AlertCircle, Siren } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToString } from 'react-dom/server';

interface Point {
  lat: number;
  lng: number;
  description?: string;
}

// Component to set bounds of map to include all markers
const SetBoundsToMarkers = ({ points }: { points: Point[] }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (points.length > 0) {
      // Create an array of LatLng objects
      const latLngs = points.map(point => L.latLng(point.lat, point.lng));
      
      // Create a bounds object
      const bounds = L.latLngBounds(latLngs);
      
      // Fit the map to these bounds with some padding
      map.fitBounds(bounds, { 
        padding: [50, 50],
        maxZoom: 16 // Limit max zoom level
      });
    }
  }, [map, points]);
  
  return null;
};

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

  // Generate different alert icons for variety
  const createAlertIcon = (index: number) => {
    // For detailed view, use larger icons
    const iconType = index % 4;
    let iconHtml;
    
    switch(iconType) {
      case 0:
        iconHtml = renderToString(<AlertTriangle className="h-10 w-10 text-red-500 fill-red-100" />);
        break;
      case 1:
        iconHtml = renderToString(<AlertCircle className="h-10 w-10 text-amber-500 fill-amber-100" />);
        break;
      case 2:
        iconHtml = renderToString(<BellDot className="h-10 w-10 text-orange-500 fill-orange-100" />);
        break;
      case 3:
        iconHtml = renderToString(<Siren className="h-10 w-10 text-red-600 fill-red-100" />);
        break;
      default:
        iconHtml = renderToString(<AlertTriangle className="h-10 w-10 text-red-500 fill-red-100" />);
    }
    
    return L.divIcon({
      html: iconHtml,
      className: 'custom-alert-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
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
                  icon={createAlertIcon(index)}
                >
                  <Popup>
                    {point.description || `Issue at ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`}
                  </Popup>
                </Marker>
              ))}
              
              {/* Add component to automatically set bounds */}
              <SetBoundsToMarkers points={mapPoints} />
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
                  {mapPoints.map((point, index) => {
                    // Use same alert icon styles for consistency in the list
                    const iconType = index % 4;
                    let IconComponent;
                    let iconColor;
                    
                    switch(iconType) {
                      case 0:
                        IconComponent = AlertTriangle;
                        iconColor = "text-red-500";
                        break;
                      case 1:
                        IconComponent = AlertCircle;
                        iconColor = "text-amber-500";
                        break;
                      case 2:
                        IconComponent = BellDot;
                        iconColor = "text-orange-500";
                        break;
                      case 3:
                        IconComponent = Siren;
                        iconColor = "text-red-600";
                        break;
                      default:
                        IconComponent = AlertTriangle;
                        iconColor = "text-red-500";
                    }
                    
                    return (
                      <li key={index} className="flex items-start">
                        <IconComponent className={`w-5 h-5 mt-0.5 mr-2 flex-shrink-0 ${iconColor}`} />
                        <span>{point.description || `Issue at ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`}</span>
                      </li>
                    );
                  })}
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
