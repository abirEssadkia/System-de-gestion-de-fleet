
import React, { useState } from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { ReportGenerator } from '@/components/reports/ReportGenerator';

const Reports = () => {
  return (
    <div className="min-h-screen bg-fleet-gray">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-fleet-navy">Reports</h1>
          <p className="text-fleet-dark-gray">Generate and download fleet reports</p>
        </div>
        
        <ReportGenerator />
      </div>
    </div>
  );
};

export default Reports;
