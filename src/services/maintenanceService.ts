
import { MaintenanceRecord, MaintenanceAlert, Vehicle } from '@/types/fleet';
import { toast } from '@/hooks/use-toast';
import { getVehicles, updateVehicle } from './fleetService';

// Mock maintenance records data
const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: 'm1',
    vehicleId: 'v1',
    type: 'Routine',
    startDate: '2024-04-15',
    endDate: '2024-04-16',
    status: 'Completed',
    description: 'Regular oil change and filter replacement',
    cost: 350,
    technician: 'Ahmed Benchekroun',
    parts: [
      { name: 'Oil Filter', quantity: 1, cost: 80 },
      { name: 'Engine Oil', quantity: 5, cost: 250 },
      { name: 'Air Filter', quantity: 1, cost: 120 }
    ]
  },
  {
    id: 'm2',
    vehicleId: 'v2',
    type: 'Repair',
    startDate: '2024-05-10',
    status: 'In Progress',
    description: 'Transmission repair',
    cost: 2800,
    technician: 'Youssef Berrada',
    parts: [
      { name: 'Transmission Fluid', quantity: 8, cost: 560 },
      { name: 'Gasket Set', quantity: 1, cost: 350 },
      { name: 'Clutch Kit', quantity: 1, cost: 1200 }
    ]
  },
  {
    id: 'm3',
    vehicleId: 'v3',
    type: 'Technical Control',
    startDate: '2024-04-28',
    endDate: '2024-04-28',
    status: 'Completed',
    description: 'Annual technical inspection',
    cost: 450,
    technician: 'NARSA Center',
  },
  {
    id: 'm4',
    vehicleId: 'v4',
    type: 'Inspection',
    startDate: '2024-06-05',
    status: 'Scheduled',
    description: 'Pre-trip inspection and safety check',
    cost: 180,
    technician: 'Karim Touré',
  },
  {
    id: 'm5',
    vehicleId: 'v5',
    type: 'Repair',
    startDate: '2024-05-02',
    endDate: '2024-05-08',
    status: 'Completed',
    description: 'Engine overhaul',
    cost: 9500,
    technician: 'Rachid Moukrim',
    parts: [
      { name: 'Piston Rings', quantity: 6, cost: 1200 },
      { name: 'Gasket Set', quantity: 1, cost: 800 },
      { name: 'Bearings', quantity: 8, cost: 1600 },
      { name: 'Oil Pump', quantity: 1, cost: 1200 }
    ]
  },
  {
    id: 'm6',
    vehicleId: 'v1',
    type: 'Routine',
    startDate: '2024-06-15',
    status: 'Scheduled',
    description: 'Brake system inspection and maintenance',
    cost: 750,
    technician: 'Samir Kadiri',
  },
  {
    id: 'm7',
    vehicleId: 'v3',
    type: 'Repair',
    startDate: '2024-05-15',
    endDate: '2024-05-16',
    status: 'Completed',
    description: 'Electrical system troubleshooting',
    cost: 650,
    technician: 'Hamid Bennani',
    parts: [
      { name: 'Battery', quantity: 1, cost: 450 },
      { name: 'Alternator Belt', quantity: 1, cost: 120 }
    ]
  },
  {
    id: 'm8',
    vehicleId: 'v2',
    type: 'Routine',
    startDate: '2024-07-10',
    status: 'Scheduled',
    description: 'Tire rotation and balancing',
    cost: 320,
    technician: 'Redouane Chaoui',
  }
];

// Mock maintenance alerts
const mockMaintenanceAlerts: MaintenanceAlert[] = [
  {
    id: 'a1',
    vehicleId: 'v1',
    type: 'Mileage',
    priority: 'Medium',
    description: 'Oil change due at 20,000 km (current: 19,500 km)',
    dueDate: '2024-06-20',
    isResolved: false
  },
  {
    id: 'a2',
    vehicleId: 'v2',
    type: 'TimeInterval',
    priority: 'High',
    description: 'Annual service overdue by 15 days',
    dueDate: '2024-05-01',
    isResolved: false
  },
  {
    id: 'a3',
    vehicleId: 'v4',
    type: 'TechnicalControl',
    priority: 'Critical',
    description: 'Technical control certificate expires in 7 days',
    dueDate: '2024-06-01',
    isResolved: false
  },
  {
    id: 'a4',
    vehicleId: 'v3',
    type: 'ScheduledMaintenance',
    priority: 'Low',
    description: 'Routine maintenance scheduled in 30 days',
    dueDate: '2024-07-05',
    isResolved: false
  },
  {
    id: 'a5',
    vehicleId: 'v5',
    type: 'Mileage',
    priority: 'Medium',
    description: 'Brake inspection required at 90,000 km (current: 89,200 km)',
    dueDate: '2024-06-15',
    isResolved: false
  }
];

// Store the data
let maintenanceRecords = [...mockMaintenanceRecords];
let maintenanceAlerts = [...mockMaintenanceAlerts];

// Maintenance service functions
export const getMaintenanceRecords = async (): Promise<MaintenanceRecord[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(maintenanceRecords), 500);
  });
};

export const getMaintenanceRecordsByVehicle = async (vehicleId: string): Promise<MaintenanceRecord[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(maintenanceRecords.filter(record => record.vehicleId === vehicleId)), 500);
  });
};

export const getActiveMaintenances = async (): Promise<MaintenanceRecord[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(maintenanceRecords.filter(record => record.status === 'In Progress')), 500);
  });
};

export const getScheduledMaintenances = async (): Promise<MaintenanceRecord[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(maintenanceRecords.filter(record => record.status === 'Scheduled')), 500);
  });
};

