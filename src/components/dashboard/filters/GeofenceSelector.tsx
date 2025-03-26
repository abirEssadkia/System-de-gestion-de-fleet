
import React from 'react';
import { MapPin } from 'lucide-react';
import { Selector } from '../Selector';

interface GeofenceSelectorProps {
  zones: string[];
  selectedZone: string;
  onChange: (value: string) => void;
  notifyChange: () => void;
}

export const GeofenceSelector = ({
  zones,
  selectedZone,
  onChange,
  notifyChange
}: GeofenceSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-fleet-dark-gray flex items-center gap-2">
        <MapPin className="w-4 h-4" /> Geofencing Zones
      </label>
      <Selector 
        label="Zones" 
        options={zones}
        value={selectedZone}
        onChange={(value) => {
          onChange(value);
          notifyChange();
        }}
        placeholder="Select zone"
      />
    </div>
  );
};
