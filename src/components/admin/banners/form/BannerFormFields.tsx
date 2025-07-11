
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Video, Image } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BannerFormState } from '@/types/banner';

interface BannerFormFieldsProps {
  banner: BannerFormState;
  onBannerChange: (updates: Partial<BannerFormState>) => void;
  handleMediaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  isEditing: boolean;
}

const BannerFormFields: React.FC<BannerFormFieldsProps> = ({
  banner,
  onBannerChange,
  handleMediaChange,
  isUploading,
  isEditing
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="banner-title">Banner Title</Label>
        <Input 
          id="banner-title" 
          placeholder="Enter banner title" 
          value={banner.title}
          onChange={(e) => onBannerChange({ title: e.target.value })}
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="banner-subtitle">Subtitle (optional)</Label>
        <Input 
          id="banner-subtitle" 
          placeholder="Enter banner subtitle" 
          value={banner.subtitle}
          onChange={(e) => onBannerChange({ subtitle: e.target.value })}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="banner-cta">Call-to-action Text (optional)</Label>
        <Input 
          id="banner-cta" 
          placeholder="E.g., Learn More, Get Started" 
          value={banner.ctaText}
          onChange={(e) => onBannerChange({ ctaText: e.target.value })}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="banner-url">Link URL (optional)</Label>
        <Input 
          id="banner-url" 
          placeholder="Enter URL for banner click" 
          value={banner.url}
          onChange={(e) => onBannerChange({ url: e.target.value })}
        />
        <p className="text-sm text-gray-500">Where users will go when clicking this banner</p>
      </div>
      
      <div className="space-y-2">
        <Label>Media Type</Label>
        <RadioGroup 
          value={banner.mediaType}
          onValueChange={(value) => onBannerChange({ mediaType: value as 'image' | 'video', mediaUrl: isEditing ? banner.mediaUrl : "" })}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="image" id="media-image" />
            <Label htmlFor="media-image" className="flex items-center">
              <Image className="h-4 w-4 mr-1" />
              Image
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="video" id="media-video" />
            <Label htmlFor="media-video" className="flex items-center">
              <Video className="h-4 w-4 mr-1" />
              Video
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="banner-media">
          {isEditing ? 'Replace' : 'Upload'} {banner.mediaType === 'image' ? 'Image' : 'Video'} 
          {isEditing && <span className="text-sm text-gray-500 ml-2">(optional during edit)</span>}
        </Label>
        <Input 
          id="banner-media" 
          type="file" 
          accept={banner.mediaType === 'image' ? "image/*" : "video/mp4,video/webm"}
          onChange={handleMediaChange}
          disabled={isUploading}
          required={!banner.mediaUrl && !isEditing}
        />
        <p className="text-sm text-gray-500">
          {banner.mediaType === 'image' 
            ? 'Recommended size: 1200x400 pixels (max 2MB)' 
            : 'Recommended format: MP4 or WebM (max 10MB)'}
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="banner-order">Display Order</Label>
          <Input 
            id="banner-order" 
            type="number" 
            min="0"
            placeholder="0" 
            value={banner.displayOrder}
            onChange={(e) => onBannerChange({ displayOrder: parseInt(e.target.value) || 0 })}
          />
        </div>
        
        <div className="space-y-2">
          <Label className="mb-2 block">Status</Label>
          <RadioGroup 
            value={banner.active.toString()}
            onValueChange={(value) => onBannerChange({ active: value === 'true' })}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="status-active" />
              <Label htmlFor="status-active">Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="status-inactive" />
              <Label htmlFor="status-inactive">Inactive</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default BannerFormFields;
