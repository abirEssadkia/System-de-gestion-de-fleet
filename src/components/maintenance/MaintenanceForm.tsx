
import React, { useEffect } from 'react';
import { MaintenanceRecord, Vehicle } from '@/types/fleet';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface MaintenanceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<MaintenanceRecord, 'id'> & { id?: string }) => void;
  record?: MaintenanceRecord;
  vehicles: Vehicle[];
}

const maintenanceFormSchema = z.object({
  id: z.string().optional(),
  vehicleId: z.string({ required_error: "Please select a vehicle" }),
  type: z.enum(['Routine', 'Repair', 'Inspection', 'Technical Control'], { 
    required_error: "Please select a maintenance type" 
  }),
  startDate: z.string({ required_error: "Start date is required" }),
  endDate: z.string().optional(),
  status: z.enum(['Scheduled', 'In Progress', 'Completed', 'Cancelled'], { 
    required_error: "Please select a status" 
  }),
  description: z.string({ required_error: "Description is required" })
    .min(5, { message: "Description must be at least 5 characters" }),
  cost: z.coerce.number({ required_error: "Cost is required" })
    .min(0, { message: "Cost cannot be negative" }),
  technician: z.string({ required_error: "Technician name is required" })
    .min(2, { message: "Technician name must be at least 2 characters" }),
  notes: z.string().optional(),
});

export const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  record, 
  vehicles 
}) => {
  const form = useForm<z.infer<typeof maintenanceFormSchema>>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      id: '',
      vehicleId: '',
      type: 'Routine',
      startDate: new Date().toISOString().split('T')[0],
      status: 'Scheduled',
      description: '',
      cost: 0,
      technician: '',
      notes: '',
      endDate: ''
    },
  });

  // Reset form when record prop changes or dialog opens/closes
  useEffect(() => {
    if (open) {
      if (record) {
        // Editing existing record - populate with record data
        form.reset({
          id: record.id,
          vehicleId: record.vehicleId,
          type: record.type,
          startDate: record.startDate,
          status: record.status,
          description: record.description,
          cost: record.cost,
          technician: record.technician,
          notes: record.notes || '',
          endDate: record.endDate || ''
        });
      } else {
        // Adding new record - reset to defaults
        form.reset({
          id: '',
          vehicleId: '',
          type: 'Routine',
          startDate: new Date().toISOString().split('T')[0],
          status: 'Scheduled',
          description: '',
          cost: 0,
          technician: '',
          notes: '',
          endDate: ''
        });
      }
    }
  }, [record, open, form]);

  const handleSubmit = (data: z.infer<typeof maintenanceFormSchema>) => {
    // Ensure all required fields are present and properly typed
    const maintenanceData: Omit<MaintenanceRecord, 'id'> & { id?: string } = {
      vehicleId: data.vehicleId,
      type: data.type,
      startDate: data.startDate,
      status: data.status,
      description: data.description,
      cost: Number(data.cost),
      technician: data.technician,
      notes: data.notes || undefined,
      endDate: data.endDate || undefined
    };
    
    // Include id if it exists (for editing)
    if (data.id) {
      maintenanceData.id = data.id;
    }
    
    onSubmit(maintenanceData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{record ? 'Edit Maintenance Record' : 'Add New Maintenance Record'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="vehicleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={!!record} // Disable if editing existing record
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a vehicle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.licensePlate} - {vehicle.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maintenance Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Routine">Routine</SelectItem>
                        <SelectItem value="Repair">Repair</SelectItem>
                        <SelectItem value="Inspection">Inspection</SelectItem>
                        <SelectItem value="Technical Control">Technical Control</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date (if completed)</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        value={field.value || ''} 
                      />
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost (MAD)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        {...field} 
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="technician"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technician</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the maintenance work..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional notes or observations..." 
                      className="resize-none" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {record ? 'Update Record' : 'Add Record'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
