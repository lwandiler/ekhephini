
import React from 'react';
import BannerForm from './BannerForm';
import BannerList from './BannerList';
import BannerHeader from './BannerHeader';
import { useBannerManagement } from '@/hooks/useBannerManagement';

const BannersTab = () => {
  const {
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
  } = useBannerManagement();
  
  return (
    <div className="space-y-6">
      <BannerHeader 
        showForm={showForm} 
        onToggleForm={() => {
          if (showForm) {
            resetFormState();
          } else {
            setShowForm(true);
          }
        }} 
        isEditing={isEditing}
      />
      
      {showForm ? (
        <BannerForm 
          newBanner={newBanner}
          setNewBanner={setNewBanner}
          handleBannerSubmit={handleBannerSubmit}
          onCancel={resetFormState}
          isEditing={isEditing}
        />
      ) : (
        <BannerList 
          banners={banners}
          isLoading={isLoading}
          onDelete={handleDeleteBanner}
          onEdit={handleEditBanner}
          onAddNew={() => setShowForm(true)}
        />
      )}
    </div>
  );
};

export default BannersTab;
