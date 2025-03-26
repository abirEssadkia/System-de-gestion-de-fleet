
import React from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterHeaderProps {
  isOpen: boolean;
  togglePanel: () => void;
}

export const FilterHeader = ({ isOpen, togglePanel }: FilterHeaderProps) => {
  return (
    <div 
      className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={togglePanel}
    >
      <div className="flex items-center space-x-2">
        <Filter className="w-5 h-5 text-fleet-navy" />
        <h3 className="font-medium text-fleet-navy">Filters & Customization</h3>
      </div>
      <div>
        {isOpen ? 
          <ChevronUp className="w-5 h-5 text-fleet-navy" /> : 
          <ChevronDown className="w-5 h-5 text-fleet-navy" />
        }
      </div>
    </div>
  );
};
