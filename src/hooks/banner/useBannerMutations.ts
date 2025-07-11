
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Banner, BannerFormState } from '@/types/banner';
import { mapDatabaseBannerToModel, mapModelToDatabaseBanner } from '@/utils/bannerUtils';

type SetBannersFunction = React.Dispatch<React.SetStateAction<Banner[]>>;

export function useBannerMutations(
  setBanners: SetBannersFunction,
  resetFormState: () => void
) {
  const handleBannerSubmit = async (
    e: React.FormEvent,
    newBanner: BannerFormState, 
    isEditing: boolean, 
    editingId: string | null
  ) => {
    e.preventDefault();
    
    if (!newBanner.title || !newBanner.mediaUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide both title and media for the banner.",
      });
      return;
    }
    
    try {
      if (isEditing && editingId) {
        // Update existing banner
        const { data, error } = await supabase
          .from('banners')
          .update(mapModelToDatabaseBanner(newBanner))
          .eq('id', editingId)
          .select();
        
        if (error) {
          console.error("Error updating banner:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update banner. " + error.message,
          });
          return;
        }
        
        if (data && data[0]) {
          // Update banner in local state
          const updatedBannerFormatted = mapDatabaseBannerToModel(data[0]);
          setBanners(prevBanners => 
            prevBanners.map(banner => 
              banner.id === editingId ? updatedBannerFormatted : banner
            )
          );
          
          toast({
            title: "Banner Updated",
            description: "The banner has been updated successfully.",
          });
        }
      } else {
        // Insert new banner
        const { data, error } = await supabase
          .from('banners')
          .insert([mapModelToDatabaseBanner(newBanner)])
          .select();
        
        if (error) {
          console.error("Error adding banner:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to add banner. " + error.message,
          });
          return;
        }
        
        if (data && data[0]) {
          // Add new banner to the local state
          const newBannerFormatted = mapDatabaseBannerToModel(data[0]);
          setBanners(prevBanners => [...prevBanners, newBannerFormatted]);
          
          toast({
            title: "Banner Added",
            description: "The new banner has been added successfully.",
          });
        }
      }
      
      // Reset form and state
      resetFormState();
    } catch (error) {
      console.error("Unexpected error with banner:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const handleEditBanner = (
    banner: Banner, 
    setNewBanner: (banner: BannerFormState) => void,
    setIsEditing: (value: boolean) => void,
    setEditingId: (id: string | null) => void,
    setShowForm: (value: boolean) => void
  ) => {
    // Convert Banner to BannerFormState for editing
    setNewBanner({
      title: banner.title,
      subtitle: banner.subtitle || "",
      mediaType: banner.mediaType,
      mediaUrl: banner.mediaUrl,
      url: banner.url || "",
      ctaText: banner.ctaText || "",
      displayOrder: banner.displayOrder || 0,
      active: banner.active !== undefined ? banner.active : true
    });
    
    setIsEditing(true);
    setEditingId(banner.id);
    setShowForm(true);
  };
  
  const handleDeleteBanner = async (id: string) => {
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting banner:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete banner. " + error.message,
        });
        return;
      }
      
      // Update local state
      setBanners(prevBanners => prevBanners.filter(banner => banner.id !== id));
      
      toast({
        title: "Banner Deleted",
        description: "The banner has been removed successfully.",
      });
    } catch (error) {
      console.error("Unexpected error deleting banner:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return {
    handleBannerSubmit,
    handleEditBanner,
    handleDeleteBanner
  };
}
