
import { useInlineEdit } from '@/contexts/InlineEditContext';
import { Button } from '@/components/ui/button';
import { Edit3, Eye, Save, Settings } from 'lucide-react';

const EditModeToggle = () => {
  const { isEditMode, toggleEditMode, isAdmin, saveChanges, isPreviewMode, setIsPreviewMode } = useInlineEdit();

  if (!isAdmin) return null;

  const handleSave = async () => {
    try {
      await saveChanges();
    } catch (error) {
      // Error handling is done in the context
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {/* Main Edit Toggle */}
      <Button
        onClick={toggleEditMode}
        variant={isEditMode ? "destructive" : "default"}
        size="lg"
        className="shadow-lg"
      >
        {isEditMode ? (
          <>
            <Eye size={20} className="mr-2" />
            Exit Edit Mode
          </>
        ) : (
          <>
            <Edit3 size={20} className="mr-2" />
            Visual Editor
          </>
        )}
      </Button>

      {/* Additional Controls in Edit Mode */}
      {isEditMode && (
        <div className="flex gap-2">
          <Button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            variant={isPreviewMode ? "secondary" : "outline"}
            size="sm"
            className="shadow-lg"
          >
            <Eye size={16} className="mr-1" />
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
          
          <Button
            onClick={handleSave}
            variant="default"
            size="sm"
            className="shadow-lg bg-green-600 hover:bg-green-700"
          >
            <Save size={16} className="mr-1" />
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditModeToggle;
