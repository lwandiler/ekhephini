
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BannerFormState } from '@/types/banner';
import MediaPreview from './form/MediaPreview';
import BannerFormFields from './form/BannerFormFields';
import BannerFormActions from './form/BannerFormActions';
import { useMediaUpload } from '@/hooks/useMediaUpload';

interface BannerFormProps {
  newBanner: BannerFormState;
  setNewBanner: React.Dispatch<React.SetStateAction<BannerFormState>>;
  handleBannerSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const BannerForm = ({ 
  newBanner, 
  setNewBanner, 
  handleBannerSubmit, 
  onCancel, 
  isEditing 
}: BannerFormProps) => {
  const { isUploading, uploadProgress, handleMediaUpload } = useMediaUpload({
    mediaType: newBanner.mediaType,
    onUploadSuccess: (url) => setNewBanner({...newBanner, mediaUrl: url})
  });
  
  const handleMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    await handleMediaUpload(file);
  };

  const handleBannerChange = (updates: Partial<BannerFormState>) => {
    setNewBanner(current => ({...current, ...updates}));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Banner' : 'Add New Banner'}</CardTitle>
        <CardDescription>
          {isEditing 
            ? 'Update the existing banner with new information.' 
            : 'Create a new banner for the homepage carousel.'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleBannerSubmit}>
        <CardContent className="space-y-4">
          <BannerFormFields
            banner={newBanner}
            onBannerChange={handleBannerChange}
            handleMediaChange={handleMediaChange}
            isUploading={isUploading}
            isEditing={isEditing}
          />
          
          <MediaPreview
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            mediaType={newBanner.mediaType}
            mediaUrl={newBanner.mediaUrl}
          />
        </CardContent>
        
        <CardFooter>
          <BannerFormActions
            isUploading={isUploading}
            hasMediaUrl={!!newBanner.mediaUrl}
            onCancel={onCancel}
            isEditing={isEditing}
          />
        </CardFooter>
      </form>
    </Card>
  );
};

export default BannerForm;
