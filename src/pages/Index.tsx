
import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { FleetStatusCard } from '@/components/dashboard/cards/FleetStatusCard';
import { FleetUtilizationCard } from '@/components/dashboard/cards/FleetUtilizationCard';
import { TravelledDistanceCard } from '@/components/dashboard/cards/TravelledDistanceCard';
import { FleetIdleCard } from '@/components/dashboard/cards/FleetIdleCard';
import { AlertCardsRow } from '@/components/dashboard/cards/AlertCardsRow';
import { useToast } from '@/hooks/use-toast';
import { useDiagramDetails } from '@/hooks/useDiagramDetails';
import { DeliveryMap } from '@/components/dashboard/cards/DeliveryMap';
import { BellDot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLocations, getFallbackLocations } from '@/services/locationService';

const Dashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();
  const { handleDiagramClick } = useDiagramDetails();
  const navigate = useNavigate();

  // Fetch locations from the API
  const { data: locations, isLoading, error } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
    // Fall back to hardcoded locations if API fails
    onError: (err) => {
      console.error('Error fetching locations:', err);
      return getFallbackLocations();
    }
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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
        <FilterPanel />
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <FleetStatusCard handleDiagramClick={handleDiagramClick} />
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
              <DashboardCard key={placeholder} className="col-span-1 min-h-[200px]">
                <DashboardCardTitle>Loading...</DashboardCardTitle>
                <div className="flex justify-center items-center h-[150px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fleet-navy"></div>
                </div>
              </DashboardCard>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg text-red-700 text-center mb-8">
            Failed to load location data. Using fallback data.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {locations?.map((location) => (
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