export const addMaintenanceRecord = async (record: Omit<MaintenanceRecord, 'id'>): Promise<MaintenanceRecord> => {
  const newRecord = {
    ...record,
    id: `m${maintenanceRecords.length + 1}`
  };
  
  maintenanceRecords = [...maintenanceRecords, newRecord];
  
  // If this is an active maintenance, update vehicle status
  if (newRecord.status === 'In Progress') {
    const vehicles = await getVehicles();
    const vehicle = vehicles.find(v => v.id === newRecord.vehicleId);
    if (vehicle && vehicle.status !== 'Maintenance') {
      await updateVehicle({
        ...vehicle,
        status: 'Maintenance'
      });
    }
  }
  
  toast({
    title: "Maintenance record added",
    description: `A new maintenance record has been added for vehicle ${newRecord.vehicleId}.`
  });
  
  return newRecord;
};

export const updateMaintenanceRecord = async (updatedRecord: MaintenanceRecord): Promise<MaintenanceRecord> => {
  maintenanceRecords = maintenanceRecords.map(record => 
    record.id === updatedRecord.id ? updatedRecord : record
  );
  
  // If maintenance is completed, update vehicle status if needed
  if (updatedRecord.status === 'Completed') {
    const vehicles = await getVehicles();
    const vehicle = vehicles.find(v => v.id === updatedRecord.vehicleId);
    if (vehicle && vehicle.status === 'Maintenance') {
      // Check if there are other active maintenances for this vehicle
      const otherActiveMaintenances = maintenanceRecords.filter(
        r => r.vehicleId === updatedRecord.vehicleId && 
             r.id !== updatedRecord.id && 
             r.status === 'In Progress'
      );
      
      if (otherActiveMaintenances.length === 0) {
        // No other active maintenances, set vehicle to Available
        await updateVehicle({
          ...vehicle,
          status: 'Available',
          lastMaintenance: new Date().toISOString().split('T')[0]
        });
      }
    }
  }
  
  toast({
    title: "Maintenance record updated",
    description: `The maintenance record for vehicle ${updatedRecord.vehicleId} has been updated.`
  });
  
  return updatedRecord;
};

export const deleteMaintenanceRecord = async (id: string): Promise<void> => {
  const record = maintenanceRecords.find(r => r.id === id);
  maintenanceRecords = maintenanceRecords.filter(record => record.id !== id);
  
  toast({
    title: "Maintenance record deleted",
    description: record 
      ? `The maintenance record for vehicle ${record.vehicleId} has been deleted.` 
      : "The maintenance record has been deleted."
  });
};

export const getMaintenanceAlerts = async (): Promise<MaintenanceAlert[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(maintenanceAlerts), 500);
  });
};

export const resolveMaintenanceAlert = async (id: string): Promise<MaintenanceAlert> => {
  const alert = maintenanceAlerts.find(a => a.id === id);
  if (!alert) {
    throw new Error(`Alert with ID ${id} not found`);
  }
  
  const updatedAlert = { ...alert, isResolved: true };
  maintenanceAlerts = maintenanceAlerts.map(a => a.id === id ? updatedAlert : a);
  
  toast({
    title: "Alert resolved",
    description: `The maintenance alert has been marked as resolved.`
  });
  
  return updatedAlert;
};

// Utility functions for reporting
export const getMaintenanceCostsByVehicle = async (): Promise<{vehicleId: string, totalCost: number}[]> => {
  const completedMaintenances = maintenanceRecords.filter(r => r.status === 'Completed');
  const vehicleCosts: Record<string, number> = {};
  
  completedMaintenances.forEach(record => {
    if (!vehicleCosts[record.vehicleId]) {
      vehicleCosts[record.vehicleId] = 0;
    }
    vehicleCosts[record.vehicleId] += record.cost;
  });
  
  return Object.entries(vehicleCosts).map(([vehicleId, totalCost]) => ({
    vehicleId,
    totalCost
  }));
};

export const getMaintenanceDurationStats = async (): Promise<{type: string, averageDuration: number}[]> => {
  const completedWithEndDate = maintenanceRecords.filter(
    r => r.status === 'Completed' && r.endDate
  );
  
  const typeGroups: Record<string, number[]> = {};
  
  completedWithEndDate.forEach(record => {
    if (record.endDate) {
      const startDate = new Date(record.startDate);
      const endDate = new Date(record.endDate);
      const durationDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (!typeGroups[record.type]) {
        typeGroups[record.type] = [];
      }
      typeGroups[record.type].push(durationDays);
    }
  });
  
  return Object.entries(typeGroups).map(([type, durations]) => ({
    type,
    averageDuration: durations.reduce((sum, duration) => sum + duration, 0) / durations.length
  }));
};

export const getMaintenanceTypeFrequency = async (): Promise<{type: string, count: number}[]> => {
  const typeCount: Record<string, number> = {};
  
  maintenanceRecords.forEach(record => {
    if (!typeCount[record.type]) {
      typeCount[record.type] = 0;
    }
    typeCount[record.type]++;
  });
  
  return Object.entries(typeCount).map(([type, count]) => ({
    type,
    count
  }));
};

export const getTotalMaintenanceCost = async (): Promise<number> => {
  return maintenanceRecords
    .filter(r => r.status === 'Completed')
    .reduce((total, record) => total + record.cost, 0);
};

export const getAverageMaintenanceCostPerVehicle = async (): Promise<number> => {
  const costs = await getMaintenanceCostsByVehicle();
  const totalCost = costs.reduce((total, item) => total + item.totalCost, 0);
  return totalCost / costs.length;
};
