
import React, { useState, useEffect } from 'react';
import { DashboardCard, DashboardCardTitle } from '@/components/dashboard/DashboardCard';
import { CircularProgress } from '@/components/dashboard/CircularProgress';
import { Selector } from '@/components/dashboard/Selector';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FleetUtilizationCardProps {
  handleDiagramClick: (type: 'donut' | 'line' | 'bar' | 'progress', title: string, data: any, description?: string) => void;
}

export const FleetUtilizationCard = ({ handleDiagramClick }: FleetUtilizationCardProps) => {
  const [predictionMode, setPredictionMode] = useState<'actual' | 'ml'>('actual');
  const [selectedPeriod, setSelectedPeriod] = useState('Last 7 days');
  const [utilizationValue, setUtilizationValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate API call to get utilization data
    const fetchUtilizationData = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data instead of Supabase
        const actualValue = 68; // Mock database value
        
        // If we're in ML mode, add a bonus for simulation
        if (predictionMode === 'ml') {
          setUtilizationValue(Math.min(actualValue + 12, 100)); // Max 100%
        } else {
          setUtilizationValue(actualValue);
        }
      } catch (error) {
        console.error('Error while loading utilization data:', error);
        toast({
          title: "Error loading data",
          description: "Unable to load fleet utilization data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUtilizationData();
  }, [predictionMode, selectedPeriod, toast]);
  
  return (
    <DashboardCard className="col-span-1" delay="200">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <DashboardCardTitle>Fleet Utilization</DashboardCardTitle>
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-8 px-3 bg-white border border-gray-200">
                  {predictionMode === 'actual' ? 'Actual Data' : 'ML Predictions'}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setPredictionMode('actual')}
                  className={predictionMode === 'actual' ? 'bg-blue-500 text-white' : ''}
                >
                  Actual Data
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setPredictionMode('ml')}
                  className={predictionMode === 'ml' ? 'bg-blue-500 text-white' : ''}
                >
                  ML Predictions
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Selector 
              label="Period" 
              options={['Last 7 days', 'Last 30 days', 'Last 90 days']} 
              value={selectedPeriod}
              onChange={(value) => setSelectedPeriod(value)}
            />
          </div>
        </div>
        
        <div 
          className="flex-1 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => handleDiagramClick('progress', 'Fleet Utilization', utilizationValue, 
            predictionMode === 'ml' 
              ? 'ML prediction of fleet utilization shows potential improvement with optimized scheduling and route planning.'
              : 'This metric represents how effectively your fleet is being utilized. A higher percentage indicates better resource management.')}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          ) : (
            <CircularProgress value={utilizationValue} size={150} color={predictionMode === 'ml' ? "#9b87f5" : "#2A6ED2"}>
              <div className="text-center">
                <div className="text-4xl font-bold">{utilizationValue}%</div>
                {predictionMode === 'ml' && (
                  <div className="text-xs text-green-500 mt-1">+12% improvement</div>
                )}
              </div>
            </CircularProgress>
          )}
        </div>
      </div>
    </DashboardCard>
  );
};
