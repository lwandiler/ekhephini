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
  selectedElement: HTMLElement | null;
  setSelectedElement: (element: HTMLElement | null) => void;
  isPreviewMode: boolean;
  setIsPreviewMode: (preview: boolean) => void;
  saveChanges: () => Promise<void>;
}

const InlineEditContext = createContext<InlineEditContextType | undefined>(undefined);

export const InlineEditProvider = ({ children }: { children: ReactNode }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [pageContent, setPageContent] = useState<Record<string, string>>({});
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { user } = useAuth();
  
  // Check if user is admin
  const isAdmin = user && sessionStorage.getItem('radioAdminLoggedIn') === 'true';

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log('InlineEditContext: checking URL params', { 
      editParam: urlParams.get('edit'),
      isAdmin,
      currentUrl: window.location.href
    });
    if (urlParams.get('edit') === 'true' && isAdmin) {
      console.log('Enabling edit mode from URL');
      setIsEditMode(true);
      toast.success('Visual editing mode enabled', {
        description: 'Click on elements to edit them directly'
      });
    }
  }, [isAdmin]);

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
      
      // Auto-save is handled by saveChanges function
      toast.success('Content updated');
    } catch (error) {
      console.error('Failed to update content:', error);
      toast.error('Failed to update content');
    }
  };

  const saveChanges = async () => {
    try {
      // Save to database
      await stationService.updateStationSettings({
        page_content: pageContent
      });
      
      toast.success('All changes saved successfully');
    } catch (error) {
      console.error('Failed to save changes:', error);
      toast.error('Failed to save changes');
      throw error;
    }
  };

  return (
    <InlineEditContext.Provider value={{
      isEditMode,
      toggleEditMode,
      isAdmin: !!isAdmin,
      updatePageContent,
      pageContent,
      selectedElement,
      setSelectedElement,
      isPreviewMode,
      setIsPreviewMode,
      saveChanges
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