
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
