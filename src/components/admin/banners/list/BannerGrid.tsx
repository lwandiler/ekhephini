
import React from 'react';
import { Banner } from '@/types/banner';
import BannerCard from '../BannerCard';

interface BannerGridProps {
  banners: Banner[];
  onDelete: (id: string) => void;
  onEdit: (banner: Banner) => void;
  isAdminPage?: boolean;
}

const BannerGrid: React.FC<BannerGridProps> = ({ 
  banners, 
  onDelete, 
  onEdit,
  isAdminPage = true // Default to true since it's in the admin folder
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {banners.map((banner) => (
        <BannerCard 
          key={banner.id} 
          banner={banner} 
          onDelete={onDelete}
          onEdit={onEdit}
          isAdminPage={isAdminPage}
        />
      ))}
    </div>
  );
};

export default BannerGrid;
