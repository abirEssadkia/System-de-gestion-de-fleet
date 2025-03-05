
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

const Dashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();
  const { handleDiagramClick } = useDiagramDetails(toast);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-fleet-gray">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
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
      </main>
    </div>
  );
};

export default Dashboard;
