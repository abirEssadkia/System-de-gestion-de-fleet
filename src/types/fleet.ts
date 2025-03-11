
export interface Vehicle {
  id: string;
  licensePlate: string;
  type: 'Truck' | 'Van' | 'Car' | 'Bus';
  status: 'Available' | 'In Use' | 'Maintenance' | 'Out of Service';
  model: string;
  year: number;
  lastMaintenance: string;
  fuelLevel: number;
  mileage: number;
  assignedDriverId?: string;
  location?: {
    lat: number;
    lng: number;
  };
  maintenanceHistory?: MaintenanceRecord[];
  nextScheduledMaintenance?: string;
}

export interface Driver {
  id: string;
  name: string;
  status: 'Available' | 'On Duty' | 'Off Duty' | 'On Leave';
  license: string;
  licenseExpiry: string;
  phone: string;
  email: string;
  rating: number;
  assignedVehicleId?: string;
  totalTrips: number;
  hireDate: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: 'Routine' | 'Repair' | 'Inspection' | 'Technical Control';
  startDate: string;
  endDate?: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  description: string;
  cost: number;
  technician: string;
  notes?: string;
  parts?: MaintenancePart[];
}

export interface MaintenancePart {
  name: string;
  quantity: number;
  cost: number;
}

export interface MaintenanceAlert {
  id: string;
  vehicleId: string;
  type: 'Mileage' | 'TimeInterval' | 'TechnicalControl' | 'ScheduledMaintenance';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  dueDate: string;
  isResolved: boolean;
}
