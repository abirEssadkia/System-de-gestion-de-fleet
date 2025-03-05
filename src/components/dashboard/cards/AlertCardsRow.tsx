
import React from 'react';
import { AlertCard } from '@/components/dashboard/AlertCard';
import { AlertTriangle, Clock, Fuel } from 'lucide-react';

export const AlertCardsRow = () => {
  return (
    <>
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
    </>
  );
};
