
import React from 'react';
import { BellDot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AlertType } from '@/utils/alertsData';

interface AlertTypeFilterProps {
  alertTypes: Array<{ value: string; label: string }>;
  selectedAlertType: AlertType | 'all';
  onAlertTypeChange: (value: AlertType | 'all') => void;
}

export const AlertTypeFilter = ({ 
  alertTypes, 
  selectedAlertType, 
  onAlertTypeChange 
}: AlertTypeFilterProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-fleet-dark-gray flex items-center gap-2">
        <BellDot className="w-4 h-4" /> Alert Type
      </label>
      <div className="grid grid-cols-2 gap-2 mb-2">
        {alertTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onAlertTypeChange(type.value as AlertType | 'all')}
            className={cn(
              "px-3 py-1.5 text-xs rounded-md border transition-colors",
              selectedAlertType === type.value
                ? "bg-fleet-blue text-white border-fleet-blue"
                : "bg-white text-fleet-dark-gray border-gray-200 hover:border-gray-300"
            )}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
};
