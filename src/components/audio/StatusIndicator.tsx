
import React from 'react';

interface StatusIndicatorProps {
  isPlaying: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ isPlaying }) => {
  return (
    <div className="hidden md:block">
      <span className="text-sm font-medium bg-radio-accent/20 text-white px-2 py-1 rounded-md dark:bg-blue-600/20 dark:text-blue-100 border border-radio-accent/30 dark:border-blue-400/30">
        {isPlaying ? 'LIVE' : 'PAUSED'}
      </span>
    </div>
  );
};

export default StatusIndicator;
