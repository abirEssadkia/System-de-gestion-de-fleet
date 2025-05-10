
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { createAlertIcon } from './AlertIcon';
import { Point } from '@/components/map-detail-view/types';

export interface MapMarkersProps {
  points: Point[];
}

export const MapMarkers: React.FC<MapMarkersProps> = ({ points }) => {
  return (
    <>
      {points.map((point, index) => (
        <Marker 
          key={index} 
          position={[point.lat, point.lng]}
          icon={createAlertIcon({ index, pointType: point.type })}
        >
          <Popup>
            {point.description || `Issue at ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`}
          </Popup>
        </Marker>
      ))}
    </>
  );
};
