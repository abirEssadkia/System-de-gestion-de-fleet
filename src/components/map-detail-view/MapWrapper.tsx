
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Point } from './types';
import { SetBoundsToMarkers } from './SetBoundsToMarkers';
import { AlertMarker } from './AlertMarker';

interface MapWrapperProps {
  mapPoints: Point[];
  center: [number, number];
  zoom: number;
}

export const MapWrapper: React.FC<MapWrapperProps> = ({ 
  mapPoints,
  center,
  zoom
}) => {
  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {mapPoints.map((point, index) => (
        <AlertMarker key={index} point={point} index={index} />
      ))}
      
      {/* Add component to automatically set bounds */}
      <SetBoundsToMarkers points={mapPoints} />
    </MapContainer>
  );
};
