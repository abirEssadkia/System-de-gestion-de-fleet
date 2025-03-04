
import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  className?: string;
  children: React.ReactNode;
  animate?: boolean;
  delay?: '100' | '200' | '300' | '400' | '500';
}

export const DashboardCard = ({
  className,
  children,
  animate = true,
  delay = '100',
}: DashboardCardProps) => {
  return (
    <div 
      className={cn(
        'dashboard-card',
        animate && 'opacity-0',
        animate && `animate-slideUp animate-delay-${delay}`,
        className
      )}
    >
      {children}
    </div>
  );
};

export const DashboardCardTitle = ({ 
  children,
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className={cn("dashboard-title", className)}>{children}</h3>
    </div>
  );
};

export const DashboardCardHeader = ({
  title,
  action
}: {
  title: React.ReactNode;
  action?: React.ReactNode;
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="dashboard-title">{title}</h3>
      {action}
    </div>
  );
};
