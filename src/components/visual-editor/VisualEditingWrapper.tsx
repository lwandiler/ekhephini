import React, { useState, useCallback, useRef } from 'react';
import { useInlineEdit } from '@/contexts/InlineEditContext';
import EditableText from '@/components/EditableText';
import EditableImage from '@/components/EditableImage';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Plus, Save, Eye } from 'lucide-react';

interface VisualEditingWrapperProps {
  children: React.ReactNode;
}

const VisualEditingWrapper: React.FC<VisualEditingWrapperProps> = ({
  children
}) => {
  const { isEditMode, isAdmin, saveChanges, isPreviewMode, setIsPreviewMode } = useInlineEdit();
  const [showHelp, setShowHelp] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleSave = useCallback(async () => {
    try {
      await saveChanges();
      toast.success('Changes saved successfully');
    } catch (error) {
      toast.error('Failed to save changes');
    }
  }, [saveChanges]);

  const handlePreview = useCallback(() => {
    setIsPreviewMode(!isPreviewMode);
    toast.success(isPreviewMode ? 'Edit mode enabled' : 'Preview mode enabled');
  }, [isPreviewMode, setIsPreviewMode]);

  if (!isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {isEditMode && !isPreviewMode ? (
        <div 
          ref={contentRef}
          className="relative"
        >
          {children}
          
          {/* Visual Editing Indicators */}
          <div className="fixed top-4 left-4 z-50 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            Visual Edit Mode: Click on text and images to edit
          </div>

          {/* Quick Action Toolbar */}
          <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2">
            <Button
              onClick={handleSave}
              variant="default"
              size="sm"
              className="shadow-lg bg-green-600 hover:bg-green-700"
            >
              <Save size={16} className="mr-1" />
              Save Changes
            </Button>
            
            <Button
              onClick={handlePreview}
              variant="outline"
              size="sm"
              className="shadow-lg"
            >
              <Eye size={16} className="mr-1" />
              Preview
            </Button>
          </div>
        </div>
      ) : (
        <div ref={contentRef}>
          {children}
        </div>
      )}

      {/* Preview Mode Indicator */}
      {isPreviewMode && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm">
          Preview Mode - Changes are not saved
        </div>
      )}
    </div>
  );
};

export default VisualEditingWrapper;