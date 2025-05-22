
import React from 'react';
import { CustomizationPanel } from './CustomizationPanel';
import { AlertType } from '@/utils/alertsData';

interface FilterCustomizationPanelProps {
  chartTypes: string[];
  chartType: string;
  setChartType: (v: string) => void;
  exportOptions: string[];
  columnOptions: string[];
  notifyFilterChange: (newStatusFilters?: { running: boolean; idle: boolean; stopped: boolean; }, newAlertType?: AlertType) => void;
}

export const FilterCustomizationPanel = ({
  chartTypes,
  chartType,
  setChartType,
  exportOptions,
  columnOptions,
  notifyFilterChange,
}: FilterCustomizationPanelProps) => (
  <CustomizationPanel
    chartTypes={chartTypes}
    chartType={chartType}
    setChartType={setChartType}
    exportOptions={exportOptions}
    columnOptions={columnOptions}
    notifyChange={notifyFilterChange}
  />
);
