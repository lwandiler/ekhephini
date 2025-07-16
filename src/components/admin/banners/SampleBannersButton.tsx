
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Trash2, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { addSampleBanners, clearExistingBanners } from '@/utils/sampleBanners';

interface SampleBannersButtonProps {
  onBannersAdded: () => void;
}

const SampleBannersButton: React.FC<SampleBannersButtonProps> = ({ onBannersAdded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleAddSampleBanners = async () => {
    setIsLoading(true);
    try {
      await addSampleBanners();
      toast({
        title: "Sample Banners Added",
        description: "5 sample radio station banners have been added to your database.",
      });
      onBannersAdded();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add sample banners. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearBanners = async () => {
    setIsClearing(true);
    try {
      await clearExistingBanners();
      toast({
        title: "Banners Cleared",
        description: "All existing banners have been removed from the database.",
      });
      onBannersAdded();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear banners. Please try again.",
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleAddSampleBanners}
        disabled={isLoading}
        variant="outline"
        className="border-green-300 text-green-700 hover:bg-green-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Add Sample Banners
          </>
        )}
      </Button>
      
      <Button
        onClick={handleClearBanners}
        disabled={isClearing}
        variant="outline"
        className="border-red-300 text-red-700 hover:bg-red-50"
      >
        {isClearing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Clearing...
          </>
        ) : (
          <>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Banners
          </>
        )}
      </Button>
    </div>
  );
};

export default SampleBannersButton;
