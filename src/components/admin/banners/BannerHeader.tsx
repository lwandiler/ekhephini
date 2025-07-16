
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, PlusCircle, X } from 'lucide-react';
import SampleBannersButton from './SampleBannersButton';

interface BannerHeaderProps {
  showForm: boolean;
  onToggleForm: () => void;
  isEditing: boolean;
  onBannersAdded?: () => void;
}

const BannerHeader = ({ showForm, onToggleForm, isEditing, onBannersAdded }: BannerHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">
        {showForm 
          ? isEditing ? 'Edit Banner' : 'Add New Banner'
          : 'Homepage Banners'
        }
      </h2>
      
      <div className="flex gap-2 items-center">
        {!showForm && onBannersAdded && (
          <SampleBannersButton onBannersAdded={onBannersAdded} />
        )}
        
        <Button
          onClick={onToggleForm}
          variant={showForm ? "outline" : "default"}
          className={showForm ? "border-gray-300" : "bg-radio-accent hover:bg-radio-accent/80"}
        >
          {showForm ? (
            <>
              {isEditing ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancel Edit
                </>
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Banners
                </>
              )}
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Banner
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default BannerHeader;
