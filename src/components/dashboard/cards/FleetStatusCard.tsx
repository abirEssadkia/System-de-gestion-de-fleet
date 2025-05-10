
import React, { useMemo } from 'react';
import { DashboardCard, DashboardCardHeader } from '@/components/dashboard/DashboardCard';
import { Circle, ArrowUp, ArrowDown, MoreVertical, ChevronRight } from 'lucide-react';
import { DonutChart } from '@/components/dashboard/DonutChart';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getFleetStatus, FleetStatusData } from '@/services/fleetService';
import { cn } from '@/lib/utils';

interface DonutChartItemProps {
  name: string;
  value: number;
  color: string;
}

interface FleetStatusCardProps {
  handleDiagramClick?: (type: string, title: string, data: any, description?: string) => void;
}

export const FleetStatusCard = ({ handleDiagramClick }: FleetStatusCardProps) => {
  const navigate = useNavigate();
  
  const { data: fleetStatus, isLoading, error } = useQuery({
    queryKey: ['fleet-status'],
    queryFn: getFleetStatus,
  });
  
  const chartData = useMemo(() => {
    if (!fleetStatus) {
      return [
        { name: 'Running', value: 12, color: '#10B981' },
        { name: 'Idle', value: 5, color: '#F59E0B' },
        { name: 'Stopped', value: 3, color: '#6B7280' }
      ];
    }
    
    const data: DonutChartItemProps[] = [
      { name: 'Running', value: fleetStatus.running, color: '#10B981' },
      { name: 'Idle', value: fleetStatus.idle, color: '#F59E0B' },
      { name: 'Stopped', value: fleetStatus.stopped, color: '#6B7280' }
    ];
    
    if (fleetStatus.noData && fleetStatus.noData > 0) {
      data.push({ name: 'No data', value: fleetStatus.noData, color: '#374151' });
    }
    
    return data;
  }, [fleetStatus]);
  
  const handleClick = () => {
    if (handleDiagramClick) {
      handleDiagramClick('donut', 'Fleet Status', chartData, 'Current status of all fleet vehicles');
    }
  };
  
  const total = useMemo(() => {
    return chartData.reduce((acc, item) => acc + item.value, 0);
  }, [chartData]);
  
  const percentChange = 5.2; // This would come from API in a real app
  
  return (
    <DashboardCard className="col-span-1">
      <DashboardCardHeader
        title="Fleet Status"
        action={
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate('/vehicles')}
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">More</span>
          </Button>
        }
      />
      
      <div className="relative">
        <div 
          className="flex flex-col items-center justify-center cursor-pointer" 
          onClick={handleClick}
        >
          <DonutChart 
            items={chartData}
            className="mx-auto w-32 h-32"
          />
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-2xl font-bold">{total}</div>
            <div className="text-xs text-gray-500">Vehicles</div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {chartData.map((item) => (
            <div key={item.name} className="flex flex-col items-center">
              <div className="flex items-center justify-center mb-1">
                <Circle className={cn("h-3 w-3 mr-1", {
                  "text-emerald-500 fill-emerald-500": item.name === "Running",
                  "text-amber-500 fill-amber-500": item.name === "Idle",
                  "text-gray-500 fill-gray-500": item.name === "Stopped",
                  "text-gray-700 fill-gray-700": item.name === "No data",
                })} />
                <span className="text-xs font-medium">{item.name}</span>
              </div>
              <span className="text-sm font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center justify-between text-xs">
          <div className="flex items-center">
            <span className="text-gray-500">vs last week</span>
            <span className={cn("ml-2 flex items-center", {
              "text-emerald-500": percentChange > 0,
              "text-red-500": percentChange < 0
            })}>
              {percentChange > 0 ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(percentChange)}%
            </span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 p-0 text-xs flex items-center text-fleet-navy hover:text-fleet-blue"
            onClick={() => navigate('/vehicles')}
          >
            Details
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
};
