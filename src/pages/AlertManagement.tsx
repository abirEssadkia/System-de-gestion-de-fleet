
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, BellRing, AlertTriangle, Clock, CheckCircle, Fuel, Map, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Alert status types
type AlertStatus = 'untreated' | 'in-progress' | 'treated';
type AlertType = 'speed' | 'fuel' | 'activity' | 'geofence' | 'time' | 'all';

// Alert data structure
interface Alert {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  status: AlertStatus;
  comment?: string;
  type: AlertType;
  value?: string;
  vehicleId: string;
  driverName?: string;
  location?: string;
}

const AlertManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const alertTypeParam = queryParams.get('type') as AlertType | null;
  
  // Sample alert data
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      title: "Speed Limit Exceeded",
      description: "Vehicle exceeded speed limit (105 km/h in 80 km/h zone)",
      timestamp: "2023-11-10T09:23:45",
      status: 'untreated',
      type: 'speed',
      value: "105 km/h",
      vehicleId: "FL-7823",
      driverName: "Mohammed Alami",
      location: "N1 Highway, km 45"
    },
    {
      id: 2,
      title: "Fuel Level Critical",
      description: "Vehicle reported critically low fuel level (5%)",
      timestamp: "2023-11-10T10:15:20",
      status: 'in-progress',
      comment: "Driver has been notified to refuel",
      type: 'fuel',
      value: "5%",
      vehicleId: "FL-4567",
      driverName: "Yasmine Benkirane",
      location: "Casablanca, Anfa district"
    },
    {
      id: 3,
      title: "Excessive Idle Time",
      description: "Vehicle has been idle for more than 30 minutes",
      timestamp: "2023-11-10T11:05:12",
      status: 'treated',
      comment: "Driver was on lunch break, confirmed by supervisor",
      type: 'activity',
      value: "45 minutes",
      vehicleId: "FL-9012",
      driverName: "Karim Tazi",
      location: "Rest area, Marrakech highway"
    },
    {
      id: 4,
      title: "Geofence Violation",
      description: "Vehicle left assigned area in Casablanca at 14:30",
      timestamp: "2023-11-10T14:32:18",
      status: 'untreated',
      type: 'geofence',
      value: "500m outside boundary",
      vehicleId: "FL-6547",
      driverName: "Leila Bennani",
      location: "Mohammedia outskirts"
    },
    {
      id: 5,
      title: "Excessive Drive Time",
      description: "Driver exceeded maximum allowed drive time (10 hours)",
      timestamp: "2023-11-09T18:45:30",
      status: 'in-progress',
      comment: "Supervisor contacted driver to take mandatory rest",
      type: 'time',
      value: "10h 35m",
      vehicleId: "FL-3210",
      driverName: "Omar Bouazza",
      location: "Tangier - Agadir route"
    },
    {
      id: 6,
      title: "Speed Limit Exceeded",
      description: "Vehicle exceeded speed limit (95 km/h in 70 km/h zone)",
      timestamp: "2023-11-09T16:12:40",
      status: 'treated',
      comment: "Driver received warning, acknowledged the violation",
      type: 'speed',
      value: "95 km/h",
      vehicleId: "FL-3452",
      driverName: "Fatima Zohra",
      location: "Rabat city center"
    },
    {
      id: 7,
      title: "Geofence Violation",
      description: "Vehicle entered restricted area in Rabat at 09:15",
      timestamp: "2023-11-09T09:17:22",
      status: 'untreated',
      type: 'geofence',
      value: "Unauthorized zone entry",
      vehicleId: "FL-8732",
      driverName: "Hassan Cherkaoui",
      location: "Government restricted area, Rabat"
    },
  ]);

  // State for the currently edited alert
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [commentText, setCommentText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<AlertStatus>('untreated');
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<AlertType>('all');
  
  // Set type filter based on URL parameter
  useEffect(() => {
    if (alertTypeParam && ['speed', 'fuel', 'activity', 'geofence', 'time'].includes(alertTypeParam)) {
      setTypeFilter(alertTypeParam);
    } else {
      setTypeFilter('all');
    }
  }, [alertTypeParam]);

  // Handle the status change
  const handleStatusChange = (alert: Alert, newStatus: AlertStatus) => {
    setEditingAlert(alert);
    setSelectedStatus(newStatus);
    setCommentText(alert.comment || '');
  };

  // Save the alert changes
  const handleSaveChanges = () => {
    if (editingAlert) {
      const updatedAlerts = alerts.map(alert => 
        alert.id === editingAlert.id 
          ? { ...alert, status: selectedStatus, comment: commentText.trim() || undefined } 
          : alert
      );
      
      setAlerts(updatedAlerts);
      setEditingAlert(null);
      setCommentText('');
      
      toast({
        title: "Alert Updated",
        description: `The alert status has been changed to ${selectedStatus.replace('-', ' ')}.`,
      });
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingAlert(null);
    setCommentText('');
  };

  // Filter alerts based on selected status and type
  const filteredAlerts = alerts.filter(alert => {
    const statusMatch = statusFilter === 'all' || alert.status === statusFilter;
    const typeMatch = typeFilter === 'all' || alert.type === typeFilter;
    return statusMatch && typeMatch;
  });

  // Get status icon and color
  const getStatusInfo = (status: AlertStatus) => {
    switch(status) {
      case 'untreated':
        return { icon: <AlertTriangle className="w-5 h-5" />, color: 'text-red-500 bg-red-50' };
      case 'in-progress':
        return { icon: <Clock className="w-5 h-5" />, color: 'text-amber-500 bg-amber-50' };
      case 'treated':
        return { icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-500 bg-green-50' };
    }
  };

  // Get alert type icon
  const getAlertTypeIcon = (type: AlertType) => {
    switch(type) {
      case 'speed':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'fuel':
        return <Fuel className="w-5 h-5 text-amber-500" />;
      case 'activity':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'geofence':
        return <Map className="w-5 h-5 text-red-500" />;
      case 'time':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <BellRing className="w-5 h-5 text-gray-500" />;
    }
  };
  
  // Get alert type name
  const getAlertTypeName = (type: AlertType) => {
    switch(type) {
      case 'speed': return 'Speed';
      case 'fuel': return 'Fuel';
      case 'activity': return 'Activity';
      case 'geofence': return 'Geofence';
      case 'time': return 'Drive Time';
      default: return 'All Types';
    }
  };

  return (
    <div className="min-h-screen bg-fleet-gray">
      <div className="bg-fleet-navy text-white p-4 shadow-sm">
        <div className="container mx-auto flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="mr-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Alert Management</h1>
          {typeFilter !== 'all' && (
            <div className="ml-4 bg-white/10 px-3 py-1 rounded-full text-sm flex items-center">
              {getAlertTypeIcon(typeFilter)}
              <span className="ml-2">{getAlertTypeName(typeFilter)} Alerts</span>
            </div>
          )}
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm mb-6 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-fleet-navy">Fleet Alerts</h2>
              <p className="text-fleet-dark-gray">
                {typeFilter !== 'all' 
                  ? `Manage and respond to ${getAlertTypeName(typeFilter).toLowerCase()} alerts` 
                  : 'Manage and respond to system alerts'}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 space-y-3 md:space-y-0">
              {/* Alert Type Filter */}
              <div className="flex space-x-2 mb-3 md:mb-0 md:justify-end">
                <button 
                  onClick={() => setTypeFilter('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    typeFilter === 'all' 
                      ? 'bg-fleet-navy text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Types
                </button>
                <button 
                  onClick={() => setTypeFilter('speed')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    typeFilter === 'speed' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Speed
                </button>
                <button 
                  onClick={() => setTypeFilter('fuel')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    typeFilter === 'fuel' 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Fuel
                </button>
                <button 
                  onClick={() => setTypeFilter('activity')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    typeFilter === 'activity' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Activity
                </button>
                <button 
                  onClick={() => setTypeFilter('geofence')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    typeFilter === 'geofence' 
                      ? 'bg-violet-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Geofence
                </button>
                <button 
                  onClick={() => setTypeFilter('time')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    typeFilter === 'time' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Drive Time
                </button>
              </div>
              
              {/* Status Filter */}
              <div className="flex space-x-2">
                <button 
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    statusFilter === 'all' 
                      ? 'bg-fleet-navy text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button 
                  onClick={() => setStatusFilter('untreated')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    statusFilter === 'untreated' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Untreated
                </button>
                <button 
                  onClick={() => setStatusFilter('in-progress')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    statusFilter === 'in-progress' 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  In Progress
                </button>
                <button 
                  onClick={() => setStatusFilter('treated')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    statusFilter === 'treated' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Treated
                </button>
              </div>
            </div>
          </div>
          
          {/* Alerts list */}
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8">
                <BellRing className="w-12 h-12 mx-auto text-gray-300" />
                <p className="mt-2 text-gray-500">No alerts found with the selected filter</p>
              </div>
            ) : (
              filteredAlerts.map(alert => (
                <div 
                  key={alert.id}
                  className={`border rounded-lg p-4 ${
                    alert.status === 'untreated' 
                      ? 'border-red-200 bg-red-50' 
                      : alert.status === 'in-progress'
                        ? 'border-amber-200 bg-amber-50'
                        : 'border-green-200 bg-green-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <div className={`p-1 rounded mr-2 ${getStatusInfo(alert.status).color}`}>
                          {getStatusInfo(alert.status).icon}
                        </div>
                        <h3 className="font-semibold text-fleet-navy">{alert.title}</h3>
                        <div className="ml-2 bg-gray-100 text-xs rounded-full px-2 py-1 flex items-center">
                          {getAlertTypeIcon(alert.type)}
                          <span className="ml-1">{getAlertTypeName(alert.type)}</span>
                        </div>
                        {alert.value && (
                          <div className="ml-2 font-semibold text-red-600">{alert.value}</div>
                        )}
                      </div>
                      <p className="text-fleet-dark-gray mb-2">{alert.description}</p>
                      
                      {/* Additional Alert Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 bg-white p-3 rounded border border-gray-200">
                        <div>
                          <div className="text-xs text-gray-500">Vehicle ID</div>
                          <div className="font-medium">{alert.vehicleId}</div>
                        </div>
                        {alert.driverName && (
                          <div>
                            <div className="text-xs text-gray-500">Driver</div>
                            <div className="font-medium">{alert.driverName}</div>
                          </div>
                        )}
                        {alert.location && (
                          <div>
                            <div className="text-xs text-gray-500">Location</div>
                            <div className="font-medium">{alert.location}</div>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-500 mt-3">
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                      
                      {alert.comment && (
                        <div className="mt-2 bg-white p-3 rounded border border-gray-200">
                          <div className="text-sm font-medium text-gray-700">Comment:</div>
                          <p className="text-sm text-gray-600">{alert.comment}</p>
                        </div>
                      )}
                    </div>
                    
                    {editingAlert?.id !== alert.id && (
                      <div className="flex space-x-2 ml-4">
                        <button 
                          onClick={() => handleStatusChange(alert, 'untreated')}
                          className={`text-xs px-3 py-1 rounded ${
                            alert.status === 'untreated' 
                              ? 'bg-red-500 text-white' 
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Untreated
                        </button>
                        <button 
                          onClick={() => handleStatusChange(alert, 'in-progress')}
                          className={`text-xs px-3 py-1 rounded ${
                            alert.status === 'in-progress' 
                              ? 'bg-amber-500 text-white' 
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          In Progress
                        </button>
                        <button 
                          onClick={() => handleStatusChange(alert, 'treated')}
                          className={`text-xs px-3 py-1 rounded ${
                            alert.status === 'treated' 
                              ? 'bg-green-500 text-white' 
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Treated
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Edit form */}
                  {editingAlert?.id === alert.id && (
                    <div className="mt-4 border-t pt-4">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Alert Status
                        </label>
                        <div className="flex space-x-3">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              className="form-radio h-4 w-4 text-red-600"
                              checked={selectedStatus === 'untreated'}
                              onChange={() => setSelectedStatus('untreated')}
                            />
                            <span className="ml-2 text-sm text-gray-700">Untreated</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              className="form-radio h-4 w-4 text-amber-500"
                              checked={selectedStatus === 'in-progress'}
                              onChange={() => setSelectedStatus('in-progress')}
                            />
                            <span className="ml-2 text-sm text-gray-700">In Progress</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              className="form-radio h-4 w-4 text-green-600"
                              checked={selectedStatus === 'treated'}
                              onChange={() => setSelectedStatus('treated')}
                            />
                            <span className="ml-2 text-sm text-gray-700">Treated</span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Comment
                        </label>
                        <textarea
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fleet-blue"
                          rows={3}
                          placeholder="Add a comment about this alert..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        ></textarea>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveChanges}
                          className="px-4 py-2 bg-fleet-navy text-white rounded-md text-sm font-medium hover:bg-fleet-blue"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AlertManagement;
