
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Calendar, AlertTriangle, Clock } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface MaintenanceStatsProps {
  totalCost: number;
  averageCostPerVehicle: number;
  vehiclesInMaintenance: number;
  totalVehicles: number;
  scheduledMaintenances: number;
  maintenanceTypeData: { type: string; count: number }[];
  costByVehicleType: { name: string; value: number }[];
  maintenanceDuration: { type: string; averageDuration: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const MaintenanceStats: React.FC<MaintenanceStatsProps> = ({
  totalCost,
  averageCostPerVehicle,
  vehiclesInMaintenance,
  totalVehicles,
  scheduledMaintenances,
  maintenanceTypeData,
  costByVehicleType,
  maintenanceDuration
}) => {
  const fleetImpactPercentage = (vehiclesInMaintenance / totalVehicles) * 100;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Maintenance Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCost.toLocaleString()} MAD</div>
            <p className="text-xs text-muted-foreground">
              Average {averageCostPerVehicle.toLocaleString()} MAD per vehicle
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Impact</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehiclesInMaintenance} Vehicles</div>
            <p className="text-xs text-muted-foreground">
              {fleetImpactPercentage.toFixed(1)}% of fleet unavailable
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Maintenance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledMaintenances}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled maintenance tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {maintenanceDuration.length > 0 
                ? (maintenanceDuration.reduce((sum, item) => sum + item.averageDuration, 0) / maintenanceDuration.length).toFixed(1)
                : '0'} days
            </div>
            <p className="text-xs text-muted-foreground">
              Average maintenance completion time
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Type Frequency</CardTitle>
            <CardDescription>Number of maintenance records by type</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maintenanceTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}`, 'Count']} />
                <Bar dataKey="count" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Cost Distribution</CardTitle>
            <CardDescription>Cost breakdown by vehicle type</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costByVehicleType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {costByVehicleType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} MAD`, 'Cost']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Average Maintenance Duration by Type</CardTitle>
          <CardDescription>Average number of days required for each maintenance type</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={maintenanceDuration}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip formatter={(value) => {
                // Ensure value is a number before calling toFixed
                return typeof value === 'number' ? [`${value.toFixed(1)} days`, 'Duration'] : [`${value} days`, 'Duration'];
              }} />
              <Bar dataKey="averageDuration" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
