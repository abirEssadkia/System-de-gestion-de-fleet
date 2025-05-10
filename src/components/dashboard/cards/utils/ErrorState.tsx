
import React from 'react';
import { DashboardCard, DashboardCardTitle } from '@/components/dashboard/DashboardCard';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  title: string;
  message?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ title, message }) => {
  return (
    <DashboardCard className="col-span-1 min-h-[200px]">
      <DashboardCardTitle>{title || 'Error'}</DashboardCardTitle>
      <div className="flex flex-col justify-center items-center h-[150px] text-center text-gray-500">
        <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
        <p>{message || 'Location data unavailable'}</p>
      </div>
    </DashboardCard>
  );
};
