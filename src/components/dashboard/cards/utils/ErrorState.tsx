
import React from 'react';
import { DashboardCard, DashboardCardTitle } from '@/components/dashboard/DashboardCard';

interface ErrorStateProps {
  title: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ title }) => {
  return (
    <DashboardCard className="col-span-1 min-h-[200px]">
      <DashboardCardTitle>{title || 'Error'}</DashboardCardTitle>
      <div className="flex justify-center items-center h-[150px] text-center text-gray-500">
        <p>Location data unavailable</p>
      </div>
    </DashboardCard>
  );
};
