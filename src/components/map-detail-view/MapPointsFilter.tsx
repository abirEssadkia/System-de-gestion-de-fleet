
import { useMemo } from 'react';
import { Point } from './types';
import { FilterOptions } from './types';
import { Alert } from '@/utils/alertsData';

interface FilterPointsProps {
  rawMapPoints: Point[];
  filters: FilterOptions;
  alertType: string;
  allAlerts: Alert[];
}

export const useMapPointsFilter = ({ rawMapPoints, filters, alertType, allAlerts }: FilterPointsProps) => {
  // Apply filters to map points
  const mapPoints = useMemo(() => {
    // Start with raw points
    let filteredPoints = [...rawMapPoints];
    
    // If we have explicit filters, apply them
    if (filters.alertType && filters.alertType !== 'all' && filters.alertType !== alertType) {
      // Filter by new alert type
      if (filters.alertType !== alertType) {
        // We need to go back to source data
        const sourceAlerts = allAlerts.filter(alert => alert.type === filters.alertType);
        filteredPoints = sourceAlerts.map(alert => ({
          lat: alert.coordinates?.lat || 0,
          lng: alert.coordinates?.lng || 0,
          description: `${alert.title} (${alert.vehicleId}): ${alert.description}`,
          type: alert.type
        }));
      }
    }
    
    // Filter by vehicle if selected
    if (filters.selectedVehicles && filters.selectedVehicles.length > 0) {
      // We need vehicle info from raw alerts
      const vehicleIds = filters.selectedVehicles;
      const filteredAlerts = allAlerts.filter(alert => 
        vehicleIds.includes(alert.vehicleId) && (filters.alertType === 'all' || alert.type === filters.alertType)
      );
      
      filteredPoints = filteredAlerts.map(alert => ({
        lat: alert.coordinates?.lat || 0,
        lng: alert.coordinates?.lng || 0,
        description: `${alert.title} (${alert.vehicleId}): ${alert.description}`,
        type: alert.type
      }));
    }
    
    // Filter by location/zone if selected
    if (filters.selectedZone) {
      const filteredAlerts = allAlerts.filter(alert => 
        alert.location?.includes(filters.selectedZone) &&
        (filters.alertType === 'all' || alert.type === filters.alertType)
      );
      
      filteredPoints = filteredAlerts.map(alert => ({
        lat: alert.coordinates?.lat || 0,
        lng: alert.coordinates?.lng || 0,
        description: `${alert.title} (${alert.vehicleId}): ${alert.description}`,
        type: alert.type
      }));
    }
    
    return filteredPoints;
  }, [rawMapPoints, filters, alertType, allAlerts]);

  return mapPoints;
};
