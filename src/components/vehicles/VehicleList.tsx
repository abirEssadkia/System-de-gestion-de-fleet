
import React from 'react';
import { Vehicle } from '@/types/fleet';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Car, Truck, Bus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VehicleListProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

const getStatusColor = (status: Vehicle['status']) => {
  switch (status) {
    case 'Available':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'In Use':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Maintenance':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Out of Service':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getVehicleIcon = (type: Vehicle['type']) => {
  switch (type) {
    case 'Car':
      return <Car className="h-4 w-4" />;
    case 'Truck':
      return <Truck className="h-4 w-4" />;
    case 'Bus':
      return <Bus className="h-4 w-4" />;
    case 'Van':
    default:
      return <Car className="h-4 w-4" />;
  }
};

export const VehicleList: React.FC<VehicleListProps> = ({ vehicles, onEdit, onDelete }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>License Plate</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Fuel Level</TableHead>
            <TableHead>Mileage (km)</TableHead>
            <TableHead>Last Maintenance</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                No vehicles found.
              </TableCell>
            </TableRow>
          ) : (
            vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="flex items-center font-medium">
                  {getVehicleIcon(vehicle.type)}
                  <span className="ml-2">{vehicle.type}</span>
                </TableCell>
                <TableCell>{vehicle.licensePlate}</TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.year}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getStatusColor(vehicle.status)}`}>
                    {vehicle.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        vehicle.fuelLevel > 70 ? 'bg-green-500' : 
                        vehicle.fuelLevel > 30 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} 
                      style={{ width: `${vehicle.fuelLevel}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{vehicle.fuelLevel}%</span>
                </TableCell>
                <TableCell>{vehicle.mileage.toLocaleString()}</TableCell>
                <TableCell>{new Date(vehicle.lastMaintenance).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button size="icon" variant="ghost" onClick={() => onEdit(vehicle)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onDelete(vehicle.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
