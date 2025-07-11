
import { useState } from 'react';
import { Banner, BannerFormState } from '@/types/banner';
import { getDefaultBannerFormState } from '@/utils/bannerUtils';

export function useBannerState() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [newBanner, setNewBanner] = useState<BannerFormState>(getDefaultBannerFormState());
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetFormState = () => {
    setNewBanner(getDefaultBannerFormState());
    setShowForm(false);
    setIsEditing(false);
    setEditingId(null);
  };

  return {
    banners,
    setBanners,
    isLoading,
    setIsLoading,
    newBanner,
    setNewBanner,
    showForm,
    setShowForm,
    isEditing,
    setIsEditing,
    editingId,
    setEditingId,
    resetFormState
  };
}
