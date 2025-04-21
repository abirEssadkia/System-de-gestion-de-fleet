
import React from 'react';
import { CustomizationPanel } from './CustomizationPanel';

interface FilterCustomizationPanelProps {
  chartTypes: string[];
  chartType: string;
  setChartType: (v: string) => void;
  exportOptions: string[];
  columnOptions: string[];
  notifyFilterChange: () => void;
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
