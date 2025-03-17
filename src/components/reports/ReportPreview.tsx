
import React from 'react';
import { Card } from '@/components/ui/card';
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
  LineChart,
  Line,
  Legend
} from 'recharts';
import { FileText, FileSpreadsheet } from 'lucide-react';
import { format } from 'date-fns';

type ReportFormat = 'pdf' | 'excel';
type ReportType = 'vehicle-status' | 'driver-performance' | 'maintenance-cost' | 'fleet-utilization';

interface ReportPreviewProps {
  reportType: ReportType;
  startDate?: Date;
  endDate?: Date;
  reportFormat: ReportFormat;
}

// Sample data - in a real app, this would come from an API call
const vehicleStatusData = [
  { name: 'Available', value: 45 },
  { name: 'In Use', value: 30 },
  { name: 'Maintenance', value: 15 },
  { name: 'Out of Service', value: 10 },
];

const driverPerformanceData = [
  { name: 'Ahmed', score: 92, trips: 120 },
  { name: 'Fatima', score: 88, trips: 105 },
  { name: 'Youssef', score: 96, trips: 150 },
  { name: 'Amina', score: 84, trips: 90 },
  { name: 'Karim', score: 91, trips: 115 },
  { name: 'Nawal', score: 89, trips: 110 },
];

const maintenanceCostData = [
  { month: 'Jan', cost: 12000 },
  { month: 'Feb', cost: 15000 },
  { month: 'Mar', cost: 18000 },
  { month: 'Apr', cost: 14000 },
  { month: 'May', cost: 13000 },
  { month: 'Jun', cost: 16000 },
];

const fleetUtilizationData = [
  { day: 'Mon', utilization: 65 },
  { day: 'Tue', utilization: 72 },
  { day: 'Wed', utilization: 78 },
  { day: 'Thu', utilization: 76 },
  { day: 'Fri', utilization: 80 },
  { day: 'Sat', utilization: 45 },
  { day: 'Sun', utilization: 30 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const ReportPreview: React.FC<ReportPreviewProps> = ({ 
  reportType, 
  startDate, 
  endDate,
  reportFormat
}) => {
  const getReportTypeName = (type: ReportType): string => {
    switch (type) {
      case 'vehicle-status': return 'Vehicle Status';
      case 'driver-performance': return 'Driver Performance';
      case 'maintenance-cost': return 'Maintenance Cost Analysis';
      case 'fleet-utilization': return 'Fleet Utilization';
      default: return '';
    }
  };

  const getReportIcon = (reportFormat: ReportFormat) => {
    return reportFormat === 'pdf' 
      ? <FileText className="h-6 w-6 text-red-500" /> 
      : <FileSpreadsheet className="h-6 w-6 text-green-500" />;
  };

  const renderPreviewChart = () => {
    switch (reportType) {
      case 'vehicle-status':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vehicleStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {vehicleStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}`, 'Vehicles']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'driver-performance':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={driverPerformanceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="score" name="Performance Score" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="trips" name="Total Trips" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'maintenance-cost':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={maintenanceCostData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value.toLocaleString()} MAD`, 'Cost']} />
              <Legend />
              <Bar dataKey="cost" name="Maintenance Cost (MAD)" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'fleet-utilization':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={fleetUtilizationData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="utilization" 
                name="Fleet Utilization %" 
                stroke="#4f46e5" 
                strokeWidth={2} 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="p-6 md:col-span-2">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          {getReportIcon(reportFormat)}
          <div className="ml-3">
            <h2 className="text-xl font-semibold">{getReportTypeName(reportType)} Report</h2>
            {startDate && endDate && (
              <p className="text-sm text-fleet-dark-gray">
                {format(startDate, "dd MMM yyyy")} - {format(endDate, "dd MMM yyyy")}
              </p>
            )}
          </div>
        </div>
      </div>

      {renderPreviewChart()}
      
      <div className="mt-4 text-sm text-fleet-dark-gray text-center">
        <p>Preview of the report that will be generated</p>
        <p>The actual report will contain more detailed data and analysis</p>
      </div>
    </Card>
  );
};
