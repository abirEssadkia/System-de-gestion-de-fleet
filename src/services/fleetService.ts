
import { Vehicle, Driver } from '@/types/fleet';
import { toast } from '@/hooks/use-toast';

// Mock data for vehicles
const mockVehicles: Vehicle[] = [
  {
    id: 'v1',
    licensePlate: 'ABC-123',
    type: 'Truck',
    status: 'Available',
    model: 'Mercedes Actros',
    year: 2022,
    lastMaintenance: '2023-12-15',
    fuelLevel: 85,
    mileage: 15000,
    location: { lat: 33.5731, lng: -7.5898 }
  },
  {
    id: 'v2',
    licensePlate: 'DEF-456',
    type: 'Van',
    status: 'In Use',
    model: 'Ford Transit',
    year: 2021,
    lastMaintenance: '2023-11-10',
    fuelLevel: 65,
    mileage: 25000,
    assignedDriverId: 'd1',
    location: { lat: 31.6295, lng: -7.9811 }
  },
  {
    id: 'v3',
    licensePlate: 'GHI-789',
    type: 'Car',
    status: 'Maintenance',
    model: 'Toyota Corolla',
    year: 2020,
    lastMaintenance: '2024-01-05',
    fuelLevel: 0,
    mileage: 35000,
    location: { lat: 34.0181, lng: -5.0078 }
  },
  {
    id: 'v4',
    licensePlate: 'JKL-012',
    type: 'Bus',
    status: 'Available',
    model: 'Volvo 9700',
    year: 2023,
    lastMaintenance: '2024-02-20',
    fuelLevel: 100,
    mileage: 5000,
    location: { lat: 35.1740, lng: -2.9287 }
  },
  {
    id: 'v5',
    licensePlate: 'MNO-345',
    type: 'Truck',
    status: 'Out of Service',
    model: 'Scania R450',
    year: 2019,
    lastMaintenance: '2023-10-01',
    fuelLevel: 10,
    mileage: 85000,
    location: { lat: 30.4278, lng: -9.5981 }
  }
];

// Mock data for drivers
const mockDrivers: Driver[] = [
  {
    id: 'd1',
    name: 'Mohammed Alami',
    status: 'On Duty',
    license: 'DL-98765',
    licenseExpiry: '2025-08-15',
    phone: '+212 612 345 678',
    email: 'mohammed.alami@example.com',
    rating: 4.8,
    assignedVehicleId: 'v2',
    totalTrips: 187,
    hireDate: '2021-05-10'
  },
  {
    id: 'd2',
    name: 'Fatima Benali',
    status: 'Available',
    license: 'DL-45678',
    licenseExpiry: '2024-11-20',
    phone: '+212 634 567 890',
    email: 'fatima.benali@example.com',
    rating: 4.5,
    totalTrips: 142,
    hireDate: '2021-09-15'
  },
  {
    id: 'd3',
    name: 'Youssef El Mansouri',
    status: 'Off Duty',
    license: 'DL-23456',
    licenseExpiry: '2024-05-30',
    phone: '+212 656 789 012',
    email: 'youssef.elmansouri@example.com',
    rating: 4.9,
    totalTrips: 215,
    hireDate: '2020-11-05'
  },
  {
    id: 'd4',
    name: 'Nadia Tazi',
    status: 'On Leave',
    license: 'DL-87654',
    licenseExpiry: '2025-03-25',
    phone: '+212 678 901 234',
    email: 'nadia.tazi@example.com',
    rating: 4.6,
    totalTrips: 156,
    hireDate: '2022-01-15'
  },
  {
    id: 'd5',
    name: 'Karim Benjelloun',
    status: 'Available',
    license: 'DL-34567',
    licenseExpiry: '2024-09-10',
    phone: '+212 690 123 456',
    email: 'karim.benjelloun@example.com',
    rating: 4.7,
    totalTrips: 198,
    hireDate: '2021-07-22'
  }
];

// In a real application, these would be API calls to a backend
let vehicles = [...mockVehicles];
let drivers = [...mockDrivers];

// Vehicle service functions
export const getVehicles = async (): Promise<Vehicle[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(vehicles), 500);
  });
};

export const addVehicle = async (vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
  // Generate a new ID
  const newVehicle = {
    ...vehicle,
    id: `v${vehicles.length + 1}`
  };
  
  vehicles = [...vehicles, newVehicle];
  toast({
    title: "Vehicle added",
    description: `${newVehicle.model} (${newVehicle.licensePlate}) has been added to the fleet.`
  });
  
  return newVehicle;
};

export const updateVehicle = async (updatedVehicle: Vehicle): Promise<Vehicle> => {
  vehicles = vehicles.map(vehicle => 
    vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
  );
  
  toast({
    title: "Vehicle updated",
    description: `${updatedVehicle.model} (${updatedVehicle.licensePlate}) has been updated.`
  });
  
  return updatedVehicle;
};

export const deleteVehicle = async (id: string): Promise<void> => {
  const vehicle = vehicles.find(v => v.id === id);
  vehicles = vehicles.filter(vehicle => vehicle.id !== id);
  
  toast({
    title: "Vehicle removed",
    description: vehicle ? `${vehicle.model} (${vehicle.licensePlate}) has been removed from the fleet.` : "Vehicle has been removed."
  });
};

// Driver service functions
export const getDrivers = async (): Promise<Driver[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(drivers), 500);
  });
};

export const addDriver = async (driver: Omit<Driver, 'id'>): Promise<Driver> => {
  // Generate a new ID
  const newDriver = {
    ...driver,
    id: `d${drivers.length + 1}`
  };
  
  drivers = [...drivers, newDriver];
  toast({
    title: "Driver added",
    description: `${newDriver.name} has been added to the team.`
  });
  
  return newDriver;
};

export const updateDriver = async (updatedDriver: Driver): Promise<Driver> => {
  drivers = drivers.map(driver => 
    driver.id === updatedDriver.id ? updatedDriver : driver
  );
  
  toast({
    title: "Driver updated",
    description: `${updatedDriver.name}'s information has been updated.`
  });
  
  return updatedDriver;
};

export const deleteDriver = async (id: string): Promise<void> => {
  const driver = drivers.find(d => d.id === id);
  drivers = drivers.filter(driver => driver.id !== id);
  
  toast({
    title: "Driver removed",
    description: driver ? `${driver.name} has been removed from the team.` : "Driver has been removed."
  });
};

// Add fleet status interface
export interface FleetStatusData {
  running: number;
  idle: number;
  stopped: number;
  noData?: number;
}

// Add fleet status function - mock data only
export const getFleetStatus = async (): Promise<FleetStatusData> => {
  // Simulate API call with delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        running: 80,
        idle: 13,
        stopped: 5,
        noData: 2
      });
    }, 600);
  });
};
