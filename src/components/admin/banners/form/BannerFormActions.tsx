
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface BannerFormActionsProps {
  isUploading: boolean;
  hasMediaUrl: boolean;
  onCancel: () => void;
  isEditing: boolean;
}

const BannerFormActions: React.FC<BannerFormActionsProps> = ({ 
  isUploading, 
  hasMediaUrl, 
  onCancel,
  isEditing
}) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button 
        variant="outline" 
        type="button" 
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="bg-radio-accent hover:bg-radio-accent/80"
        disabled={isUploading || (!hasMediaUrl && !isEditing)}
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : isEditing ? 'Update Banner' : 'Save Banner'}
      </Button>
    </div>
  );
};

export default BannerFormActions;
