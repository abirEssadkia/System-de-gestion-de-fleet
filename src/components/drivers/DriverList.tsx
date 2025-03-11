
import React from 'react';
import { Driver } from '@/types/fleet';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DriverListProps {
  drivers: Driver[];
  onEdit: (driver: Driver) => void;
  onDelete: (id: string) => void;
}

const getStatusColor = (status: Driver['status']) => {
  switch (status) {
    case 'Available':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'On Duty':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Off Duty':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'On Leave':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const DriverList: React.FC<DriverListProps> = ({ drivers, onEdit, onDelete }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>License</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Total Trips</TableHead>
            <TableHead>Hire Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                No drivers found.
              </TableCell>
            </TableRow>
          ) : (
            drivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell className="font-medium">{driver.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getStatusColor(driver.status)}`}>
                    {driver.status}
                  </Badge>
                </TableCell>
                <TableCell>{driver.license}</TableCell>
                <TableCell>
                  {new Date(driver.licenseExpiry) < new Date() ? (
                    <span className="text-red-500">{new Date(driver.licenseExpiry).toLocaleDateString()}</span>
                  ) : (
                    new Date(driver.licenseExpiry).toLocaleDateString()
                  )}
                </TableCell>
                <TableCell>
                  <div>{driver.phone}</div>
                  <div className="text-xs text-gray-500">{driver.email}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="mr-1">{driver.rating}</span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                </TableCell>
                <TableCell>{driver.totalTrips}</TableCell>
                <TableCell>{new Date(driver.hireDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button size="icon" variant="ghost" onClick={() => onEdit(driver)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onDelete(driver.id)}>
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
