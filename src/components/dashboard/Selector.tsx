
import React from 'react';
import { cn } from '@/lib/utils';

interface SelectorProps {
  label: string;
  options: string[];
  className?: string;
}

export const Selector = ({ label, options, className }: SelectorProps) => {
  return (
    <div className={cn("relative", className)}>
      <select className="fleet-selector appearance-none pr-8">
        {options.map((option, index) => (
          <option key={index}>{option}</option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};
