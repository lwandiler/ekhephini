
import React from 'react';
import { Card, CardContent as UICardContent } from '@/components/ui/card';
import { Banner } from '@/types/banner';
import CardMedia from './card/CardMedia';
import CardContent from './card/CardContent';

interface BannerCardProps {
  banner: Banner;
  onDelete: (id: string) => void;
  onEdit: (banner: Banner) => void;
  isAdminPage?: boolean;
}

const BannerCard = ({ banner, onDelete, onEdit, isAdminPage = true }: BannerCardProps) => {
  const handleDelete = () => {
    onDelete(banner.id);
  };

  const handleEdit = () => {
    onEdit(banner);
  };

  return (
    <Card key={banner.id} className="overflow-hidden">
      <CardMedia 
        mediaType={banner.mediaType} 
        mediaUrl={banner.mediaUrl} 
        title={banner.title} 
      />
      <UICardContent className="p-4">
        <CardContent 
          title={banner.title}
          subtitle={banner.subtitle}
          url={banner.url}
          onDelete={isAdminPage ? handleDelete : undefined}
          onEdit={isAdminPage ? handleEdit : undefined}
        />
      </UICardContent>
    </Card>
  );
};

export default BannerCard;
