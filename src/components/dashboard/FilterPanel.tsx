import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertType } from '@/utils/alertsData';
import { FilterHeader } from './filters/FilterHeader';
import { FilterActionButtons } from './filters/FilterActionButtons';
import { FilterOptionsPanel } from './filters/FilterOptionsPanel';
import { SecondaryFiltersPanel } from './filters/SecondaryFiltersPanel';
import { FilterCustomizationPanel } from './filters/FilterCustomizationPanel';

export interface FilterOptions {
  startDate?: Date;
  endDate?: Date;
  selectedVehicles: string[];
  statusFilters: {
    running: boolean;
    idle: boolean;
    stopped: boolean;
  };
  speedThreshold: string;
  selectedZone: string;
  chartType: string;
  alertType: AlertType | 'all';
}

interface FilterPanelProps {
  className?: string;
  onFilterChange?: (filters: FilterOptions) => void;
}

export const FilterPanel = ({ className, onFilterChange }: FilterPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [statusFilters, setStatusFilters] = useState({
    running: true,
    idle: true,
    stopped: true,
  });
  const [speedThreshold, setSpeedThreshold] = useState('');
  const [selectedZone, setSelectedZone] = useState('all_locations');
  const [chartType, setChartType] = useState('line');
  const [alertType, setAlertType] = useState<AlertType | 'all'>('all');

  // Moroccan cities for geofencing zones
  const zones = ['Rabat', 'Casablanca', 'Marrakech', 'Nador', 'Ouarzazate', 'Fes', 'Agadir', 'Tanger'];
  const vehicles = [
    'Vehicle 1', 'Vehicle 2', 'Vehicle 3', 'Vehicle 4', 'Vehicle 5', 
    'FL-7823', 'FL-4567', 'FL-9012', 'FL-6547', 'FL-3210', 'FL-3452', 'FL-8732'
  ];
  const chartTypes = ['Bar', 'Line', 'Pie'];
  const exportOptions = ['CSV', 'Excel', 'PDF'];
  const columnOptions = ['Status', 'Speed', 'Location', 'Driver', 'Time'];
  const alertTypes = [
    { value: 'all', label: 'All Alerts' },
    { value: 'speed', label: 'Speed Alerts' },
    { value: 'fuel', label: 'Fuel Alerts' },
    { value: 'activity', label: 'Activity Alerts' },
    { value: 'geofence', label: 'Geofence Alerts' },
    { value: 'time', label: 'Drive Time Alerts' }
  ];

  const togglePanel = () => setIsOpen(!isOpen);

  const handleStatusChange = (status: keyof typeof statusFilters) => {
    const newStatusFilters = {
      ...statusFilters,
      [status]: !statusFilters[status],
    };
    setStatusFilters(newStatusFilters);
    notifyFilterChange(newStatusFilters);
  };

  const handleAlertTypeChange = (value: AlertType | 'all') => {
    setAlertType(value);
    notifyFilterChange(undefined, value);
  };

  const handleZoneChange = (zone: string) => {
    setSelectedZone(zone);
    if (onFilterChange) {
      onFilterChange({
        startDate,
        endDate,
        selectedVehicles,
        statusFilters,
        speedThreshold,
        selectedZone: zone,
        chartType,
        alertType,
      });
    }
  };

  const notifyFilterChange = (newStatusFilters?: typeof statusFilters, newAlertType?: AlertType | 'all') => {
    if (onFilterChange) {
      onFilterChange({
        startDate,
        endDate,
        selectedVehicles,
        statusFilters: newStatusFilters || statusFilters,
        speedThreshold,
        selectedZone,
        chartType,
        alertType: newAlertType || alertType,
      });
    }
  };

  const handleResetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedVehicles([]);
    setStatusFilters({
      running: true,
      idle: true,
      stopped: true,
    });
    setSpeedThreshold('');
    setSelectedZone('all_locations');
    setChartType('line');
    setAlertType('all');
    if (onFilterChange) {
      onFilterChange({
        startDate: undefined,
        endDate: undefined,
        selectedVehicles: [],
        statusFilters: {
          running: true,
          idle: true,
          stopped: true,
        },
        speedThreshold: '',
        selectedZone: 'all_locations',
        chartType: 'line',
        alertType: 'all',
      });
    }
  };

  const handleApplyFilters = () => {
    notifyFilterChange();
  };

  return (
    <div className={cn("bg-white rounded-xl shadow-sm border border-gray-100 mb-6", className)}>
      <FilterHeader isOpen={isOpen} togglePanel={togglePanel} />
      {isOpen && (
        <div className="p-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FilterOptionsPanel
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              selectedVehicles={selectedVehicles}
              setSelectedVehicles={setSelectedVehicles}
              vehicles={vehicles}
              speedThreshold={speedThreshold}
              setSpeedThreshold={setSpeedThreshold}
              notifyFilterChange={notifyFilterChange}
            />
            <SecondaryFiltersPanel
              statusFilters={statusFilters}
              handleStatusChange={handleStatusChange}
              alertTypes={alertTypes}
              alertType={alertType}
              handleAlertTypeChange={handleAlertTypeChange}
              zones={zones}
              selectedZone={selectedZone}
              handleZoneChange={handleZoneChange}
              notifyFilterChange={notifyFilterChange}
            />
            <FilterCustomizationPanel
              chartType={chartType}
              setChartType={setChartType}
              chartTypes={chartTypes}
              exportOptions={exportOptions}
              columnOptions={columnOptions}
              notifyFilterChange={notifyFilterChange}
            />
          </div>
          <FilterActionButtons 
            onReset={handleResetFilters}
            onApply={handleApplyFilters}
          />
        </div>
      )}
    </div>
  );
};
