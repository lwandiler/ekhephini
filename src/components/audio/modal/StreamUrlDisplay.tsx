
import React from 'react';
import { Link } from 'lucide-react';
import { RadioStation } from '@/hooks/audio/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StreamUrlDisplayProps {
  station: RadioStation;
}

const StreamUrlDisplay: React.FC<StreamUrlDisplayProps> = ({ station }) => {
  // Prioritize URLs: streamUrl from settings > url > fallback message
  const streamUrl = station.streamUrl || station.url || 'No URL available';
  
  return (
    <div className="flex items-center justify-center mt-4 space-x-2">
      <Link size={12} className="text-blue-300" />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-xs text-gray-200 hover:text-white cursor-default transition-colors">
              Stream URL
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-gray-800 text-white border-gray-700">
            <p className="text-sm">{streamUrl}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default StreamUrlDisplay;
