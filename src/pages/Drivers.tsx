
import React, { useState } from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { DriverList } from '@/components/drivers/DriverList';
import { DriverForm } from '@/components/drivers/DriverForm';
import { Driver } from '@/types/fleet';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDrivers, addDriver, updateDriver, deleteDriver } from '@/services/fleetService';
import { Plus, RefreshCw } from 'lucide-react';
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

const Drivers = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  
  const { data: drivers = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['drivers'],
    queryFn: getDrivers,
  });
  
  const addMutation = useMutation({
    mutationFn: addDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: updateDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      setDeleteDialogOpen(false);
    },
  });
  
  const handleAdd = () => {
    setSelectedDriver(undefined);
    setIsFormOpen(true);
  };
  
  const handleEdit = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsFormOpen(true);
  };
  
  const handleDelete = (id: string) => {
    setDriverToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (driverToDelete) {
      deleteMutation.mutate(driverToDelete);
    }
  };
  
  const handleFormSubmit = (data: Omit<Driver, 'id'> & { id?: string }) => {
    if (data.id) {
      updateMutation.mutate(data as Driver);
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
            <h1 className="text-2xl font-bold text-fleet-navy">Driver Management</h1>
            <p className="text-fleet-dark-gray">Manage your team of drivers</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Driver
            </Button>
          </div>
        </div>
        
        {isError ? (
          <div className="bg-red-100 p-4 rounded-md text-red-800 mb-6">
            There was an error loading the drivers. Please try again.
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-fleet-blue border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <DriverList 
            drivers={drivers} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        )}
      </div>
      
      <DriverForm 
        open={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit}
        driver={selectedDriver}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete this driver from the system.
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

export default Drivers;
