
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  LayoutDashboard,
  Truck,
  Users,
  Wrench,
  FileText,
  Menu,
  X
} from 'lucide-react';

interface NavButtonProps {
  onClick: () => void;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ onClick, active, icon, label }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
        active ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"
      )}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );
};

interface MobileNavButtonProps {
  onClick: () => void;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}

const MobileNavButton: React.FC<MobileNavButtonProps> = ({ onClick, active, icon, label }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-start w-full px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
        active ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"
      )}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );
};

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={() => navigate('/')} className="font-bold text-xl text-fleet-navy py-4">
            Fleet Management
          </button>
        </div>
        
        <div className={`${isMobile ? 'hidden' : 'flex'} space-x-1`}>
          <NavButton 
            onClick={() => navigate('/')}
            active={isActive('/')}
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
          />
          <NavButton 
            onClick={() => navigate('/vehicles')}
            active={isActive('/vehicles')}
            icon={<Truck size={20} />}
            label="Vehicles"
          />
          <NavButton 
            onClick={() => navigate('/drivers')}
            active={isActive('/drivers')}
            icon={<Users size={20} />}
            label="Drivers"
          />
          <NavButton 
            onClick={() => navigate('/maintenance')}
            active={isActive('/maintenance')}
            icon={<Wrench size={20} />}
            label="Maintenance"
          />
          <NavButton 
            onClick={() => navigate('/reports')}
            active={isActive('/reports')}
            icon={<FileText size={20} />}
            label="Reports"
          />
        </div>

        {isMobile && (
          <button onClick={toggleMenu} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>
      
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white z-50 border-b border-gray-200 shadow-lg">
            <div className="container mx-auto py-2 flex flex-col">
              <MobileNavButton 
                onClick={() => {navigate('/'); setIsMenuOpen(false)}}
                active={isActive('/')}
                icon={<LayoutDashboard size={20} />}
                label="Dashboard"
              />
              <MobileNavButton 
                onClick={() => {navigate('/vehicles'); setIsMenuOpen(false)}}
                active={isActive('/vehicles')}
                icon={<Truck size={20} />}
                label="Vehicles"
              />
              <MobileNavButton 
                onClick={() => {navigate('/drivers'); setIsMenuOpen(false)}}
                active={isActive('/drivers')}
                icon={<Users size={20} />}
                label="Drivers"
              />
              <MobileNavButton 
                onClick={() => {navigate('/maintenance'); setIsMenuOpen(false)}}
                active={isActive('/maintenance')}
                icon={<Wrench size={20} />}
                label="Maintenance"
              />
              <MobileNavButton 
                onClick={() => {navigate('/reports'); setIsMenuOpen(false)}}
                active={isActive('/reports')}
                icon={<FileText size={20} />}
                label="Reports"
              />
            </div>
          </div>
        )}
    </div>
  );
};
