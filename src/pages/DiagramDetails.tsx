
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/dashboard/Navbar';
import { Header } from '@/components/diagram-details/Header';
import { DonutChartView } from '@/components/diagram-details/DonutChartView';
import { LineChartView } from '@/components/diagram-details/LineChartView';
import { CircularProgressView } from '@/components/diagram-details/CircularProgressView';
import { AdditionalInfo } from '@/components/diagram-details/AdditionalInfo';

const DiagramDetails = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'donut';
  const title = searchParams.get('title') || 'Chart Details';
  const description = searchParams.get('description') || '';
  const dataParam = searchParams.get('data');
  
  let data = [];
  try {
    data = dataParam ? JSON.parse(dataParam) : [];
  } catch (error) {
    console.error('Error parsing data:', error);
  }

  const renderChart = () => {
    switch (type) {
      case 'donut':
        return <DonutChartView data={data} />;
      case 'line':
        return <LineChartView data={data} />;
      case 'bar':
        return <LineChartView data={data} />;
      case 'progress':
        // Extract the first number from data array or use 0 as default
        const progressValue = Array.isArray(data) && data.length > 0 ? 
          (typeof data[0] === 'number' ? data[0] : 0) : 0;
        return (
          <CircularProgressView 
            data={progressValue}
            title={title}
            description={description}
          />
        );
      default:
        return <DonutChartView data={data} />;
    }
  };

  return (
    <div className="min-h-screen bg-fleet-gray">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Header title={title} description={description} />
          
          {renderChart()}
          
          <AdditionalInfo title={title} data={data} />
        </div>
      </main>
    </div>
  );
};

export default DiagramDetails;
