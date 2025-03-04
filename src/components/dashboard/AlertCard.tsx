
import React from 'react';
import { cn } from '@/lib/utils';
import { DashboardCard } from './DashboardCard';

interface AlertCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  className?: string;
  delay?: '100' | '200' | '300' | '400' | '500';
}

export const AlertCard = ({
  title,
  value,
  subtitle,
  icon,
  iconBg = 'bg-red-100',
  iconColor = 'text-red-500',
  className,
  delay,
}: AlertCardProps) => {
  return (
    <DashboardCard className={cn("", className)} delay={delay}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="dashboard-title">{title}</h3>
          <div className="card-value">{value}</div>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
        <div className={cn("alert-icon", iconBg, iconColor)}>
          {icon}
        </div>
      </div>
    </DashboardCard>
  );
};
