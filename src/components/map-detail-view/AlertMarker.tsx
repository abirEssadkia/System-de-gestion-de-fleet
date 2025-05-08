
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { AlertTriangle, AlertCircle, Fuel, Clock, Map } from 'lucide-react';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { Point } from './types';

interface AlertMarkerProps {
  point: Point;
  index: number;
}

export const AlertMarker: React.FC<AlertMarkerProps> = ({ point, index }) => {
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

  return (
    <Marker 
      key={index}
      position={[point.lat, point.lng]}
      icon={createAlertIcon(index, point.type)}
    >
      <Popup>
        {point.description || `Issue at ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`}
      </Popup>
    </Marker>
  );
};
