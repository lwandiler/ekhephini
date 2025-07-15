
import { useInlineEdit } from '@/contexts/InlineEditContext';
import { Button } from '@/components/ui/button';
import { Edit3, Eye } from 'lucide-react';

const EditModeToggle = () => {
  const { isEditMode, toggleEditMode, isAdmin } = useInlineEdit();

  // Debug logging
  console.log('EditModeToggle - isAdmin:', isAdmin);
  console.log('EditModeToggle - isEditMode:', isEditMode);
  console.log('EditModeToggle - sessionStorage radioAdminLoggedIn:', sessionStorage.getItem('radioAdminLoggedIn'));

  if (!isAdmin) {
    console.log('EditModeToggle - Not showing because user is not admin');
    return null;
  }

  console.log('EditModeToggle - Rendering button');

  return (
    <div className="fixed bottom-4 right-4 z-50">
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
            Edit Page
          </>
        )}
      </Button>
    </div>
  );
};

export default EditModeToggle;
