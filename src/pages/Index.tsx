
import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { FilterPanel, FilterOptions } from '@/components/dashboard/FilterPanel';
import { FleetStatusCard } from '@/components/dashboard/cards/FleetStatusCard';
import { FleetUtilizationCard } from '@/components/dashboard/cards/FleetUtilizationCard';
import { TravelledDistanceCard } from '@/components/dashboard/cards/TravelledDistanceCard';
import { FleetIdleCard } from '@/components/dashboard/cards/FleetIdleCard';
import { AlertCardsRow } from '@/components/dashboard/cards/AlertCardsRow';
import { useToast } from '@/hooks/use-toast';
import { useDiagramDetails } from '@/hooks/useDiagramDetails';
import { DeliveryMap } from '@/components/dashboard/cards/DeliveryMap';
import { LoadingState } from '@/components/dashboard/cards/utils/LoadingState';
import { BellDot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLocations, getFallbackLocations } from '@/services/locationService';

const Dashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    selectedVehicles: [],
    statusFilters: { 
      running: true, 
      idle: true, 
      stopped: true 
    },
    speedThreshold: '',
    selectedZone: 'all_locations',
    chartType: 'line',
    alertType: 'all',
  });
  const { toast } = useToast();
  const { handleDiagramClick } = useDiagramDetails();
  const navigate = useNavigate();

  // Fetch locations using our mock data service
  const { data: locations, isLoading, error } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    console.log("Filters applied:", newFilters);
    // Optionally show a toast to confirm filters were applied
    toast({
      title: "Filters Applied",
      description: "Dashboard updated with new filter settings",
    });
  };

  // Fallback to hardcoded locations if there's an error
  const displayLocations = locations || getFallbackLocations();

  return (
    <div className="min-h-screen bg-fleet-gray">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        {/* Alerts Button */}
        <div className="mb-4">
          <Button 
            onClick={() => navigate('/alert-management')}
            className="w-full bg-fleet-navy hover:bg-fleet-blue text-white"
          >
            <BellDot className="mr-2 h-5 w-5" /> 
            Manage Fleet Alerts
          </Button>
        </div>

        {/* Add Filter Panel */}
        <FilterPanel onFilterChange={handleFilterChange} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <FleetStatusCard handleDiagramClick={handleDiagramClick} filters={filters} />
          <FleetUtilizationCard handleDiagramClick={handleDiagramClick} />
          <TravelledDistanceCard handleDiagramClick={handleDiagramClick} />
          <FleetIdleCard handleDiagramClick={handleDiagramClick} />
        </div>
        
        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-6">
          <AlertCardsRow />
        </div>
        
        {/* Delivery Maps Row */}
        <h3 className="text-xl font-semibold text-fleet-navy mt-8 mb-4">Delivery & Pickup Issues</h3>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((placeholder) => (
              <LoadingState key={placeholder} title="Loading..." />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg text-red-700 text-center mb-8">
            Failed to load location data. Using fallback data.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {displayLocations?.map((location) => (
              <DeliveryMap 
                key={location.id} 
                title={location.name}
                handleClick={handleDiagramClick}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
