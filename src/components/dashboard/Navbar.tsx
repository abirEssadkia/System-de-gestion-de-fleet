
import React from 'react';
import { Settings, Filter, BellRing } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <div className="bg-fleet-navy text-white p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-6">
        <h1 className="text-lg font-semibold">Fleet Dashboard</h1>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Overview</a>
          <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Vehicles</a>
          <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Drivers</a>
          <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Reports</a>
          <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Maintenance</a>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <Link 
          to="/alert-management" 
          className="flex items-center p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <BellRing className="w-5 h-5 mr-1" />
          <span className="hidden sm:inline text-sm font-medium">Alert Management</span>
        </Link>
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <Filter className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
