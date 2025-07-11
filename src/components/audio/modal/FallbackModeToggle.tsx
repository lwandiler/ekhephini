
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FallbackModeToggleProps {
  fallbackMode: boolean;
  setFallbackMode: (mode: boolean) => void;
}

const FallbackModeToggle: React.FC<FallbackModeToggleProps> = ({ 
  fallbackMode, 
  setFallbackMode 
}) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Switch 
        id="fallback-mode" 
        checked={fallbackMode}
        onCheckedChange={setFallbackMode}
      />
      <Label 
        htmlFor="fallback-mode"
        className="text-sm text-gray-200 cursor-pointer"
      >
        Fallback Mode
      </Label>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info size={14} className="text-blue-300 hover:text-blue-200 cursor-help" />
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-gray-800 text-white border-gray-700 max-w-[250px]">
            <p className="text-xs">
              Fallback mode uses a different audio playback method that may work better on some devices and browsers.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default FallbackModeToggle;
