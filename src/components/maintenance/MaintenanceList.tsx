
import React from 'react';
import { MaintenanceRecord } from '@/types/fleet';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, CheckCircle2, ClipboardList, Wrench, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface MaintenanceListProps {
  records: MaintenanceRecord[];
  vehicleIds?: Record<string, string>;
  onEdit: (record: MaintenanceRecord) => void;
  onDelete: (id: string) => void;
  onComplete?: (id: string) => void;
}

const getStatusColor = (status: MaintenanceRecord['status']) => {
  switch (status) {
    case 'Scheduled':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'In Progress':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getTypeIcon = (type: MaintenanceRecord['type']) => {
  switch (type) {
    case 'Routine':
      return <ClipboardList className="h-4 w-4" />;
    case 'Repair':
      return <Wrench className="h-4 w-4" />;
    case 'Inspection':
      return <CheckCircle2 className="h-4 w-4" />;
    case 'Technical Control':
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return <ClipboardList className="h-4 w-4" />;
  }
};

export const MaintenanceList: React.FC<MaintenanceListProps> = ({ 
  records, 
  vehicleIds = {}, 
  onEdit, 
  onDelete, 
  onComplete 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy');
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Cost (MAD)</TableHead>
            <TableHead>Technician</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                No maintenance records found.
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="flex items-center font-medium">
                  {getTypeIcon(record.type)}
                  <span className="ml-2">{record.type}</span>
                </TableCell>
                <TableCell>{vehicleIds[record.vehicleId] || record.vehicleId}</TableCell>
                <TableCell className="max-w-xs truncate" title={record.description}>
                  {record.description}
                </TableCell>
                <TableCell>{formatDate(record.startDate)}</TableCell>
                <TableCell>{record.endDate ? formatDate(record.endDate) : '-'}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getStatusColor(record.status)}`}>
                    {record.status}
                  </Badge>
                </TableCell>
                <TableCell>{record.cost.toLocaleString()}</TableCell>
                <TableCell>{record.technician}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {record.status === 'In Progress' && onComplete && (
                      <Button size="icon" variant="ghost" onClick={() => onComplete(record.id)} title="Mark as Completed">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" onClick={() => onEdit(record)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onDelete(record.id)}>
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
