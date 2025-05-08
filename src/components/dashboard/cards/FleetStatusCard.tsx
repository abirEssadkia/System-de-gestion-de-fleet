
import React, { useEffect, useState } from 'react';
import { DashboardCard, DashboardCardTitle } from '@/components/dashboard/DashboardCard';
import { Selector } from '@/components/dashboard/Selector';
import { supabase } from '@/integrations/supabase/client';
import { DonutChart } from '@/components/dashboard/DonutChart';
import { useToast } from '@/hooks/use-toast';

interface FleetStatus {
  id: string;
  status: string;
  count: number;
  percentage: number;
  color: string;
}

interface FleetStatusCardProps {
  handleDiagramClick: (type: 'donut' | 'line' | 'bar' | 'progress', title: string, data: any, description?: string) => void;
}

export const FleetStatusCard = ({ handleDiagramClick }: FleetStatusCardProps) => {
  const [fleetStatus, setFleetStatus] = useState<FleetStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchFleetStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('fleet_status')
          .select('*')
          .order('percentage', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setFleetStatus(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données de statut de la flotte:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les données de statut de la flotte",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchFleetStatus();
    
    // Abonnement aux changements en temps réel
    const channel = supabase
      .channel('public:fleet_status')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'fleet_status' }, 
        (payload) => {
          fetchFleetStatus();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return (
    <DashboardCard className="col-span-1" delay="100">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <DashboardCardTitle>RTL Fleet Status</DashboardCardTitle>
          <Selector 
            label="Location" 
            options={['All Locations', 'Rabat', 'Casablanca', 'Marrakech', 'Nador', 'Ouarzazate', 'Fes', 'Agadir', 'Tanger']} 
          />
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div 
            className="cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => handleDiagramClick('donut', 'RTL Fleet Status', fleetStatus, 'This chart shows the current status of all vehicles in your fleet, categorized by their operational state.')}
          >
            <DonutChart 
              items={fleetStatus} 
              className="mx-auto"
              totalLabel="Assets"
            />
          </div>
        )}
      </div>
    </DashboardCard>
  );
};
