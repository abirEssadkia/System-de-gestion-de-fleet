
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BellRing, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

// Alert status types
type AlertStatus = 'untreated' | 'in-progress' | 'treated';

// Alert data structure
interface Alert {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  status: AlertStatus;
  comment?: string;
  type: 'speed' | 'fuel' | 'activity' | 'geofence' | 'time';
}

const AlertManagement = () => {
  const navigate = useNavigate();
  
  // Sample alert data
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      title: "Speed Limit Exceeded",
      description: "Vehicle ID: FL-7823 exceeded speed limit (105 km/h in 80 km/h zone)",
      timestamp: "2023-11-10T09:23:45",
      status: 'untreated',
      type: 'speed'
    },
    {
      id: 2,
      title: "Fuel Level Critical",
      description: "Vehicle ID: FL-4567 reported critically low fuel level (5%)",
      timestamp: "2023-11-10T10:15:20",
      status: 'in-progress',
      comment: "Driver has been notified to refuel",
      type: 'fuel'
    },
    {
      id: 3,
      title: "Excessive Idle Time",
      description: "Vehicle ID: FL-9012 has been idle for more than 30 minutes",
      timestamp: "2023-11-10T11:05:12",
      status: 'treated',
      comment: "Driver was on lunch break, confirmed by supervisor",
      type: 'activity'
    },
    {
      id: 4,
      title: "Geofence Violation",
      description: "Vehicle ID: FL-6547 left assigned area in Casablanca at 14:30",
      timestamp: "2023-11-10T14:32:18",
      status: 'untreated',
      type: 'geofence'
    },
    {
      id: 5,
      title: "Excessive Drive Time",
      description: "Driver ID: D-1234 exceeded maximum allowed drive time (10 hours)",
      timestamp: "2023-11-09T18:45:30",
      status: 'in-progress',
      comment: "Supervisor contacted driver to take mandatory rest",
      type: 'time'
    },
    {
      id: 6,
      title: "Speed Limit Exceeded",
      description: "Vehicle ID: FL-3452 exceeded speed limit (95 km/h in 70 km/h zone)",
      timestamp: "2023-11-09T16:12:40",
      status: 'treated',
      comment: "Driver received warning, acknowledged the violation",
      type: 'speed'
    },
    {
      id: 7,
      title: "Geofence Violation",
      description: "Vehicle ID: FL-8732 entered restricted area in Rabat at 09:15",
      timestamp: "2023-11-09T09:17:22",
      status: 'untreated',
      type: 'geofence'
    },
  ]);

  // State for the currently edited alert
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [commentText, setCommentText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<AlertStatus>('untreated');
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'all'>('all');

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
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingAlert(null);
    setCommentText('');
  };

  // Filter alerts based on selected status
  const filteredAlerts = statusFilter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.status === statusFilter);

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
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm mb-6 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-fleet-navy">Fleet Alerts</h2>
              <p className="text-fleet-dark-gray">Manage and respond to system alerts</p>
            </div>
            
            <div className="mt-4 md:mt-0">
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
                      </div>
                      <p className="text-fleet-dark-gray mb-2">{alert.description}</p>
                      <div className="text-sm text-gray-500">
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
