import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { pagesService, Page } from '@/services/api/pagesService';
import { useToast } from '@/hooks/use-toast';
import { Save, Eye, X, Edit } from 'lucide-react';

interface InlinePageEditorProps {
  pageId: string;
  children: (page: Page | null, isEditing: boolean) => React.ReactNode;
}

const InlinePageEditor = ({ pageId, children }: InlinePageEditorProps) => {
  const [page, setPage] = useState<Page | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadPage = async () => {
      try {
        // Check if we're in inline edit mode from admin
        const inlineEditMode = sessionStorage.getItem('inlineEditMode');
        const inlineEditPageData = sessionStorage.getItem('inlineEditPage');
        
        if (inlineEditMode === 'true' && inlineEditPageData) {
          const editPageData = JSON.parse(inlineEditPageData);
          if (editPageData.id === pageId || editPageData.slug === pageId) {
            setPage(editPageData);
            setEditContent(editPageData.content);
            setOriginalContent(editPageData.content);
            setIsEditing(true);
            // Clear the session storage after loading
            sessionStorage.removeItem('inlineEditMode');
            sessionStorage.removeItem('inlineEditPage');
            setLoading(false);
            return;
          }
        }

        // Regular page loading
        const pages = await pagesService.getAllPages();
        const foundPage = pages.find(p => p.id === pageId || p.slug === pageId);
        
        if (foundPage) {
          setPage(foundPage);
          setEditContent(foundPage.content);
          setOriginalContent(foundPage.content);
        }
      } catch (error) {
        console.error('Failed to load page:', error);
        toast({
          title: "Error",
          description: "Failed to load page content",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [pageId, toast]);

  const handleSave = async () => {
    if (!page) return;
    
    try {
      const updatedPage = { ...page, content: editContent };
      await pagesService.updatePage(page.id, updatedPage);
      
      setPage(updatedPage);
      setOriginalContent(editContent);
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Page content updated successfully"
      });
    } catch (error) {
      console.error('Failed to save page:', error);
      toast({
        title: "Error",
        description: "Failed to save page content",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setEditContent(originalContent);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    // Check if user is admin
    const isAdmin = sessionStorage.getItem('radioAdminLoggedIn') === 'true';
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You need admin access to edit pages",
        variant: "destructive"
      });
      return;
    }
    setIsEditing(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading page content...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Floating action buttons */}
      {sessionStorage.getItem('radioAdminLoggedIn') === 'true' && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
                size="sm"
              >
                <Save size={16} className="mr-1" />
                Save Changes
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="bg-white shadow-lg"
                size="sm"
              >
                <X size={16} className="mr-1" />
                Cancel
              </Button>
            </>
          ) : (
            <Button
              onClick={handleStartEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              size="sm"
            >
              <Edit size={16} className="mr-1" />
              Edit Page
            </Button>
          )}
          <Button
            onClick={() => window.location.href = '/admin'}
            variant="outline"
            className="bg-white shadow-lg"
            size="sm"
          >
            <Eye size={16} className="mr-1" />
            Back to Admin
          </Button>
        </div>
      )}

      {/* Content editor overlay */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Page Content</h3>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm"
              placeholder="Enter your page content (HTML supported)..."
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Render the page content */}
      {children(page, isEditing)}
    </div>
  );
};

export default InlinePageEditor;