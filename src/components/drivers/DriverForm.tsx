
import React, { useEffect } from 'react';
import { Driver } from '@/types/fleet';
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

interface DriverFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Driver, 'id'> & { id?: string }) => void;
  driver?: Driver;
}

const driverFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  status: z.enum(['Available', 'On Duty', 'Off Duty', 'On Leave'], { required_error: 'Status is required' }),
  license: z.string().min(1, 'License number is required'),
  licenseExpiry: z.string().min(1, 'License expiry date is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  rating: z.coerce.number().min(0, 'Rating must be at least 0').max(5, 'Rating must be at most 5'),
  assignedVehicleId: z.string().optional(),
  totalTrips: z.coerce.number().min(0, 'Total trips must be at least 0'),
  hireDate: z.string().min(1, 'Hire date is required'),
});

export const DriverForm: React.FC<DriverFormProps> = ({ open, onClose, onSubmit, driver }) => {
  const form = useForm<z.infer<typeof driverFormSchema>>({
    resolver: zodResolver(driverFormSchema),
    defaultValues: {
      id: '',
      name: '',
      status: 'Available',
      license: '',
      licenseExpiry: '',
      phone: '',
      email: '',
      rating: 5.0,
      totalTrips: 0,
      hireDate: new Date().toISOString().split('T')[0],
      assignedVehicleId: '',
    },
  });

  // Reset form when driver prop changes or dialog opens/closes
  useEffect(() => {
    if (open) {
      if (driver) {
        // Editing existing driver - populate with driver data
        form.reset({
          id: driver.id,
          name: driver.name,
          status: driver.status,
          license: driver.license,
          licenseExpiry: driver.licenseExpiry,
          phone: driver.phone,
          email: driver.email,
          rating: driver.rating,
          totalTrips: driver.totalTrips,
          hireDate: driver.hireDate,
          assignedVehicleId: driver.assignedVehicleId || '',
        });
      } else {
        // Adding new driver - reset to defaults
        form.reset({
          id: '',
          name: '',
          status: 'Available',
          license: '',
          licenseExpiry: '',
          phone: '',
          email: '',
          rating: 5.0,
          totalTrips: 0,
          hireDate: new Date().toISOString().split('T')[0],
          assignedVehicleId: '',
        });
      }
    }
  }, [driver, open, form]);

  const handleSubmit = (data: z.infer<typeof driverFormSchema>) => {
    // Ensure all required fields are present
    const driverData: Omit<Driver, 'id'> & { id?: string } = {
      name: data.name,
      status: data.status,
      license: data.license,
      licenseExpiry: data.licenseExpiry,
      phone: data.phone,
      email: data.email,
      rating: data.rating,
      totalTrips: data.totalTrips,
      hireDate: data.hireDate,
      assignedVehicleId: data.assignedVehicleId,
    };
    
    // Include id if it exists (for editing)
    if (data.id) {
      driverData.id = data.id;
    }
    
    onSubmit(driverData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{driver ? 'Edit Driver' : 'Add New Driver'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="On Duty">On Duty</SelectItem>
                        <SelectItem value="Off Duty">Off Duty</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="license"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Number</FormLabel>
                    <FormControl>
                      <Input placeholder="DL-12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="licenseExpiry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Expiry Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+212 612 345 678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (0-5)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="5" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalTrips"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Trips</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hireDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hire Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{driver ? 'Update Driver' : 'Add Driver'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
