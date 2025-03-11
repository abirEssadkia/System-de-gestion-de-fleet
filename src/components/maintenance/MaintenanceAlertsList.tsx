
import React from 'react';
import { MaintenanceAlert } from '@/types/fleet';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  CheckCircle2, 
  Calendar, 
  Gauge, 
  ClipboardCheck, 
  Clock 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface MaintenanceAlertsListProps {
  alerts: MaintenanceAlert[];
  vehicleIds?: Record<string, string>;
  onResolve: (id: string) => void;
}

const getTypeIcon = (type: MaintenanceAlert['type']) => {
  switch (type) {
    case 'Mileage':
      return <Gauge className="h-4 w-4" />;
    case 'TimeInterval':
      return <Clock className="h-4 w-4" />;
    case 'TechnicalControl':
      return <ClipboardCheck className="h-4 w-4" />;
    case 'ScheduledMaintenance':
      return <Calendar className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const getPriorityColor = (priority: MaintenanceAlert['priority']) => {
  switch (priority) {
    case 'Low':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'High':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Critical':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const MaintenanceAlertsList: React.FC<MaintenanceAlertsListProps> = ({ 
  alerts, 
  vehicleIds = {}, 
  onResolve 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy');
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getTimeRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} days`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `${diffDays} days remaining`;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                No maintenance alerts found.
              </TableCell>
            </TableRow>
          ) : (
            alerts.map((alert) => (
              <TableRow key={alert.id} className={alert.isResolved ? 'opacity-50' : ''}>
                <TableCell className="flex items-center font-medium">
                  {getTypeIcon(alert.type)}
                  <span className="ml-2">{alert.type.replace(/([A-Z])/g, ' $1').trim()}</span>
                </TableCell>
                <TableCell>{vehicleIds[alert.vehicleId] || alert.vehicleId}</TableCell>
                <TableCell className="max-w-xs truncate" title={alert.description}>
                  {alert.description}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getPriorityColor(alert.priority)}`}>
                    {alert.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className={isOverdue(alert.dueDate) && !alert.isResolved ? 'text-red-600 font-medium' : ''}>
                      {formatDate(alert.dueDate)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {!alert.isResolved && getTimeRemaining(alert.dueDate)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {alert.isResolved ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      Resolved
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      Active
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {!alert.isResolved && (
                      <Button size="sm" variant="ghost" onClick={() => onResolve(alert.id)}>
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                        Resolve
                      </Button>
                    )}
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
