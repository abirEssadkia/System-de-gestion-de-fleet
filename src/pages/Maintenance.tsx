
import React, { useState } from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MaintenanceRecord, MaintenanceAlert, Vehicle } from '@/types/fleet';
import { 
  getMaintenanceRecords, 
  getMaintenanceAlerts, 
  getActiveMaintenances,
  getScheduledMaintenances,
  addMaintenanceRecord,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
  resolveMaintenanceAlert,
  getMaintenanceTypeFrequency,
  getMaintenanceDurationStats,
  getTotalMaintenanceCost,
  getAverageMaintenanceCostPerVehicle
} from '@/services/maintenanceService';
import { getVehicles } from '@/services/fleetService';
import { MaintenanceList } from '@/components/maintenance/MaintenanceList';
import { MaintenanceForm } from '@/components/maintenance/MaintenanceForm';
import { MaintenanceAlertsList } from '@/components/maintenance/MaintenanceAlertsList';
import { MaintenanceStats } from '@/components/maintenance/MaintenanceStats';
import { Plus, RefreshCw, Wrench, AlertTriangle, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const Maintenance = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  
  // Fetch all data
  const { data: allRecords = [], isLoading: isLoadingRecords } = useQuery({
    queryKey: ['maintenanceRecords'],
    queryFn: getMaintenanceRecords,
  });
  
  const { data: alerts = [], isLoading: isLoadingAlerts } = useQuery({
    queryKey: ['maintenanceAlerts'],
    queryFn: getMaintenanceAlerts,
  });
  
  const { data: activeMaintenances = [] } = useQuery({
    queryKey: ['activeMaintenances'],
    queryFn: getActiveMaintenances,
  });
  
  const { data: scheduledMaintenances = [] } = useQuery({
    queryKey: ['scheduledMaintenances'],
    queryFn: getScheduledMaintenances,
  });
  
  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicles,
  });
  
  const { data: typesFrequency = [] } = useQuery({
    queryKey: ['maintenanceTypeFrequency'],
    queryFn: getMaintenanceTypeFrequency,
  });
  
  const { data: durationStats = [] } = useQuery({
    queryKey: ['maintenanceDurationStats'],
    queryFn: getMaintenanceDurationStats,
  });
  
  const { data: totalCost = 0 } = useQuery({
    queryKey: ['totalMaintenanceCost'],
    queryFn: getTotalMaintenanceCost,
  });
  
  const { data: averageCostPerVehicle = 0 } = useQuery({
    queryKey: ['averageMaintenanceCostPerVehicle'],
    queryFn: getAverageMaintenanceCostPerVehicle,
  });
  
  // Mutations
  const addMutation = useMutation({
    mutationFn: addMaintenanceRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenanceRecords'] });
      queryClient.invalidateQueries({ queryKey: ['activeMaintenances'] });
      queryClient.invalidateQueries({ queryKey: ['scheduledMaintenances'] });
      queryClient.invalidateQueries({ queryKey: ['maintenanceTypeFrequency'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: updateMaintenanceRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenanceRecords'] });
      queryClient.invalidateQueries({ queryKey: ['activeMaintenances'] });
      queryClient.invalidateQueries({ queryKey: ['scheduledMaintenances'] });
      queryClient.invalidateQueries({ queryKey: ['maintenanceDurationStats'] });
      queryClient.invalidateQueries({ queryKey: ['totalMaintenanceCost'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteMaintenanceRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenanceRecords'] });
      queryClient.invalidateQueries({ queryKey: ['activeMaintenances'] });
      queryClient.invalidateQueries({ queryKey: ['scheduledMaintenances'] });
      queryClient.invalidateQueries({ queryKey: ['maintenanceTypeFrequency'] });
      setDeleteDialogOpen(false);
    },
  });
  
  const resolveAlertMutation = useMutation({
    mutationFn: resolveMaintenanceAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenanceAlerts'] });
    },
  });
  
  // Handlers
  const handleAdd = () => {
    setSelectedRecord(undefined);
    setIsFormOpen(true);
  };
  
  const handleEdit = (record: MaintenanceRecord) => {
    setSelectedRecord(record);
    setIsFormOpen(true);
  };
  
  const handleDelete = (id: string) => {
    setRecordToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (recordToDelete) {
      deleteMutation.mutate(recordToDelete);
    }
  };
  
  const handleFormSubmit = (data: Omit<MaintenanceRecord, 'id'> & { id?: string }) => {
    if (data.id) {
      updateMutation.mutate(data as MaintenanceRecord);
    } else {
      addMutation.mutate(data);
    }
    setIsFormOpen(false);
  };
  
  const handleResolveAlert = (id: string) => {
    resolveAlertMutation.mutate(id);
  };
  
  const handleCompleteRecord = (id: string) => {
    const record = allRecords.find(r => r.id === id);
    if (record) {
      updateMutation.mutate({
        ...record,
        status: 'Completed',
        endDate: new Date().toISOString().split('T')[0]
      });
    }
  };
  
  const vehicleIdToPlate: Record<string, string> = {};
  vehicles.forEach(v => {
    vehicleIdToPlate[v.id] = v.licensePlate;
  });
  
  // Stats for the overview
  const activeVehiclesCount = vehicles.filter(v => v.status === 'Maintenance').length;
  const totalVehiclesCount = vehicles.length;
  
  // Cost by vehicle type
  const costByVehicleType = [
    { name: 'Truck', value: 0 },
    { name: 'Van', value: 0 },
    { name: 'Car', value: 0 },
    { name: 'Bus', value: 0 }
  ];
  
  allRecords.forEach(record => {
    if (record.status === 'Completed') {
      const vehicle = vehicles.find(v => v.id === record.vehicleId);
      if (vehicle) {
        const typeIndex = costByVehicleType.findIndex(item => item.name === vehicle.type);
        if (typeIndex !== -1) {
          costByVehicleType[typeIndex].value += record.cost;
        }
      }
    }
  });
  
  // Remove any vehicle types with zero value
  const filteredCostByVehicleType = costByVehicleType.filter(item => item.value > 0);
  
  return (
    <div className="min-h-screen bg-fleet-gray">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-fleet-navy">Maintenance Management</h1>
            <p className="text-fleet-dark-gray">Track and manage vehicle maintenance</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => {
              queryClient.invalidateQueries();
            }}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Maintenance
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="overview" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="current" className="flex items-center">
              <Wrench className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Current Maintenance</span>
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Scheduled</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <MaintenanceStats 
              totalCost={totalCost}
              averageCostPerVehicle={averageCostPerVehicle}
              vehiclesInMaintenance={activeVehiclesCount}
              totalVehicles={totalVehiclesCount}
              scheduledMaintenances={scheduledMaintenances.length}
              maintenanceTypeData={typesFrequency}
              costByVehicleType={filteredCostByVehicleType}
              maintenanceDuration={durationStats}
            />
          </TabsContent>
          
          <TabsContent value="current">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-fleet-navy">Current Maintenance</h2>
              <p className="text-fleet-dark-gray mb-4">Vehicles currently undergoing maintenance</p>
              
              {isLoadingRecords ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-fleet-blue border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <MaintenanceList 
                  records={activeMaintenances}
                  vehicleIds={vehicleIdToPlate}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onComplete={handleCompleteRecord}
                />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="scheduled">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-fleet-navy">Scheduled Maintenance</h2>
              <p className="text-fleet-dark-gray mb-4">Upcoming maintenance tasks</p>
              
              {isLoadingRecords ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-fleet-blue border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <MaintenanceList 
                  records={scheduledMaintenances}
                  vehicleIds={vehicleIdToPlate}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="alerts">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-fleet-navy">Maintenance Alerts</h2>
              <p className="text-fleet-dark-gray mb-4">Notifications for preventive maintenance and required services</p>
              
              {isLoadingAlerts ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-fleet-blue border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <MaintenanceAlertsList 
                  alerts={alerts.filter(a => !a.isResolved)}
                  vehicleIds={vehicleIdToPlate}
                  onResolve={handleResolveAlert}
                />
              )}
              
              {alerts.some(a => a.isResolved) && (
                <>
                  <h3 className="text-lg font-semibold text-fleet-navy mt-8">Resolved Alerts</h3>
                  <MaintenanceAlertsList 
                    alerts={alerts.filter(a => a.isResolved)}
                    vehicleIds={vehicleIdToPlate}
                    onResolve={handleResolveAlert}
                  />
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-fleet-navy mb-4">Maintenance History</h2>
          {isLoadingRecords ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-fleet-blue border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <MaintenanceList 
              records={allRecords}
              vehicleIds={vehicleIdToPlate}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
      
      <MaintenanceForm 
        open={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit}
        record={selectedRecord}
        vehicles={vehicles}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete this maintenance record from the system.
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

export default Maintenance;
