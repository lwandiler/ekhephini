
import React from 'react';
import { Headphones, Music, Radio } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { SongMetadata } from '@/hooks/audio/types';

interface StationInfoProps {
  showName: string;
  hostName: string;
  streamError: string | null;
  songMetadata?: SongMetadata;
  isLive?: boolean;
  streamUrl?: string;
}

const StationInfo: React.FC<StationInfoProps> = ({ 
  showName, 
  hostName, 
  streamError,
  songMetadata,
  isLive = false,
  streamUrl
}) => {
  console.log('StationInfo: Received songMetadata', songMetadata);
  
  return (
    <div className="flex items-center mb-3 md:mb-0">
      {/* Album cover or station icon */}
      <div className="mr-4 flex-shrink-0">
        {songMetadata?.albumCover ? (
          <img 
            src={songMetadata.albumCover} 
            alt="Album Cover"
            className="w-12 h-12 rounded-lg object-cover shadow-lg"
            onError={(e) => {
              // Fallback to icon if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`bg-radio-light-blue p-3 rounded-full dark:bg-gray-800 ${songMetadata?.albumCover ? 'hidden' : ''}`}>
          <Headphones size={24} className="text-radio-accent dark:text-blue-400" />
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-white text-shadow-sm dark:text-gray-100">{showName}</h3>
          {isLive && (
            <div className="flex items-center gap-1 bg-red-600 px-2 py-1 rounded-full">
              <Radio size={12} className="text-white" />
              <span className="text-xs font-medium text-white">LIVE</span>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-200 dark:text-gray-300">with {hostName}</p>
        {!streamUrl ? (
          <p className="text-xs text-red-300 mt-1 font-medium">Stream Offline</p>
        ) : streamError ? (
          <p className="text-xs text-red-300 mt-1 font-medium">{streamError}</p>
        ) : null}
        
        {/* Display song metadata if available */}
        {songMetadata && (songMetadata.title || songMetadata.artist) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center mt-1 cursor-default">
                <Music size={12} className="mr-1 text-radio-accent dark:text-blue-400 flex-shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-xs whitespace-nowrap text-ellipsis max-w-[220px] text-gray-200 dark:text-gray-300">
                    {songMetadata.title}
                    {songMetadata.artist && songMetadata.artist !== songMetadata.title && (
                      <span className="opacity-75"> • {songMetadata.artist}</span>
                    )}
                  </p>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-900/95 border-gray-700 text-white">
              <div className="text-sm">
                <div className="font-medium">{songMetadata.title}</div>
                {songMetadata.artist && songMetadata.artist !== songMetadata.title && (
                  <div className="text-xs opacity-80">by {songMetadata.artist}</div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default StationInfo;
