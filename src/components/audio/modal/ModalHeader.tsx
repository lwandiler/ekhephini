
import React from 'react';
import { 
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Radio } from 'lucide-react';

interface ModalHeaderProps {
  stationName: string;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ stationName }) => {
  return (
    <DialogHeader className="text-white">
      <DialogTitle className="flex items-center gap-2 text-white text-shadow-md">
        <Radio className="h-5 w-5 text-blue-300 animate-pulse" />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-blue-300 font-bold">
          Live Radio Player
        </span>
      </DialogTitle>
      <DialogDescription className="text-blue-100 font-medium">
        Currently streaming: {stationName}
      </DialogDescription>
    </DialogHeader>
  );
};

export default ModalHeader;
