
import { Banner, BannerFormState } from '@/types/banner';
import { useBannerState } from './banner/useBannerState';
import { useBannerFetch } from './banner/useBannerFetch';
import { useBannerMutations } from './banner/useBannerMutations';

export function useBannerManagement() {
  const {
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
  } = useBannerState();

  // Fetch banners from the database
  const { fetchBanners } = useBannerFetch(setIsLoading, setBanners);

  // Handle CRUD operations
  const { 
    handleBannerSubmit: handleSubmit, 
    handleEditBanner: handleEdit,
    handleDeleteBanner
  } = useBannerMutations(setBanners, resetFormState);

  // Wrap the handlers to pass the current state
  const handleBannerSubmit = (e: React.FormEvent) => {
    return handleSubmit(e, newBanner, isEditing, editingId);
  };

  const handleEditBanner = (banner: Banner) => {
    return handleEdit(banner, setNewBanner, setIsEditing, setEditingId, setShowForm);
  };

  return {
    banners,
    isLoading,
    newBanner,
    setNewBanner,
    showForm,
    setShowForm,
    handleBannerSubmit,
    handleDeleteBanner,
    handleEditBanner,
    isEditing,
    resetFormState
  };
}
