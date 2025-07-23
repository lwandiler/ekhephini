import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Save, Eye, X, Plus, Type, Image, Square
} from 'lucide-react';
import { useInlineEdit } from '@/contexts/InlineEditContext';
import { toast } from 'sonner';
import ComponentLibrary from './ComponentLibrary';

interface SimpleVisualEditorProps {
  children: React.ReactNode;
}

const SimpleVisualEditor: React.FC<SimpleVisualEditorProps> = ({ children }) => {
  const { isEditMode, toggleEditMode, isAdmin, saveChanges } = useInlineEdit();
  const [showComponentLibrary, setShowComponentLibrary] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  console.log('SimpleVisualEditor render', { isEditMode, isAdmin });

  const handleAddComponent = (componentType: string) => {
    // For now, just show a message - we'll implement this later
    toast.info(`Add ${componentType} component - Coming soon!`);
    setShowComponentLibrary(false);
  };

  const handleSave = async () => {
    try {
      await saveChanges();
      toast.success('Changes saved successfully!');
    } catch (error) {
      toast.error('Failed to save changes');
    }
  };

  const handlePreview = () => {
    setIsPreview(!isPreview);
  };

  if (!isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Visual Editor Toolbar */}
      {isEditMode && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Card className="flex items-center gap-2 p-2 bg-white shadow-lg border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComponentLibrary(!showComponentLibrary)}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Add Component
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreview}
              className="flex items-center gap-2"
            >
              <Eye size={16} />
              {isPreview ? 'Edit' : 'Preview'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="flex items-center gap-2"
            >
              <Save size={16} />
              Save
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleEditMode}
              className="flex items-center gap-2"
            >
              <X size={16} />
              Exit
            </Button>
          </Card>
        </div>
      )}

      {/* Component Library */}
      {showComponentLibrary && isEditMode && (
        <ComponentLibrary
          onAddComponent={handleAddComponent}
          onClose={() => setShowComponentLibrary(false)}
        />
      )}

      {/* Main Content Area */}
      <div className={`min-h-screen ${isEditMode && !isPreview ? 'relative' : ''}`}>
        {children}
      </div>

      {/* Edit Mode Indicator */}
      {isEditMode && (
        <div className="fixed bottom-4 right-4 z-40">
          <Card className="p-3 bg-blue-600 text-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-sm font-medium">
                {isPreview ? 'Preview Mode' : 'Edit Mode'}
              </span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SimpleVisualEditor;