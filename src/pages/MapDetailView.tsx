
import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, BellDot, AlertCircle, Siren, Fuel, Clock, Map } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToString } from 'react-dom/server';
import { getAlertPointsByType } from '@/utils/alertsData';

interface Point {
  lat: number;
  lng: number;
  description?: string;
  type?: 'speed' | 'fuel' | 'activity' | 'geofence' | 'time';
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
  const [alertType, setAlertType] = useState<'speed' | 'fuel' | 'activity' | 'geofence' | 'time' | 'all'>('all');
  const navigate = useNavigate();
  
  useEffect(() => {
    const title = searchParams.get('title');
    const dataString = searchParams.get('data');
    const typeParam = searchParams.get('type') as 'speed' | 'fuel' | 'activity' | 'geofence' | 'time' | 'all' || 'all';
    
    setAlertType(typeParam);
    
    if (title) {
      setTitle(title);
    }
    
    if (dataString) {
      try {
        const data = JSON.parse(dataString);
        if (Array.isArray(data) && data.length > 0) {
          setMapPoints(data);
        } else {
          // If no valid data, use the alert data
          setMapPoints(getAlertPointsByType(typeParam));
        }
      } catch (error) {
        console.error('Error parsing map data', error);
        // Fallback to alert data
        setMapPoints(getAlertPointsByType(typeParam));
      }
    } else {
      // If no data parameter, use the alert data
      setMapPoints(getAlertPointsByType(typeParam));
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
  const createAlertIcon = (index: number, pointType?: string) => {
    // For detailed view, use larger icons
    let iconType: string;
    
    // If the point has a specific type, use it, otherwise use a cycling pattern
    if (pointType) {
      iconType = pointType;
    } else {
      iconType = ['speed', 'fuel', 'activity', 'geofence', 'time'][index % 5] || 'speed';
    }
    
    let iconHtml;
    
    switch(iconType) {
      case 'speed':
        iconHtml = renderToString(<AlertTriangle className="h-10 w-10 text-red-500 fill-red-100" />);
        break;
      case 'fuel':
        iconHtml = renderToString(<Fuel className="h-10 w-10 text-amber-500 fill-amber-100" />);
        break;
      case 'activity':
        iconHtml = renderToString(<Clock className="h-10 w-10 text-orange-500 fill-orange-100" />);
        break;
      case 'geofence':
        iconHtml = renderToString(<Map className="h-10 w-10 text-violet-500 fill-violet-100" />);
        break;
      case 'time':
        iconHtml = renderToString(<Clock className="h-10 w-10 text-blue-500 fill-blue-100" />);
        break;
      default:
        iconHtml = renderToString(<AlertCircle className="h-10 w-10 text-red-500 fill-red-100" />);
    }
    
    return L.divIcon({
      html: iconHtml,
      className: 'custom-alert-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
  };

  // Get the right icon component based on alert type
  const getIconComponent = (type: string) => {
    switch(type) {
      case 'speed':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'fuel':
        return <Fuel className="w-5 h-5 text-amber-500" />;
      case 'activity':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'geofence':
        return <Map className="w-5 h-5 text-violet-500" />;
      case 'time':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
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
        
        <h1 className="text-2xl font-bold text-fleet-navy mb-2">{title || 'Alert Map'}</h1>
        <p className="text-fleet-dark-gray mb-6">
          Detailed view of alerts {alertType !== 'all' ? `of type ${alertType}` : ''} on the map
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
                  icon={createAlertIcon(index, point.type)}
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
                <h3 className="text-lg font-medium mb-2">Alert Summary</h3>
                <p className="text-fleet-dark-gray">
                  This map shows all {alertType !== 'all' ? `${alertType} ` : ''}alerts. 
                  Each marker represents a location where an alert was generated. 
                  Click on markers to see detailed information about each alert.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Alert List</h3>
                <ul className="space-y-2 text-fleet-dark-gray">
                  {mapPoints.map((point, index) => {
                    const pointType = point.type || ['speed', 'fuel', 'activity', 'geofence', 'time'][index % 5] || 'speed';
                    return (
                      <li key={index} className="flex items-start">
                        {getIconComponent(pointType)}
                        <span className="ml-2">{point.description || `Alert at ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`}</span>
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
