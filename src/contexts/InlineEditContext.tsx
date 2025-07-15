
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { stationService } from '@/services/api/stationService';
import { toast } from 'sonner';

interface InlineEditContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  isAdmin: boolean;
  updatePageContent: (key: string, value: string) => Promise<void>;
  pageContent: Record<string, string>;
}

const InlineEditContext = createContext<InlineEditContextType | undefined>(undefined);

export const InlineEditProvider = ({ children }: { children: ReactNode }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [pageContent, setPageContent] = useState<Record<string, string>>({});
  const { user } = useAuth();
  
  // Check if user is admin
  const isAdmin = user && sessionStorage.getItem('radioAdminLoggedIn') === 'true';

  // Debug logging
  console.log('InlineEditProvider - user:', user);
  console.log('InlineEditProvider - sessionStorage radioAdminLoggedIn:', sessionStorage.getItem('radioAdminLoggedIn'));
  console.log('InlineEditProvider - isAdmin:', isAdmin);

  useEffect(() => {
    // Load existing page content from station settings
    const loadPageContent = async () => {
      try {
        const settings = await stationService.getStationSettings();
        if (settings?.page_content) {
          setPageContent(settings.page_content);
        }
      } catch (error) {
        console.error('Failed to load page content:', error);
      }
    };

    loadPageContent();
  }, []);

  const toggleEditMode = () => {
    if (!isAdmin) return;
    setIsEditMode(!isEditMode);
    
    if (!isEditMode) {
      toast.success('Edit mode enabled', {
        description: 'Click on text and images to edit them directly'
      });
    } else {
      toast.success('Edit mode disabled');
    }
  };

  const updatePageContent = async (key: string, value: string) => {
    try {
      const updatedContent = { ...pageContent, [key]: value };
      setPageContent(updatedContent);
      
      // Save to database
      await stationService.updateStationSettings({
        page_content: updatedContent
      });
      
      toast.success('Content updated successfully');
    } catch (error) {
      console.error('Failed to update content:', error);
      toast.error('Failed to update content');
    }
  };

  return (
    <InlineEditContext.Provider value={{
      isEditMode,
      toggleEditMode,
      isAdmin: !!isAdmin,
      updatePageContent,
      pageContent
    }}>
      {children}
    </InlineEditContext.Provider>
  );
};

export const useInlineEdit = () => {
  const context = useContext(InlineEditContext);
  if (!context) {
    throw new Error('useInlineEdit must be used within an InlineEditProvider');
  }
  return context;
};
