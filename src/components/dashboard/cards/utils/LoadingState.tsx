
import React from 'react';
import { DashboardCard, DashboardCardTitle } from '@/components/dashboard/DashboardCard';

interface LoadingStateProps {
  title: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ title }) => {
  return (
    <DashboardCard className="col-span-1 min-h-[200px]">
      <DashboardCardTitle>{title || 'Loading...'}</DashboardCardTitle>
      <div className="flex justify-center items-center h-[150px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fleet-navy"></div>
      </div>
    </DashboardCard>
  );
};
