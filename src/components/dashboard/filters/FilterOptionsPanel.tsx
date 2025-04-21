
import React from 'react';
import { DateRangeSelector } from './DateRangeSelector';
import { VehicleSelector } from './VehicleSelector';
import { SpeedThresholdFilter } from './SpeedThresholdFilter';

interface FilterOptionsPanelProps {
  startDate?: Date;
  endDate?: Date;
  setStartDate: (d?: Date) => void;
  setEndDate: (d?: Date) => void;
  selectedVehicles: string[];
  setSelectedVehicles: (vehicles: string[]) => void;
  vehicles: string[];
  speedThreshold: string;
  setSpeedThreshold: (t: string) => void;
  notifyFilterChange: () => void;
}

export const FilterOptionsPanel = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  selectedVehicles,
  setSelectedVehicles,
  vehicles,
  speedThreshold,
  setSpeedThreshold,
  notifyFilterChange,
}: FilterOptionsPanelProps) => (
  <div className="space-y-4">
    <h4 className="font-medium text-fleet-navy flex items-center gap-2">
      <span className="w-4 h-4" /> Filter Options
    </h4>
    <DateRangeSelector
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={(d) => {
        setStartDate(d);
        if (d) notifyFilterChange();
      }}
      onEndDateChange={(d) => {
        setEndDate(d);
        if (d) notifyFilterChange();
      }}
    />
    <VehicleSelector
      vehicles={vehicles}
      selectedVehicles={selectedVehicles}
      setSelectedVehicles={setSelectedVehicles}
      notifyChange={notifyFilterChange}
    />
    <SpeedThresholdFilter
      speedThreshold={speedThreshold}
      onChange={setSpeedThreshold}
      notifyChange={notifyFilterChange}
    />
  </div>
);
