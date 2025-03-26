
import React from 'react';
import { CheckSquare } from 'lucide-react';

interface StatusFiltersType {
  running: boolean;
  idle: boolean;
  stopped: boolean;
}

interface StatusFilterProps {
  statusFilters: StatusFiltersType;
  handleStatusChange: (status: keyof StatusFiltersType) => void;
}

export const StatusFilter = ({ statusFilters, handleStatusChange }: StatusFilterProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-fleet-dark-gray flex items-center gap-2">
        <CheckSquare className="w-4 h-4" /> Status Filters
      </label>
      <div className="space-y-2">
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="status-running" 
            checked={statusFilters.running}
            onChange={() => handleStatusChange('running')}
            className="h-4 w-4 text-fleet-blue rounded border-gray-300 focus:ring-fleet-blue"
          />
          <label htmlFor="status-running" className="ml-2 text-sm text-fleet-dark-gray">
            Running
          </label>
        </div>
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="status-idle" 
            checked={statusFilters.idle}
            onChange={() => handleStatusChange('idle')}
            className="h-4 w-4 text-fleet-yellow rounded border-gray-300 focus:ring-fleet-yellow"
          />
          <label htmlFor="status-idle" className="ml-2 text-sm text-fleet-dark-gray">
            Idle
          </label>
        </div>
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="status-stopped" 
            checked={statusFilters.stopped}
            onChange={() => handleStatusChange('stopped')}
            className="h-4 w-4 text-fleet-red rounded border-gray-300 focus:ring-fleet-red"
          />
          <label htmlFor="status-stopped" className="ml-2 text-sm text-fleet-dark-gray">
            Stopped
          </label>
        </div>
      </div>
    </div>
  );
};
