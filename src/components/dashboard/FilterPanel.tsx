
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, Calendar as CalendarIcon, Car, CheckSquare, Gauge, MapPin, BarChart, Download, Columns } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Selector } from './Selector';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { AlertType } from '@/utils/alertsData';

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
  
  // Sample data
  const vehicles = ['Vehicle 1', 'Vehicle 2', 'Vehicle 3', 'Vehicle 4', 'Vehicle 5', 'FL-7823', 'FL-4567', 'FL-9012', 'FL-6547', 'FL-3210', 'FL-3452', 'FL-8732'];
  const zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Rabat', 'Casablanca', 'Marrakech', 'Tangier'];
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
      <div 
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={togglePanel}
      >
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-fleet-navy" />
          <h3 className="font-medium text-fleet-navy">Filters & Customization</h3>
        </div>
        <div>
          {isOpen ? 
            <ChevronUp className="w-5 h-5 text-fleet-navy" /> : 
            <ChevronDown className="w-5 h-5 text-fleet-navy" />
          }
        </div>
      </div>
      
      {isOpen && (
        <div className="p-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Filter Section */}
            <div className="space-y-4">
              <h4 className="font-medium text-fleet-navy flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filter Options
              </h4>
              
              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-fleet-dark-gray flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" /> Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "dd/MM/yyyy") : "Start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          setStartDate(date);
                          if (date && onFilterChange) notifyFilterChange();
                        }}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "dd/MM/yyyy") : "End date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          setEndDate(date);
                          if (date && onFilterChange) notifyFilterChange();
                        }}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              {/* Vehicle Selection */}
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
                      if (onFilterChange) notifyFilterChange();
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
                            if (onFilterChange) notifyFilterChange();
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Speed Threshold */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-fleet-dark-gray flex items-center gap-2">
                  <Gauge className="w-4 h-4" /> Speed Threshold (km/h)
                </label>
                <input 
                  type="number" 
                  className="fleet-selector" 
                  value={speedThreshold}
                  onChange={(e) => {
                    setSpeedThreshold(e.target.value);
                    if (onFilterChange) notifyFilterChange();
                  }}
                  placeholder="Enter max speed"
                  min="0"
                />
              </div>
            </div>
            
            {/* More Filters */}
            <div className="space-y-4">
              {/* Status Filters */}
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
              
              {/* Alert Type Filters */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-fleet-dark-gray flex items-center gap-2">
                  <BellDot className="w-4 h-4" /> Alert Type
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {alertTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleAlertTypeChange(type.value as AlertType | 'all')}
                      className={cn(
                        "px-3 py-1.5 text-xs rounded-md border transition-colors",
                        alertType === type.value
                          ? "bg-fleet-blue text-white border-fleet-blue"
                          : "bg-white text-fleet-dark-gray border-gray-200 hover:border-gray-300"
                      )}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Geofencing Zones */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-fleet-dark-gray flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Geofencing Zones
                </label>
                <Selector 
                  label="Zones" 
                  options={zones}
                  value={selectedZone}
                  onChange={(value) => {
                    setSelectedZone(value);
                    if (onFilterChange) notifyFilterChange();
                  }}
                  placeholder="Select zone"
                />
              </div>
            </div>
            
            {/* Customization Section */}
            <div className="space-y-4">
              <h4 className="font-medium text-fleet-navy flex items-center gap-2">
                <BarChart className="w-4 h-4" /> Customization Options
              </h4>
              
              {/* Chart Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-fleet-dark-gray">Chart Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {chartTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setChartType(type.toLowerCase());
                        if (onFilterChange) notifyFilterChange();
                      }}
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-md border transition-colors",
                        chartType === type.toLowerCase()
                          ? "bg-fleet-blue text-white border-fleet-blue"
                          : "bg-white text-fleet-dark-gray border-gray-200 hover:border-gray-300"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Data Export Options */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-fleet-dark-gray flex items-center gap-2">
                  <Download className="w-4 h-4" /> Export Data
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {exportOptions.map((option) => (
                    <button
                      key={option}
                      className="px-3 py-1.5 text-sm rounded-md border border-gray-200 bg-white text-fleet-dark-gray hover:border-gray-300 transition-colors flex items-center justify-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Column Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-fleet-dark-gray flex items-center gap-2">
                  <Columns className="w-4 h-4" /> Column Selection
                </label>
                <div className="flex flex-wrap gap-2">
                  {columnOptions.map((column) => (
                    <div key={column} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`column-${column}`}
                        className="h-4 w-4 text-fleet-blue rounded border-gray-300 focus:ring-fleet-blue"
                        defaultChecked
                      />
                      <label htmlFor={`column-${column}`} className="ml-2 text-sm text-fleet-dark-gray">
                        {column}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button 
              className="px-4 py-2 border border-gray-200 rounded-md text-fleet-dark-gray hover:bg-gray-50 transition-colors"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
            <button 
              className="px-4 py-2 bg-fleet-blue text-white rounded-md hover:bg-fleet-blue/90 transition-colors"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
