
import React from 'react';

interface StationDisplayProps {
  stationName: string;
}

const StationDisplay: React.FC<StationDisplayProps> = ({ stationName }) => {
  return (
    <div className="hidden lg:flex flex-col text-right">
      <span className="text-sm text-gray-300 dark:text-gray-400">Streaming live on</span>
      <h4 className="font-medium text-white text-shadow-sm dark:text-gray-100">{stationName}</h4>
    </div>
  );
};

export default StationDisplay;
