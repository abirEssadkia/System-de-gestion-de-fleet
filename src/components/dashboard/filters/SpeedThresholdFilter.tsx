
import React from 'react';
import { Gauge } from 'lucide-react';

interface SpeedThresholdFilterProps {
  speedThreshold: string;
  onChange: (value: string) => void;
  notifyChange: () => void;
}

export const SpeedThresholdFilter = ({
  speedThreshold,
  onChange,
  notifyChange
}: SpeedThresholdFilterProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-fleet-dark-gray flex items-center gap-2">
        <Gauge className="w-4 h-4" /> Speed Threshold (km/h)
      </label>
      <input 
        type="number" 
        className="fleet-selector" 
        value={speedThreshold}
        onChange={(e) => {
          onChange(e.target.value);
          notifyChange();
        }}
        placeholder="Enter max speed"
        min="0"
      />
    </div>
  );
};
