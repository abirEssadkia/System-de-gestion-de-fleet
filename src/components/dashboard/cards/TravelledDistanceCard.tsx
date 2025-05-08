
import React, { useState, useEffect } from 'react';
import { DashboardCard, DashboardCardTitle } from '@/components/dashboard/DashboardCard';
import { LineChart } from '@/components/dashboard/LineChart';
import { Selector } from '@/components/dashboard/Selector';
import { useQuery } from '@tanstack/react-query';
import { getVehicles } from '@/services/fleetService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TravelledDistanceCardProps {
  handleDiagramClick: (type: 'donut' | 'line' | 'bar' | 'progress', title: string, data: any, description?: string) => void;
}

interface DistanceData {
  id: string;
  hour: number;
  distance: number;
  date: string;
}

export const TravelledDistanceCard = ({ handleDiagramClick }: TravelledDistanceCardProps) => {
  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicles,
  });
  
  const [distanceData, setDistanceData] = useState<DistanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedVehicle, setSelectedVehicle] = useState('All Vehicles');
  const { toast } = useToast();

  const totalDistance = distanceData.reduce((sum, item) => sum + item.distance, 0);
  const avgDistancePerVehicle = vehicles.length ? Math.round(totalDistance / vehicles.length) : 0;

  useEffect(() => {
    const fetchDistanceData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('distance_travelled')
          .select('*')
          .order('hour', { ascending: true });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setDistanceData(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données de distance parcourue:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les données de distance parcourue",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDistanceData();
    
    // Abonnement aux changements en temps réel
    const channel = supabase
      .channel('public:distance_travelled')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'distance_travelled' }, 
        (payload) => {
          fetchDistanceData();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // Options de localisation
  const locationOptions = [
    'All Locations', 'Rabat', 'Casablanca', 'Marrakech', 'Nador', 'Ouarzazate', 'Fes', 'Agadir', 'Tanger'
  ];

  // Options de véhicules
  const vehicleOptions = ['All Vehicles', ...vehicles.map(v => `${v.model} (${v.licensePlate})`)];

  return (
    <DashboardCard className="col-span-1" delay="300">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <DashboardCardTitle>Travelled Distance</DashboardCardTitle>
          <div className="flex space-x-2">
            <Selector 
              label="Location" 
              options={locationOptions}
              value={selectedLocation}
              onChange={setSelectedLocation}
            />
            <Selector 
              label="Vehicles" 
              options={vehicleOptions}
              value={selectedVehicle}
              onChange={setSelectedVehicle}
            />
          </div>
        </div>
        
        <div className="mt-2 mb-3">
          <div className="text-sm font-medium text-fleet-dark-gray">Total travelled distance = {totalDistance} km</div>
          <div className="text-sm font-medium text-fleet-dark-gray">Avg. Travelled distance per vehicle = {avgDistancePerVehicle} km</div>
        </div>
        
        <div 
          className="flex-1 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => handleDiagramClick('line', 'Travelled Distance', distanceData, 'This chart visualizes the distance travelled by your fleet over time, helping you identify trends and peak usage periods.')}
        >
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <React.Fragment>
              <LineChart 
                data={distanceData}
                isFromDatabase={true}
                color="#2A6ED2"
              />
              <div className="text-xs text-center text-fleet-dark-gray mt-1">HEURE</div>
            </React.Fragment>
          )}
        </div>
      </div>
    </DashboardCard>
  );
};
