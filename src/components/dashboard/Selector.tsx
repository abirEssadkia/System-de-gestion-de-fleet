
import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectorProps {
  label: string;
  options: string[];
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const Selector = ({ 
  label, 
  options, 
  className, 
  value, 
  onChange,
  placeholder = "Select..." 
}: SelectorProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={cn("relative", className)}>
      <select 
        className="fleet-selector appearance-none pr-8 w-full"
        value={value}
        onChange={handleChange}
        aria-label={label}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </div>
    </div>
  );
};
