
import React from 'react';
import { Button } from '@/components/ui/button';
import { Radio as RadioIcon } from 'lucide-react';

interface ErrorActionsProps {
  onSwitchFallback: () => void;
  onOpenStream: () => void;
}

const ErrorActions: React.FC<ErrorActionsProps> = ({ 
  onSwitchFallback,
  onOpenStream
}) => {
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="ml-2 text-white hover:bg-white/10 text-xs"
        onClick={onSwitchFallback}
        title="Switch to fallback mode"
      >
        Try Fallback
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="ml-2 text-white hover:bg-white/10 text-xs"
        onClick={onOpenStream}
        title="Open stream in browser"
      >
        <RadioIcon size={14} className="mr-1" />
        Open Stream
      </Button>
    </>
  );
};

export default ErrorActions;
