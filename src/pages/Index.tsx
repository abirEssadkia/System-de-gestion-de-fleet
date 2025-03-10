
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

const Dashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();
  const { handleDiagramClick } = useDiagramDetails();

  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  // Sample locations for the delivery maps
  const mapLocations = [
    {id: 1, title: "Paris District", points: [{lat: 48.8566, lng: 2.3522}, {lat: 48.8656, lng: 2.3789}]},
    {id: 2, title: "Lyon Area", points: [{lat: 45.7640, lng: 4.8357}, {lat: 45.7578, lng: 4.8320}, {lat: 45.7671, lng: 4.8307}]},
    {id: 3, title: "Marseille Zone", points: [{lat: 43.2965, lng: 5.3698}, {lat: 43.3036, lng: 5.3954}]},
    {id: 4, title: "Bordeaux Region", points: [{lat: 44.8378, lng: -0.5792}, {lat: 44.8404, lng: -0.5805}, {lat: 44.8333, lng: -0.5928}]},
    {id: 5, title: "Lille District", points: [{lat: 50.6292, lng: 3.0573}, {lat: 50.6333, lng: 3.0679}]},
    {id: 6, title: "Strasbourg Area", points: [{lat: 48.5734, lng: 7.7521}, {lat: 48.5845, lng: 7.7456}, {lat: 48.5700, lng: 7.7600}]},
    {id: 7, title: "Nice Coastal", points: [{lat: 43.7102, lng: 7.2620}, {lat: 43.7031, lng: 7.2660}]},
    {id: 8, title: "Toulouse Center", points: [{lat: 43.6047, lng: 1.4442}, {lat: 43.6100, lng: 1.4500}, {lat: 43.5984, lng: 1.4400}]}
  ];

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
        
        {/* Delivery Maps Row */}
        <h3 className="text-xl font-semibold text-fleet-navy mt-8 mb-4">Delivery & Pickup Issues</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mapLocations.map((location) => (
            <DeliveryMap 
              key={location.id} 
              title={location.title} 
              points={location.points} 
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
