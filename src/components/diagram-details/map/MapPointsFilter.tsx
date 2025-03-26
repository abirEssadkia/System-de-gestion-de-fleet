import { useMemo } from 'react';
import { Alert } from '@/utils/alertsData';
import { FilterOptions } from '@/components/dashboard/FilterPanel';

interface Point {
  lat: number;
  lng: number;
  description?: string;
  type?: 'speed' | 'fuel' | 'activity' | 'geofence' | 'time';
}

interface MapPointsFilterProps {
  data?: Point[];
  type?: 'speed' | 'fuel' | 'activity' | 'geofence' | 'time' | 'all';
  filters?: FilterOptions;
  allAlerts: Alert[];
}

export const useMapPointsFilter = ({ data, type = 'all', filters, allAlerts }: MapPointsFilterProps) => {
  // Filter alerts based on the provided filters
  const mapPoints = useMemo(() => {
    // If data is explicitly provided, use it
    if (data && data.length > 0) return data;
    
    // Otherwise, apply filters to the alerts data
    let filteredAlerts = [...allAlerts];
    
    // Filter by alert type (from prop or filter)
    const alertType = filters?.alertType || type;
    if (alertType !== 'all') {
      filteredAlerts = filteredAlerts.filter(alert => alert.type === alertType);
    }
    
    // Filter by vehicle if selected
    if (filters?.selectedVehicles && filters.selectedVehicles.length > 0) {
      filteredAlerts = filteredAlerts.filter(alert => 
        filters.selectedVehicles.includes(alert.vehicleId)
      );
    }
    
    // Filter by date range
    if (filters?.startDate) {
      const startDate = new Date(filters.startDate);
      filteredAlerts = filteredAlerts.filter(alert => 
        new Date(alert.timestamp) >= startDate
      );
    }
    
    if (filters?.endDate) {
      const endDate = new Date(filters.endDate);
      // Set to end of day
      endDate.setHours(23, 59, 59, 999);
      filteredAlerts = filteredAlerts.filter(alert => 
        new Date(alert.timestamp) <= endDate
      );
    }
    
    // Filter by location/zone if selected
    if (filters?.selectedZone) {
      filteredAlerts = filteredAlerts.filter(alert => 
        alert.location?.includes(filters.selectedZone)
      );
    }
    
    // Convert filtered alerts to map points
    return filteredAlerts.map(alert => ({
      lat: alert.coordinates?.lat || 0,
      lng: alert.coordinates?.lng || 0,
      description: `${alert.title} (${alert.vehicleId}): ${alert.description}`,
      type: alert.type
    }));
  }, [data, type, filters, allAlerts]);

  return mapPoints;
};
