import React, { useState } from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { VehicleList } from '@/components/vehicles/VehicleList';
import { VehicleForm } from '@/components/vehicles/VehicleForm';
import { Vehicle } from '@/types/fleet';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVehicles, addVehicle, updateVehicle, deleteVehicle } from '@/services/fleetService';
import { Plus, RefreshCw, Filter } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Vehicles = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const queryClient = useQueryClient();
  
  const { data: vehicles = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicles,
  });

  const filteredVehicles = statusFilter === 'all' 
    ? vehicles 
    : vehicles.filter(vehicle => vehicle.status === statusFilter);
  
  const addMutation = useMutation({
    mutationFn: addVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: updateVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setDeleteDialogOpen(false);
    },
  });
  
  const handleAdd = () => {
    setSelectedVehicle(undefined);
    setIsFormOpen(true);
  };
  
  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsFormOpen(true);
  };
  
  const handleDelete = (id: string) => {
    setVehicleToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (vehicleToDelete) {
      deleteMutation.mutate(vehicleToDelete);
    }
  };
  
  const handleFormSubmit = (data: Omit<Vehicle, 'id'> & { id?: string }) => {
    if (data.id) {
      updateMutation.mutate(data as Vehicle);
    } else {
      addMutation.mutate(data);
    }
  };
  
  return (
    <div className="min-h-screen bg-fleet-gray">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-fleet-navy">Vehicle Management</h1>
            <p className="text-fleet-dark-gray">Manage your fleet of vehicles</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-fleet-dark-gray" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="In Use">In Use</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Out of Service">Out of Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        </div>
        
        {isError ? (
          <div className="bg-red-100 p-4 rounded-md text-red-800 mb-6">
            There was an error loading the vehicles. Please try again.
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-fleet-blue border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <VehicleList 
            vehicles={filteredVehicles} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        )}
      </div>
      
      <VehicleForm 
        open={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit}
        vehicle={selectedVehicle}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete this vehicle from the system.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Vehicles;
