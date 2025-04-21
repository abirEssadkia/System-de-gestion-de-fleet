
import React from 'react';
import { MapPin } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      <Select 
        value={selectedZone} 
        onValueChange={(value) => {
          onChange(value);
          // We don't need to call notifyChange because onChange already notifies
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a zone" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all_locations">All Locations</SelectItem>
          {zones.map((zone) => (
            <SelectItem key={zone} value={zone}>
              {zone}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
