
import React from 'react';

interface FilterActionButtonsProps {
  onReset: () => void;
  onApply: () => void;
}

export const FilterActionButtons = ({ onReset, onApply }: FilterActionButtonsProps) => {
  return (
    <div className="mt-6 flex justify-end space-x-3">
      <button 
        className="px-4 py-2 border border-gray-200 rounded-md text-fleet-dark-gray hover:bg-gray-50 transition-colors"
        onClick={onReset}
      >
        Reset Filters
      </button>
      <button 
        className="px-4 py-2 bg-fleet-blue text-white rounded-md hover:bg-fleet-blue/90 transition-colors"
        onClick={onApply}
      >
        Apply Filters
      </button>
    </div>
  );
};
