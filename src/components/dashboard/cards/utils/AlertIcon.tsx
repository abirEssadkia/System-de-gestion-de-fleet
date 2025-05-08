
import React from 'react';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { AlertTriangle, AlertCircle, Fuel, Clock, Map } from 'lucide-react';

interface AlertIconProps {
  index: number;
  pointType?: string;
}

export const createAlertIcon = ({ index, pointType }: AlertIconProps) => {
  // For dashboard maps, use smaller icons
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
      iconHtml = renderToString(<AlertTriangle className="h-6 w-6 text-red-500 fill-red-100" />);
      break;
    case 'fuel':
      iconHtml = renderToString(<Fuel className="h-6 w-6 text-amber-500 fill-amber-100" />);
      break;
    case 'activity':
      iconHtml = renderToString(<Clock className="h-6 w-6 text-orange-500 fill-orange-100" />);
      break;
    case 'geofence':
      iconHtml = renderToString(<Map className="h-6 w-6 text-violet-500 fill-violet-100" />);
      break;
    case 'time':
      iconHtml = renderToString(<Clock className="h-6 w-6 text-blue-500 fill-blue-100" />);
      break;
    default:
      iconHtml = renderToString(<AlertCircle className="h-6 w-6 text-red-500 fill-red-100" />);
  }
  
  return L.divIcon({
    html: iconHtml,
    className: 'custom-alert-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });
};
