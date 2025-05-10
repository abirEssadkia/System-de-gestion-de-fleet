
import React from 'react';
import { BarChart, Download, Columns } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomizationPanelProps {
  chartTypes: string[];
  chartType: string;
  setChartType: (type: string) => void;
  exportOptions: string[];
  columnOptions: string[];
  notifyChange: () => void;
}

export const CustomizationPanel = ({
  chartTypes,
  chartType,
  setChartType,
  exportOptions,
  columnOptions,
  notifyChange
}: CustomizationPanelProps) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-fleet-navy flex items-center gap-2">
        <BarChart className="w-4 h-4" /> Customization Options
      </h4>
      
      {/* Chart Type Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-fleet-dark-gray">Chart Type</label>
        <div className="grid grid-cols-3 gap-2">
          {chartTypes.map((type) => (
            <button
              key={type}
              onClick={() => {
                setChartType(type.toLowerCase());
              }}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md border transition-colors",
                chartType === type.toLowerCase()
                  ? "bg-fleet-blue text-white border-fleet-blue"
                  : "bg-white text-fleet-dark-gray border-gray-200 hover:border-gray-300"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      
      {/* Data Export Options */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-fleet-dark-gray flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Data
        </label>
        <div className="grid grid-cols-3 gap-2">
          {exportOptions.map((option) => (
            <button
              key={option}
              className="px-3 py-1.5 text-sm rounded-md border border-gray-200 bg-white text-fleet-dark-gray hover:border-gray-300 transition-colors flex items-center justify-center gap-1"
            >
              <Download className="w-3 h-3" />
              {option}
            </button>
          ))}
        </div>
      </div>
      
      {/* Column Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-fleet-dark-gray flex items-center gap-2">
          <Columns className="w-4 h-4" /> Column Selection
        </label>
        <div className="flex flex-wrap gap-2">
          {columnOptions.map((column) => (
            <div key={column} className="flex items-center">
              <input
                type="checkbox"
                id={`column-${column}`}
                className="h-4 w-4 text-fleet-blue rounded border-gray-300 focus:ring-fleet-blue"
                defaultChecked
                onChange={notifyChange}
              />
              <label htmlFor={`column-${column}`} className="ml-2 text-sm text-fleet-dark-gray">
                {column}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
