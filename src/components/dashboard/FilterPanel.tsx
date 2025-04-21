
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertType } from '@/utils/alertsData';
import { FilterHeader } from './filters/FilterHeader';
import { DateRangeSelector } from './filters/DateRangeSelector';
import { VehicleSelector } from './filters/VehicleSelector';
import { StatusFilter } from './filters/StatusFilter';
import { AlertTypeFilter } from './filters/AlertTypeFilter';
import { GeofenceSelector } from './filters/GeofenceSelector';
import { SpeedThresholdFilter } from './filters/SpeedThresholdFilter';
import { CustomizationPanel } from './filters/CustomizationPanel';
import { FilterActionButtons } from './filters/FilterActionButtons';

interface FilterPanelProps {
  className?: string;
  onFilterChange?: (filters: FilterOptions) => void;
}

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
  alertType?: AlertType | 'all';
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
  const [selectedZone, setSelectedZone] = useState('');
  const [chartType, setChartType] = useState('line');
  const [alertType, setAlertType] = useState<AlertType | 'all'>('all');
  
  // Moroccan cities only for geofencing zones:
  const zones = ['Casablanca', 'Marrakech', 'Fes', 'Nador', 'Agadir', 'Ouarzazate', 'Rabat', 'Tanger'];
  const vehicles = ['Vehicle 1', 'Vehicle 2', 'Vehicle 3', 'Vehicle 4', 'Vehicle 5', 'FL-7823', 'FL-4567', 'FL-9012', 'FL-6547', 'FL-3210', 'FL-3452', 'FL-8732'];
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
      [status]: !statusFilters[status]
    };
    setStatusFilters(newStatusFilters);
    notifyFilterChange(newStatusFilters);
  };

  const handleAlertTypeChange = (value: AlertType | 'all') => {
    setAlertType(value);
    notifyFilterChange(undefined, value);
  };

  // Ensure the zone filter propagates immediately when changed
  const handleZoneChange = (zone: string) => {
    setSelectedZone(zone);
    // Immediately notify parent of the change
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
        alertType: newAlertType || alertType
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
    setSelectedZone('');
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
        selectedZone: '',
        chartType: 'line',
        alertType: 'all'
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
            {/* Filter Section */}
            <div className="space-y-4">
              <h4 className="font-medium text-fleet-navy flex items-center gap-2">
                <span className="w-4 h-4" /> Filter Options
              </h4>
              
              {/* Date Range */}
              <DateRangeSelector 
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={(date) => {
                  setStartDate(date);
                  if (date) notifyFilterChange();
                }}
                onEndDateChange={(date) => {
                  setEndDate(date);
                  if (date) notifyFilterChange();
                }}
              />
              
              {/* Vehicle Selection */}
              <VehicleSelector 
                vehicles={vehicles}
                selectedVehicles={selectedVehicles}
                setSelectedVehicles={setSelectedVehicles}
                notifyChange={notifyFilterChange}
              />
              
              {/* Speed Threshold */}
              <SpeedThresholdFilter 
                speedThreshold={speedThreshold}
                onChange={setSpeedThreshold}
                notifyChange={notifyFilterChange}
              />
            </div>
            
            {/* More Filters */}
            <div className="space-y-4">
              {/* Status Filters */}
              <StatusFilter 
                statusFilters={statusFilters}
                handleStatusChange={handleStatusChange}
              />
              
              {/* Alert Type Filters */}
              <AlertTypeFilter 
                alertTypes={alertTypes}
                selectedAlertType={alertType}
                onAlertTypeChange={handleAlertTypeChange}
              />
              
              {/* Geofencing Zones */}
              <GeofenceSelector 
                zones={zones}
                selectedZone={selectedZone}
                onChange={handleZoneChange}
                notifyChange={notifyFilterChange}
              />
            </div>
            
            {/* Customization Section */}
            <CustomizationPanel 
              chartTypes={chartTypes}
              chartType={chartType}
              setChartType={setChartType}
              exportOptions={exportOptions}
              columnOptions={columnOptions}
              notifyChange={notifyFilterChange}
            />
          </div>
          
          {/* Action Buttons */}
          <FilterActionButtons 
            onReset={handleResetFilters}
            onApply={handleApplyFilters}
          />
        </div>
      )}
    </div>
  );
};

