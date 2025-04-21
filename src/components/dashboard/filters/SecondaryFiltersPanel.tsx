
import React from 'react';
import { StatusFilter } from './StatusFilter';
import { AlertTypeFilter } from './AlertTypeFilter';
import { GeofenceSelector } from './GeofenceSelector';
import { AlertType } from '@/utils/alertsData';

interface StatusFiltersType {
  running: boolean;
  idle: boolean;
  stopped: boolean;
}

interface SecondaryFiltersPanelProps {
  statusFilters: StatusFiltersType;
  handleStatusChange: (status: keyof StatusFiltersType) => void;
  alertTypes: Array<{ value: string; label: string }>;
  alertType: AlertType | 'all';
  handleAlertTypeChange: (value: AlertType | 'all') => void;
  zones: string[];
  selectedZone: string;
  handleZoneChange: (zone: string) => void;
  notifyFilterChange: () => void;
}

export const SecondaryFiltersPanel = ({
  statusFilters,
  handleStatusChange,
  alertTypes,
  alertType,
  handleAlertTypeChange,
  zones,
  selectedZone,
  handleZoneChange,
  notifyFilterChange
}: SecondaryFiltersPanelProps) => (
  <div className="space-y-4">
    <StatusFilter 
      statusFilters={statusFilters}
      handleStatusChange={handleStatusChange}
    />
    <AlertTypeFilter
      alertTypes={alertTypes}
      selectedAlertType={alertType}
      onAlertTypeChange={handleAlertTypeChange}
    />
    <GeofenceSelector
      zones={zones}
      selectedZone={selectedZone}
      onChange={handleZoneChange}
      notifyChange={notifyFilterChange}
    />
  </div>
);
