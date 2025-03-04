
import React, { useEffect, useState } from 'react';
import { DashboardCard, DashboardCardTitle } from '@/components/dashboard/DashboardCard';
import { CircularProgress } from '@/components/dashboard/CircularProgress';
import { LineChart } from '@/components/dashboard/LineChart';
import { AlertCard } from '@/components/dashboard/AlertCard';
import { Navbar } from '@/components/dashboard/Navbar';
import { Selector } from '@/components/dashboard/Selector';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { AlertTriangle, Clock, Fuel, TrendingUp } from 'lucide-react';
import { DonutChart } from '@/components/dashboard/DonutChart';

const Dashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const fleetStatus = [
    { label: 'Running', value: 80, color: '#18C29C', percentage: 80 },
    { label: 'Idle', value: 13, color: '#FFB400', percentage: 13 },
    { label: 'Stopped', value: 5, color: '#FF5A5F', percentage: 5 },
    { label: 'No data', value: 2, color: '#4A5568', percentage: 2 },
  ];

  const distanceData = [1000, 1200, 1100, 1800, 3000, 2700, 4200, 3800, 3200, 4000, 3000, 2500, 3500, 3000];
  const distanceLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];

  return (
    <div className="min-h-screen bg-fleet-gray">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        {/* Add Filter Panel */}
        <FilterPanel />
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Fleet Status Card */}
          <DashboardCard className="col-span-1" delay="100">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <DashboardCardTitle>RTL Fleet Status</DashboardCardTitle>
                <Selector 
                  label="Location" 
                  options={['All Locations', 'New York', 'Los Angeles', 'Chicago']} 
                />
              </div>
              
              <div className="flex items-center justify-center">
                <div className="w-32 h-32 relative mb-4">
                  <img 
                    src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%2318C29C' d='M50 0A50 50 0 1 1 50 100A50 50 0 0 1 50 0'/%3E%3Cpath fill='%23FFB400' d='M50 0A50 50 0 0 1 100 50L50 50Z'/%3E%3Cpath fill='%23FF5A5F' d='M100 50A50 50 0 0 1 85 85L50 50Z'/%3E%3Cpath fill='%234A5568' d='M85 85A50 50 0 0 1 50 100L50 50Z'/%3E%3C/svg%3E" 
                    alt="Fleet Status" 
                    className="w-full h-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-base font-medium">100 Assets</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mt-2">
                {fleetStatus.map((status, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: status.color }}
                      ></div>
                      <span className="text-sm">{status.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{status.value}</span>
                      <span className="text-xs text-gray-500">({status.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DashboardCard>
          
          {/* Fleet Utilization Card */}
          <DashboardCard className="col-span-1" delay="200">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <DashboardCardTitle>Fleet Utilization</DashboardCardTitle>
                <Selector 
                  label="Period" 
                  options={['Last 7 days', 'Last 30 days', 'Last 90 days']} 
                />
              </div>
              
              <div className="flex-1 flex items-center justify-center">
                <CircularProgress value={80} size={150} color="#2A6ED2">
                  <div className="text-center">
                    <div className="text-4xl font-bold">80%</div>
                  </div>
                </CircularProgress>
              </div>
            </div>
          </DashboardCard>
          
          {/* Travelled Distance Card */}
          <DashboardCard className="col-span-1" delay="300">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <DashboardCardTitle>Travelled Distance</DashboardCardTitle>
                <div className="flex space-x-2">
                  <Selector 
                    label="Location" 
                    options={['All Locations']} 
                  />
                  <Selector 
                    label="Vehicles" 
                    options={['All Vehicles']} 
                  />
                </div>
              </div>
              
              <div className="mt-2 mb-3">
                <div className="text-sm font-medium text-fleet-dark-gray">Total travelled distance = 16 720 km</div>
                <div className="text-sm font-medium text-fleet-dark-gray">Avg. Travelled distance per vehicle = 119 km</div>
              </div>
              
              <div className="flex-1">
                <LineChart 
                  data={distanceData} 
                  labels={distanceLabels}
                  color="#2A6ED2"
                />
                <div className="text-xs text-center text-fleet-dark-gray mt-1">HEURE</div>
              </div>
            </div>
          </DashboardCard>
          
          {/* Fleet Idle Card */}
          <DashboardCard className="col-span-1" delay="400">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-5">
                <DashboardCardTitle>Fleet Idle</DashboardCardTitle>
                <div className="flex space-x-2">
                  <Selector 
                    label="Vehicles" 
                    options={['All Vehicles']} 
                  />
                  <Selector 
                    label="Period" 
                    options={['Last 7 days']} 
                  />
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center space-y-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <img 
                      src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' stroke='%23FFB400' stroke-width='2' d='M12,3 C16.971,3 21,7.029 21,12 C21,16.971 16.971,21 12,21 C7.029,21 3,16.971 3,12 C3,7.029 7.029,3 12,3 Z M12,7 L12,12 L16,12'/%3E%3C/svg%3E" 
                      alt="Clock" 
                      className="w-8 h-8 mb-1"
                    />
                  </div>
                  <div className="text-2xl font-bold">Total Fleet Idle</div>
                  <div className="text-4xl font-bold mt-1">68 hours</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <img 
                      src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' stroke='%23FF5A5F' stroke-width='2' d='M3,7 L12,7 L12,12 M12,17 L21,17 M5,3 L19,3 C20.105,3 21,3.895 21,5 L21,7 L3,7 L3,5 C3,3.895 3.895,3 5,3 Z M3,7 L3,19 C3,20.105 3.895,21 5,21 L19,21 C20.105,21 21,20.105 21,19 L21,7'/%3E%3C/svg%3E" 
                      alt="Fuel" 
                      className="w-8 h-8 mb-1"
                    />
                  </div>
                  <div className="text-2xl font-bold">Approx Fuel Waste</div>
                  <div className="text-4xl font-bold mt-1">47,6 Liter</div>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>
        
        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-6">
          <AlertCard 
            title="Overspeed" 
            value="105 km/h" 
            subtitle="16 Objects" 
            icon={<img src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' stroke='%23FF5A5F' stroke-width='2' d='M12,4 C16.418,4 20,7.582 20,12 C20,16.418 16.418,20 12,20 C7.582,20 4,16.418 4,12 C4,7.582 7.582,4 12,4 Z M12,16 L12,14 M12,12 L12,7'/%3E%3C/svg%3E" alt="Speed" className="w-6 h-6" />} 
            iconBg="bg-red-100" 
            iconColor="text-red-500" 
            className="col-span-1 bg-red-50" 
            delay="100"
          />
          
          <AlertCard 
            title="Fuel Activity Alerts" 
            value="1" 
            subtitle="1 Objects" 
            icon={<Fuel className="w-6 h-6" />} 
            iconBg="bg-amber-100" 
            iconColor="text-amber-500" 
            delay="200"
          />
          
          <AlertCard 
            title="Excessive Activity Alerts" 
            value="43" 
            subtitle="34 Objects" 
            icon={<AlertTriangle className="w-6 h-6" />} 
            iconBg="bg-red-100" 
            iconColor="text-red-500" 
            delay="300"
          />
          
          <AlertCard 
            title="Geofencing Alerts" 
            value="4" 
            subtitle="1 Objects" 
            icon={<img src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' stroke='%23FF5A5F' stroke-width='2' d='M12,21 C16.418,21 20,17.418 20,13 C20,8.582 16.418,5 12,5 C7.582,5 4,8.582 4,13 C4,17.418 7.582,21 12,21 Z M12,21 L12,23 M12,5 L12,3 M5,13 L3,13 M21,13 L23,13 M18,7 L20,5 M6,7 L4,5 M18,19 L20,21 M6,19 L4,21'/%3E%3C/svg%3E" alt="Geofencing" className="w-6 h-6" />} 
            iconBg="bg-red-100" 
            iconColor="text-red-500" 
            delay="400"
          />
          
          <AlertCard 
            title="Average Drive Time" 
            value="7 hours 7 minutes" 
            subtitle="6 Objects" 
            icon={<Clock className="w-6 h-6" />} 
            iconBg="bg-blue-100" 
            iconColor="text-blue-500" 
            delay="500"
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
