
export interface Point {
  lat: number;
  lng: number;
  description?: string;
  type?: 'speed' | 'fuel' | 'activity' | 'geofence' | 'time';
}

export interface FilterOptions {
  startDate?: Date;
  endDate?: Date;
  selectedVehicles: string[];
  statusFilters: {
    running: boolean;
    idle: boolean;
    stopped: boolean;
  };
  speedThreshold: string;
  selectedZone: string;
  chartType: string;
  alertType: 'speed' | 'fuel' | 'activity' | 'geofence' | 'time' | 'all';
}
