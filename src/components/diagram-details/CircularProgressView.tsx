
import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface CircularProgressViewProps {
  data: number;
  title?: string;
  description?: string;
}

export const CircularProgressView: React.FC<CircularProgressViewProps> = ({ 
  data, 
  title,
  description 
}) => {
  // S'assurer que la valeur est un nombre
  const value = typeof data === 'number' ? data : 0;
  
  // Déterminer le type de métrique basé sur le titre
  const isIdleTime = title?.toLowerCase().includes('idle');
  const isFuelWaste = title?.toLowerCase().includes('fuel');
  const isUtilization = title?.toLowerCase().includes('utilization');
  
  // Adapter l'affichage selon le type de métrique
  let displayValue = value;
  let suffix = '';
  let color = '#2A6ED2';
  let maxValue = 100;
  
  if (isIdleTime) {
    suffix = ' hours';
    color = '#FFB400';
    maxValue = 200; // Max pour les heures d'inactivité
    displayValue = Math.min(value, maxValue);
  } else if (isFuelWaste) {
    suffix = ' L';
    color = '#FF5A5F';
    maxValue = 100; // Max pour le gaspillage de carburant
    displayValue = Math.min(value, maxValue);
  } else if (isUtilization) {
    suffix = '%';
    color = '#2A6ED2';
    maxValue = 100;
    displayValue = Math.min(Math.max(value, 0), 100);
  }
  
  // Calculer le pourcentage pour la barre circulaire
  const percentage = (displayValue / maxValue) * 100;
  
  return (
    <div className="flex justify-center my-8">
      <div className="w-64">
        <CircularProgressbar
          value={percentage}
          text={`${displayValue}${suffix}`}
          styles={buildStyles({
            rotation: 0.25,
            strokeLinecap: 'round',
            textSize: '16px',
            pathTransitionDuration: 0.5,
            pathColor: color,
            textColor: '#333333',
            trailColor: '#e6e6e6',
          })}
        />
        
        <div className="mt-8 text-center">
          <h3 className="text-xl font-semibold">{title || 'Fleet Metric'}</h3>
          <p className="text-gray-600 mt-2">
            {description || 'This metric shows important fleet performance data.'}
          </p>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md">
            <h4 className="font-medium text-blue-800">Performance Insights:</h4>
            <ul className="list-disc list-inside text-sm mt-2 text-blue-700">
              {isIdleTime && (
                <>
                  <li>Current idle time is {value} hours</li>
                  <li>Industry average idle time is around 40-50 hours per week</li>
                  {value > 50 && (
                    <li>Consider implementing idle reduction strategies to improve efficiency</li>
                  )}
                  {value <= 50 && value > 30 && (
                    <li>Good idle time management, maintain current practices</li>
                  )}
                  {value <= 30 && (
                    <li>Excellent idle time control! Your fleet is very efficient</li>
                  )}
                </>
              )}
              {isFuelWaste && (
                <>
                  <li>Current fuel waste is {value} liters</li>
                  <li>This represents potential cost savings opportunity</li>
                  {value > 40 && (
                    <li>Consider driver training and route optimization to reduce fuel waste</li>
                  )}
                  {value <= 40 && value > 20 && (
                    <li>Moderate fuel efficiency, room for improvement</li>
                  )}
                  {value <= 20 && (
                    <li>Excellent fuel efficiency! Keep up the good work</li>
                  )}
                </>
              )}
              {isUtilization && (
                <>
                  <li>Current utilization is at {value}%</li>
                  <li>Industry average is around 65%</li>
                  {value < 65 && (
                    <li>Consider optimizing vehicle scheduling to improve utilization</li>
                  )}
                  {value >= 65 && value < 80 && (
                    <li>Good utilization rate, maintain current operations</li>
                  )}
                  {value >= 80 && (
                    <li>Excellent utilization! Consider if fleet expansion may be needed</li>
                  )}
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
