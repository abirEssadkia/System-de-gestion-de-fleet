
export type AlertType = 'speed' | 'fuel' | 'activity' | 'geofence' | 'time' | 'all';

export interface Alert {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  status: 'untreated' | 'in-progress' | 'treated';
  comment?: string;
  type: 'speed' | 'fuel' | 'activity' | 'geofence' | 'time';
  value?: string;
  vehicleId: string;
  driverName?: string;
  location?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Morocco map coordinates for different regions
export const alerts: Alert[] = [
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
    location: "N1 Highway, km 45",
    coordinates: {
      lat: 33.9716,
      lng: -6.8498
    }
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
    location: "Casablanca, Anfa district",
    coordinates: {
      lat: 33.5731,
      lng: -7.5898
    }
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
    location: "Rest area, Marrakech highway",
    coordinates: {
      lat: 31.6295,
      lng: -7.9811
    }
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
    location: "Mohammedia outskirts",
    coordinates: {
      lat: 33.6835,
      lng: -7.3862
    }
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
    location: "Tangier - Agadir route",
    coordinates: {
      lat: 35.7595,
      lng: -5.8340
    }
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
    location: "Rabat city center",
    coordinates: {
      lat: 34.0209,
      lng: -6.8416
    }
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
    location: "Government restricted area, Rabat",
    coordinates: {
      lat: 34.0135,
      lng: -6.8326
    }
  },
];

// Generate alert points for maps based on type
export const getAlertPointsByType = (type: AlertType = 'all') => {
  const filteredAlerts = type === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.type === type);
  
  return filteredAlerts.map(alert => ({
    lat: alert.coordinates?.lat || 0,
    lng: alert.coordinates?.lng || 0,
    description: `${alert.title} (${alert.vehicleId}): ${alert.description}`,
    type: alert.type
  }));
};

// Group alerts by type for the dashboard cards
export const getGroupedAlertPoints = () => {
  const types: ('speed' | 'fuel' | 'activity' | 'geofence' | 'time')[] = [
    'speed', 'fuel', 'activity', 'geofence', 'time'
  ];
  
  const result: Record<string, { title: string, points: Array<{lat: number, lng: number, description?: string}> }> = {};
  
  types.forEach(type => {
    const points = getAlertPointsByType(type);
    let title = '';
    
    switch(type) {
      case 'speed':
        title = 'Speed Alerts';
        break;
      case 'fuel':
        title = 'Fuel Alerts';
        break;
      case 'activity':
        title = 'Activity Alerts';
        break;
      case 'geofence':
        title = 'Geofence Alerts';
        break;
      case 'time':
        title = 'Drive Time Alerts';
        break;
    }
    
    if (points.length > 0) {
      result[type] = { title, points };
    }
  });
  
  return result;
};
