
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface AlertCounterProps {
  count: number;
  onClick?: () => void;
  showButton?: boolean;
}

export const AlertCounter: React.FC<AlertCounterProps> = ({ count, onClick, showButton = false }) => {
  return (
    <div className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-md shadow-sm text-sm z-[400] flex items-center gap-2">
      <span>{count} alert{count > 1 ? 's' : ''} detected</span>
      
      {showButton && onClick && (
        <Button size="sm" variant="outline" className="ml-2" onClick={onClick}>
          <ExternalLink className="w-4 h-4 mr-1" /> View Full Map
        </Button>
      )}
    </div>
  );
};
