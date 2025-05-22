
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
    // Log for debugging
    console.log("Raw map points:", rawMapPoints);
    
    // Start with raw points - ensure we always have a valid array
    let filteredPoints = Array.isArray(rawMapPoints) && rawMapPoints.length > 0 
      ? [...rawMapPoints] 
      : [];
    
    // If we don't have any points but have alertType, get them from allAlerts
    if (filteredPoints.length === 0 && alertType) {
      console.log("No raw points, getting points from alerts for type:", alertType);
      const sourceAlerts = alertType === 'all' 
        ? allAlerts 
        : allAlerts.filter(alert => alert.type === alertType);
      
      filteredPoints = sourceAlerts.map(alert => ({
        lat: alert.coordinates?.lat || 0,
        lng: alert.coordinates?.lng || 0,
        description: `${alert.title} (${alert.vehicleId}): ${alert.description}`,
        type: alert.type
      }));
    }
    
    // If we have explicit filters, apply them
    if (filters.alertType && filters.alertType !== 'all' && filters.alertType !== alertType) {
      // Filter by new alert type
      console.log("Filtering by alert type:", filters.alertType);
      // We need to go back to source data
      const sourceAlerts = allAlerts.filter(alert => alert.type === filters.alertType);
      filteredPoints = sourceAlerts.map(alert => ({
        lat: alert.coordinates?.lat || 0,
        lng: alert.coordinates?.lng || 0,
        description: `${alert.title} (${alert.vehicleId}): ${alert.description}`,
        type: alert.type
      }));
    }
    
    // Filter by vehicle if selected
    if (filters.selectedVehicles && filters.selectedVehicles.length > 0) {
      console.log("Filtering by vehicles:", filters.selectedVehicles);
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
    if (filters.selectedZone && filters.selectedZone !== 'all_locations') {
      console.log("Filtering by zone:", filters.selectedZone);
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
    
    console.log("Final filtered points:", filteredPoints);
    return filteredPoints;
  }, [rawMapPoints, filters, alertType, allAlerts]);

  return mapPoints;
};
