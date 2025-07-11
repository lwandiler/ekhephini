
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioStation } from '@/hooks/audio/types';
import { openStreamInNewTab } from '@/utils/streamUtils';

interface ModalFooterProps {
  station: RadioStation;
  onClose: () => void;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ station, onClose }) => {
  const handleOpenStream = () => {
    openStreamInNewTab(station);
  };

  return (
    <DialogFooter className="sm:justify-center space-x-2 mt-2">
      <Button 
        variant="outline" 
        onClick={onClose}
        className="border-blue-400/30 text-white hover:bg-blue-800/30 hover:text-white"
      >
        Close
      </Button>
      
      <Button 
        variant="default" 
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        onClick={handleOpenStream}
      >
        Open in Browser
      </Button>
    </DialogFooter>
  );
};

export default ModalFooter;
