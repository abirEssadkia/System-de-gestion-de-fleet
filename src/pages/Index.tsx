
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
  
  // Sample locations for the delivery maps in Morocco
  const mapLocations = [
    {
      id: 1, 
      title: "Casablanca", 
      points: [
        {lat: 33.5731, lng: -7.5898, description: "Delivery failed at Maârif"},
        {lat: 33.5950, lng: -7.6190, description: "Package return at Sidi Belyout"}
      ]
    },
    {
      id: 2, 
      title: "Marrakech", 
      points: [
        {lat: 31.6295, lng: -7.9811, description: "Delayed pickup at Medina"},
        {lat: 31.6425, lng: -8.0022, description: "Missed delivery at Hivernage"},
        {lat: 31.6140, lng: -8.0352, description: "Late delivery at Palmeraie"}
      ]
    },
    {
      id: 3, 
      title: "Fes", 
      points: [
        {lat: 34.0181, lng: -5.0078, description: "Delivery issue at Rcif"},
        {lat: 34.0330, lng: -4.9830, description: "Package return at Bab Jdid"}
      ]
    },
    {
      id: 4, 
      title: "Nador", 
      points: [
        {lat: 35.1740, lng: -2.9287, description: "Failed pickup at City Center"},
        {lat: 35.1680, lng: -2.9380, description: "Delivery exception at Boulevard Hassan II"},
        {lat: 35.1611, lng: -2.9500, description: "Delayed delivery at Corniche"}
      ]
    },
    {
      id: 5, 
      title: "Agadir", 
      points: [
        {lat: 30.4278, lng: -9.5981, description: "Late delivery at Marina"},
        {lat: 30.4060, lng: -9.5900, description: "Missed pickup at Founty"}
      ]
    },
    {
      id: 6, 
      title: "Ouarzazate", 
      points: [
        {lat: 30.9335, lng: -6.9370, description: "Package return at City Center"},
        {lat: 30.9200, lng: -6.9100, description: "Pickup issue at Atlas Studios"},
        {lat: 30.9150, lng: -6.8930, description: "Delivery problem at Tabounte"}
      ]
    },
    {
      id: 7, 
      title: "Rabat", 
      points: [
        {lat: 34.0209, lng: -6.8416, description: "Delayed delivery at Hassan"},
        {lat: 34.0100, lng: -6.8300, description: "Package return at Agdal"}
      ]
    },
    {
      id: 8, 
      title: "Tanger", 
      points: [
        {lat: 35.7812, lng: -5.8137, description: "Failed delivery at Marina Bay"},
        {lat: 35.7690, lng: -5.8330, description: "Missed pickup at Old Medina"},
        {lat: 35.7590, lng: -5.8033, description: "Delivery issue at Malabata"}
      ]
    }
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
              handleClick={handleDiagramClick}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
