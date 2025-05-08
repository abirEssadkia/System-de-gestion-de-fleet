
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { getAlertPointsByType, alerts as allAlerts } from '@/utils/alertsData';
import { FilterPanel, FilterOptions } from '@/components/dashboard/FilterPanel';

// Import the refactored components
import { MapWrapper } from '@/components/map-detail-view/MapWrapper';
import { LocationDetails } from '@/components/map-detail-view/LocationDetails';
import { useMapCoordinates } from '@/components/map-detail-view/MapCoordinates';
import { useMapPointsFilter } from '@/components/map-detail-view/MapPointsFilter';
import { Point, FilterOptions as FilterOptionsType } from '@/components/map-detail-view/types';

const MapDetailView = () => {
  const [searchParams] = useSearchParams();
  const [rawMapPoints, setRawMapPoints] = useState<Point[]>([]);
  const [title, setTitle] = useState('');
  const [alertType, setAlertType] = useState<'speed' | 'fuel' | 'activity' | 'geofence' | 'time' | 'all'>('all');
  const [filters, setFilters] = useState<FilterOptionsType>({
    selectedVehicles: [],
    statusFilters: {
      running: true,
      idle: true,
      stopped: true,
    },
    speedThreshold: '',
    selectedZone: '',
    chartType: 'line',
    alertType: 'all',
  });
  const navigate = useNavigate();
  
  useEffect(() => {
    const title = searchParams.get('title');
    const dataString = searchParams.get('data');
    const typeParam = searchParams.get('type') as 'speed' | 'fuel' | 'activity' | 'geofence' | 'time' | 'all' || 'all';
    
    setAlertType(typeParam);
    setFilters(prev => ({
      ...prev,
      alertType: typeParam
    }));
    
    if (title) {
      setTitle(title);
    }
    
    if (dataString) {
      try {
        const data = JSON.parse(dataString);
        if (Array.isArray(data) && data.length > 0) {
          setRawMapPoints(data);
        } else {
          // If no valid data, use the alert data
          setRawMapPoints(getAlertPointsByType(typeParam));
        }
      } catch (error) {
        console.error('Error parsing map data', error);
        // Fallback to alert data
        setRawMapPoints(getAlertPointsByType(typeParam));
      }
    } else {
      // If no data parameter, use the alert data
      setRawMapPoints(getAlertPointsByType(typeParam));
    }
  }, [searchParams]);

  // Use our filtered points hook
  const mapPoints = useMapPointsFilter({
    rawMapPoints,
    filters,
    alertType,
    allAlerts
  });

  const handleGoBack = () => {
    navigate('/alert-management');
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    if (newFilters.alertType !== filters.alertType) {
      setAlertType(newFilters.alertType || 'all');
    }
  };

  // Use our map coordinates hook
  const { getMapCenter, getBoundsZoom } = useMapCoordinates(mapPoints);
  
  return (
    <div className="min-h-screen bg-fleet-gray p-6">
      <div className="container mx-auto">
        <button 
          onClick={handleGoBack}
          className="flex items-center text-fleet-navy hover:text-fleet-blue mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Alert Management
        </button>
        
        <h1 className="text-2xl font-bold text-fleet-navy mb-2">{title || 'Alert Map'}</h1>
        <p className="text-fleet-dark-gray mb-6">
          Detailed view of alerts {alertType !== 'all' ? `of type ${alertType}` : ''} on the map
        </p>
        
        {/* Add FilterPanel */}
        <FilterPanel onFilterChange={handleFilterChange} />
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          {/* Large Map View */}
          <div className="w-full h-[600px] mx-auto relative rounded-lg overflow-hidden border border-gray-200">
            {mapPoints.length > 0 ? (
              <MapWrapper 
                mapPoints={mapPoints}
                center={getMapCenter}
                zoom={getBoundsZoom}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-center">
                  <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No alerts found with the selected filters</p>
                </div>
              </div>
            )}
            
            <div className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-md shadow-sm text-sm z-[400]">
              {mapPoints.length} alert{mapPoints.length > 1 ? 's' : ''} on map
            </div>
          </div>
          
          {/* Location Details */}
          <LocationDetails mapPoints={mapPoints} alertType={alertType} />
        </div>
      </div>
    </div>
  );
};

export default MapDetailView;
