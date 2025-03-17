
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from '@/pages/Index';
import Vehicles from '@/pages/Vehicles';
import Drivers from '@/pages/Drivers';
import Maintenance from '@/pages/Maintenance';
import NotFound from '@/pages/NotFound';
import DiagramDetails from '@/pages/DiagramDetails';
import AlertManagement from '@/pages/AlertManagement';
import MapDetailView from '@/pages/MapDetailView';
import Reports from '@/pages/Reports';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/diagram-details" element={<DiagramDetails />} />
            <Route path="/alert-management" element={<AlertManagement />} />
            <Route path="/map-detail-view" element={<MapDetailView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
