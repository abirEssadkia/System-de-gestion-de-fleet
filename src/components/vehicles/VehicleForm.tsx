
import React from 'react';
import { Vehicle } from '@/types/fleet';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface VehicleFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Vehicle, 'id'> & { id?: string }) => void;
  vehicle?: Vehicle;
}

const vehicleFormSchema = z.object({
  id: z.string().optional(),
  licensePlate: z.string().min(1, 'License plate is required'),
  type: z.enum(['Truck', 'Van', 'Car', 'Bus'], { required_error: 'Vehicle type is required' }),
  status: z.enum(['Available', 'In Use', 'Maintenance', 'Out of Service'], { required_error: 'Status is required' }),
  model: z.string().min(1, 'Model is required'),
  year: z.coerce.number().int().min(1990, 'Year must be 1990 or later').max(new Date().getFullYear() + 1, `Year must be ${new Date().getFullYear() + 1} or earlier`),
  lastMaintenance: z.string().min(1, 'Last maintenance date is required'),
  fuelLevel: z.coerce.number().min(0, 'Fuel level must be at least 0').max(100, 'Fuel level must be at most 100'),
  mileage: z.coerce.number().min(0, 'Mileage must be at least 0'),
  assignedDriverId: z.string().optional(),
});

export const VehicleForm: React.FC<VehicleFormProps> = ({ open, onClose, onSubmit, vehicle }) => {
  const defaultValues: Omit<Vehicle, 'id'> & { id?: string } = vehicle || {
    licensePlate: '',
    type: 'Truck',
    status: 'Available',
    model: '',
    year: new Date().getFullYear(),
    lastMaintenance: new Date().toISOString().split('T')[0],
    fuelLevel: 100,
    mileage: 0,
    assignedDriverId: undefined,
  };

  const form = useForm<z.infer<typeof vehicleFormSchema>>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues,
  });

  const handleSubmit = (data: z.infer<typeof vehicleFormSchema>) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="licensePlate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Plate</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC-123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Truck">Truck</SelectItem>
                        <SelectItem value="Van">Van</SelectItem>
                        <SelectItem value="Car">Car</SelectItem>
                        <SelectItem value="Bus">Bus</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Mercedes Actros" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="In Use">In Use</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Out of Service">Out of Service</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastMaintenance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Maintenance</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fuelLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuel Level (%)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mileage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mileage (km)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{vehicle ? 'Update Vehicle' : 'Add Vehicle'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
