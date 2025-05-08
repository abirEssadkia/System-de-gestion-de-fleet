
import React from 'react';
import { DashboardCard, DashboardCardTitle } from '@/components/dashboard/DashboardCard';
import { DonutChart } from '@/components/dashboard/DonutChart';
import { Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDiagramDetails } from '@/hooks/useDiagramDetails';

interface FleetStatus {
  status: string;
  count: number;
  percentage: number;
  color: string;
  id: string;
}

export interface DonutChartItemProps {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutChartItemProps[];
}

export const FleetStatusCard = ({ handleDiagramClick }: { handleDiagramClick?: (type: string, title: string, data: any, description?: string) => void }) => {
  // Fetch data from Supabase
  const { data, isLoading, error } = useQuery({
    queryKey: ['fleetStatus'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fleet_status')
        .select('*')
        .order('count', { ascending: false });
      
      if (error) {
        console.error("Error fetching fleet status:", error);
        throw new Error("Failed to fetch fleet status data");
      }
      
      return data as FleetStatus[];
    },
  });

  const { handleDiagramClick: localHandleDiagramClick } = useDiagramDetails();

  const onClick = () => {
    const handler = handleDiagramClick || localHandleDiagramClick;
    handler('donut', 'Fleet Status', convertFleetStatusToDonutData(data || []), 'Distribution of fleet vehicles by their operational status');
  };

  // Convert FleetStatus to DonutChartItemProps format
  const convertFleetStatusToDonutData = (fleetData: FleetStatus[]): DonutChartItemProps[] => {
    return fleetData.map(item => ({
      label: item.status,
      value: item.count,
      color: item.color
    }));
  };

  // Data for donut chart
  const chartData = convertFleetStatusToDonutData(data || []);

  return (
    <DashboardCard className="col-span-1 row-span-1 cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <DashboardCardTitle>
        Fleet Status
        <Info className="w-4 h-4 text-gray-500" />
      </DashboardCardTitle>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-fleet-navy"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 mt-4">
          Failed to load data
        </div>
      ) : (
        <div className="flex justify-center">
          <DonutChart data={chartData} />
        </div>
      )}
    </DashboardCard>
  );
};
