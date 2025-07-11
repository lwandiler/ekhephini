
import React from 'react';
import { Banner } from '@/types/banner';
import BannerGrid from './list/BannerGrid';
import EmptyState from './list/EmptyState';
import LoadingState from './list/LoadingState';

interface BannerListProps {
  banners: Banner[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onEdit: (banner: Banner) => void;
  onAddNew: () => void;
}

const BannerList = ({ banners, isLoading, onDelete, onEdit, onAddNew }: BannerListProps) => {
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (banners.length === 0) {
    return <EmptyState onAddNew={onAddNew} />;
  }
  
  return (
    <div className="space-y-4">
      <BannerGrid banners={banners} onDelete={onDelete} onEdit={onEdit} />
    </div>
  );
};

export default BannerList;
