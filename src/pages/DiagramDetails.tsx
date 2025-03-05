
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/diagram-details/Header';
import { DonutChartView } from '@/components/diagram-details/DonutChartView';
import { LineChartView } from '@/components/diagram-details/LineChartView';
import { CircularProgressView } from '@/components/diagram-details/CircularProgressView';
import { AdditionalInfo } from '@/components/diagram-details/AdditionalInfo';

interface DiagramDetails {
  type: 'donut' | 'line' | 'bar' | 'progress';
  title: string;
  description?: string;
  data: any;
}

const DiagramDetails = () => {
  const [searchParams] = useSearchParams();
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
  
  if (!details) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  const renderChartByType = () => {
    switch (details.type) {
      case 'donut':
        return <DonutChartView data={details.data} />;
      case 'line':
        return <LineChartView data={details.data} />;
      case 'progress':
        return <CircularProgressView data={details.data} />;
      default:
        return <div>Unsupported chart type</div>;
    }
  };
  
  return (
    <div className="min-h-screen bg-fleet-gray p-6">
      <div className="container mx-auto">
        <Header 
          title={details.title} 
          description={details.description} 
        />
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          {renderChartByType()}
          <AdditionalInfo title={details.title} data={details.data} />
        </div>
      </div>
    </div>
  );
};

export default DiagramDetails;
