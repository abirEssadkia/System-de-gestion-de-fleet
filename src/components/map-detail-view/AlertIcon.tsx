
import React from 'react';
import { AlertTriangle, AlertCircle, Fuel, Clock, Map } from 'lucide-react';

interface AlertIconProps {
  type: string;
}

export const AlertIcon: React.FC<AlertIconProps> = ({ type }) => {
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

export const getAlertTypeName = (type: string) => {
  switch(type) {
    case 'speed': return 'Speed';
    case 'fuel': return 'Fuel';
    case 'activity': return 'Activity';
    case 'geofence': return 'Geofence';
    case 'time': return 'Drive Time';
    default: return 'All Types';
  }
};
