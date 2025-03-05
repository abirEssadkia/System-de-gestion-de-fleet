
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { DonutChart } from '@/components/dashboard/DonutChart';
import { CircularProgress } from '@/components/dashboard/CircularProgress';
import { LineChart } from '@/components/dashboard/LineChart';

interface DiagramDetails {
  type: 'donut' | 'line' | 'bar' | 'progress';
  title: string;
  description?: string;
  data: any;
}

const DiagramDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState<DiagramDetails | null>(null);
  
  useEffect(() => {
    const type = searchParams.get('type') as 'donut' | 'line' | 'bar' | 'progress';
    const title = searchParams.get('title');
    const description = searchParams.get('description');
    const dataString = searchParams.get('data');
    
    if (type && title && dataString) {
      try {
        const data = JSON.parse(dataString);
        setDetails({
          type,
          title,
          description: description || undefined,
          data
        });
      } catch (error) {
        console.error('Error parsing data', error);
      }
    }
  }, [searchParams]);
  
  const handleGoBack = () => {
    navigate('/');
  };
  
  if (!details) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-fleet-gray p-6">
      <div className="container mx-auto">
        <button 
          onClick={handleGoBack}
          className="flex items-center text-fleet-navy hover:text-fleet-blue mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h1 className="text-2xl font-bold text-fleet-navy mb-2">{details.title}</h1>
          {details.description && (
            <p className="text-fleet-dark-gray mb-6">{details.description}</p>
          )}
          
          {details.type === 'donut' && (
            <div className="flex justify-center my-8">
              <div className="w-64 h-64 relative">
                <DonutChart 
                  items={details.data}
                  className="w-full h-full"
                />
              </div>
            </div>
          )}
          
          {details.type === 'line' && (
            <div className="my-8 max-w-4xl mx-auto h-80">
              <LineChart 
                data={details.data}
                labels={Array.from({ length: details.data.length }, (_, i) => (i + 1).toString())}
                height={300}
              />
            </div>
          )}
          
          {details.type === 'progress' && (
            <div className="flex justify-center my-8">
              <CircularProgress 
                value={typeof details.data === 'number' ? details.data : 0} 
                size={200}
                color="#2A6ED2"
              >
                <div className="text-center">
                  <div className="text-4xl font-bold">{details.data}</div>
                </div>
              </CircularProgress>
            </div>
          )}
          
          <div className="mt-8 border-t border-gray-100 pt-6">
            <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Chart Details</h3>
                <p className="text-fleet-dark-gray">
                  This visualization helps you analyze {details.title.toLowerCase()} data at a glance.
                  Use this information to make informed decisions about your fleet management strategy.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Related Metrics</h3>
                <ul className="list-disc pl-5 text-fleet-dark-gray">
                  <li>Total vehicles affected: {Array.isArray(details.data) ? details.data.length : 1}</li>
                  <li>Last updated: {new Date().toLocaleString()}</li>
                  <li>Data source: Fleet Management System</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagramDetails;
