
import React from 'react';
import { Car } from 'lucide-react';
import { Selector } from '../Selector';
import { useQuery } from '@tanstack/react-query';
import { getVehicles } from '@/services/fleetService';

interface VehicleSelectorProps {
  selectedVehicles: string[];
  setSelectedVehicles: (vehicles: string[]) => void;
  notifyChange: () => void;
}

export const VehicleSelector = ({
  selectedVehicles,
  setSelectedVehicles,
  notifyChange
}: VehicleSelectorProps) => {
  // Fetch real vehicle data
  const { data: vehiclesData = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicles,
  });
  
  // Transform vehicles into options format
  const vehicles = vehiclesData.map(v => `${v.model} (${v.licensePlate})`);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-fleet-dark-gray flex items-center gap-2">
        <Car className="w-4 h-4" /> Vehicle Selection
      </label>
      <Selector 
        label="Vehicles" 
        options={vehicles}
        placeholder="Select vehicles"
        onChange={(value) => {
          if (value && !selectedVehicles.includes(value)) {
            const newSelectedVehicles = [...selectedVehicles, value];
            setSelectedVehicles(newSelectedVehicles);
            notifyChange();
          }
        }}
      />
      {selectedVehicles.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedVehicles.map((vehicle, index) => (
            <div key={index} className="bg-fleet-blue/10 text-fleet-blue px-2 py-1 rounded-md text-xs flex items-center">
              {vehicle}
              <button 
                className="ml-1 text-fleet-blue/70 hover:text-fleet-blue"
                onClick={() => {
                  const newSelectedVehicles = selectedVehicles.filter(v => v !== vehicle);
                  setSelectedVehicles(newSelectedVehicles);
                  notifyChange();
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
