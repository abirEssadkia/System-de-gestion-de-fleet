
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/dashboard/Navbar';
import { LineChart } from '@/components/dashboard/LineChart';
import { DonutChart } from '@/components/dashboard/DonutChart';
import { CircularProgress } from '@/components/dashboard/CircularProgress';

interface DiagramDetailsProps {}

const DiagramDetails: React.FC<DiagramDetailsProps> = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const type = searchParams.get('type');
      const title = searchParams.get('title');
      let data;
      
      try {
        data = JSON.parse(searchParams.get('data') || '{}');
      } catch (e) {
        data = {};
        console.error('Failed to parse data', e);
      }
      
      const description = searchParams.get('description');
      
      setDetails({
        type,
        title,
        data,
        description
      });
      
      setLoading(false);
    }, 500);
  }, [searchParams]);

  const handleBack = () => {
    navigate('/');
  };

  const renderDiagramDetails = () => {
    if (!details) return null;

    switch (details.type) {
      case 'donut':
        return (
          <div className="space-y-6">
            <div className="flex justify-center my-8">
              <div className="w-64 h-64 relative">
                <DonutChart 
                  data={details.data}
                  size={256}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow-sm p-6 rounded-xl">
                <h3 className="text-lg font-medium mb-4">Status Distribution</h3>
                <div className="space-y-4">
                  {Array.isArray(details.data) && details.data.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{item.value}</span>
                        <span className="text-gray-500">({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white shadow-sm p-6 rounded-xl">
                <h3 className="text-lg font-medium mb-4">Insights</h3>
                <p className="text-gray-700">
                  {details.description || `${details.title} shows the current distribution of your fleet. 
                  Most of your vehicles are currently in "Running" state, which indicates good fleet utilization.`}
                </p>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Consider optimizing idle vehicles to improve overall efficiency</li>
                    <li>Regular maintenance should be scheduled for stopped vehicles</li>
                    <li>Monitor running vehicles for optimal route planning</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'line':
        return (
          <div className="space-y-6">
            <div className="bg-white shadow-sm p-6 rounded-xl mb-6">
              <h3 className="text-lg font-medium mb-4">Trend Analysis</h3>
              <div className="h-80">
                <LineChart 
                  data={Array.isArray(details.data) ? details.data : [0]} 
                  labels={Array(Array.isArray(details.data) ? details.data.length : 1).fill('').map((_, i) => i.toString())}
                  height={300}
                  color="#2A6ED2"
                  fillColor="rgba(42, 110, 210, 0.1)"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow-sm p-6 rounded-xl">
                <h3 className="text-lg font-medium mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Highest value:</span>
                    <span className="font-bold">{Math.max(...(Array.isArray(details.data) ? details.data : [0]))} km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Lowest value:</span>
                    <span className="font-bold">{Math.min(...(Array.isArray(details.data) ? details.data : [0]))} km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average:</span>
                    <span className="font-bold">
                      {Array.isArray(details.data) 
                        ? Math.round(details.data.reduce((a: number, b: number) => a + b, 0) / details.data.length) 
                        : 0} km
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total distance:</span>
                    <span className="font-bold">
                      {Array.isArray(details.data) 
                        ? details.data.reduce((a: number, b: number) => a + b, 0) 
                        : 0} km
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white shadow-sm p-6 rounded-xl">
                <h3 className="text-lg font-medium mb-4">Insights</h3>
                <p className="text-gray-700">
                  {details.description || `${details.title} shows the trend over time. 
                  There's a noticeable peak in the middle of the period, which might indicate increased activity or longer routes.`}
                </p>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Review peak usage periods for potential optimization</li>
                    <li>Consider load balancing during high activity periods</li>
                    <li>Analyze drop-offs to identify potential issues</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'progress':
        return (
          <div className="space-y-6">
            <div className="flex justify-center my-8">
              <CircularProgress value={Number(details.data)} size={200} color="#2A6ED2">
                <div className="text-center">
                  <div className="text-4xl font-bold">{details.data}%</div>
                </div>
              </CircularProgress>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow-sm p-6 rounded-xl">
                <h3 className="text-lg font-medium mb-4">Utilization Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <span>Current utilization:</span>
                    <span className="font-bold">{details.data}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-blue-600 h-4 rounded-full" 
                      style={{ width: `${details.data}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Target</div>
                      <div className="text-lg font-bold">85%</div>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Industry Avg</div>
                      <div className="text-lg font-bold">72%</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white shadow-sm p-6 rounded-xl">
                <h3 className="text-lg font-medium mb-4">Insights</h3>
                <p className="text-gray-700">
                  {details.description || `${details.title} is currently at ${details.data}%, which is 
                  ${Number(details.data) >= 85 ? 'above' : 'below'} the target of 85% and 
                  ${Number(details.data) >= 72 ? 'above' : 'below'} the industry average of 72%.`}
                </p>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Schedule preventive maintenance during low utilization periods</li>
                    <li>Analyze idle time to improve operational efficiency</li>
                    <li>Consider reallocation of resources based on utilization patterns</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white shadow-sm p-6 rounded-xl">
            <p>No detailed information available for this diagram.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <button 
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : details ? (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold">{details.title}</h1>
              <p className="text-gray-600">Detailed analysis and insights</p>
            </div>
            
            {renderDiagramDetails()}
          </>
        ) : (
          <div className="bg-white shadow-sm p-6 rounded-xl">
            <h3 className="text-lg font-medium mb-2">No Data Available</h3>
            <p>The requested diagram details could not be found.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DiagramDetails;
