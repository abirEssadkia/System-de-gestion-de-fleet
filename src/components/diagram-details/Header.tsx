
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  description?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, description }) => {
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    navigate('/');
  };
  
  return (
    <>
      <button 
        onClick={handleGoBack}
        className="flex items-center text-fleet-navy hover:text-fleet-blue mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Dashboard
      </button>
      
      <h1 className="text-2xl font-bold text-fleet-navy mb-2">{title}</h1>
      {description && (
        <p className="text-fleet-dark-gray mb-6">{description}</p>
      )}
    </>
  );
};
