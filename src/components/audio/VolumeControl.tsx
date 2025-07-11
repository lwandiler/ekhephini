
import React from 'react';
import { Volume } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number[]) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ volume, onVolumeChange }) => {
  // Helper function to handle array parameter expected by onVolumeChange
  const handleVolumeChange = (value: number[]) => {
    console.log("Volume changing to:", value[0]);
    onVolumeChange(value);
  };

  return (
    <div className="flex items-center space-x-2 w-28 md:w-40">
      <Volume size={18} className="text-gray-200" />
      <Slider
        value={[volume]}
        min={0}
        max={100}
        step={1}
        onValueChange={handleVolumeChange}
        className="cursor-pointer"
      />
    </div>
  );
};

export default VolumeControl;
