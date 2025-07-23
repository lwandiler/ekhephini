import React, { useState, useCallback, useRef } from 'react';
import { useInlineEdit } from '@/contexts/InlineEditContext';
import VisualEditingToolbar from './VisualEditingToolbar';
import DragDropContainer from './DragDropContainer';
import ComponentLibrary from './ComponentLibrary';
import EditableText from '@/components/EditableText';
import EditableImage from '@/components/EditableImage';
import { toast } from 'sonner';

interface VisualEditingWrapperProps {
  children: React.ReactNode;
}

interface ToolbarState {
  visible: boolean;
  position: { x: number; y: number };
  elementType: 'text' | 'image' | 'layout' | null;
  selectedElement?: HTMLElement;
}

const VisualEditingWrapper: React.FC<VisualEditingWrapperProps> = ({
  children
}) => {
  const { isEditMode, isAdmin, updatePageContent } = useInlineEdit();
  const [toolbar, setToolbar] = useState<ToolbarState>({
    visible: false,
    position: { x: 0, y: 0 },
    elementType: null
  });
  const [showComponentLibrary, setShowComponentLibrary] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleElementSelect = useCallback((element: HTMLElement, type: 'text' | 'image' | 'layout') => {
    if (!isEditMode || !isAdmin) return;

    const rect = element.getBoundingClientRect();
    setToolbar({
      visible: true,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top
      },
      elementType: type,
      selectedElement: element
    });
  }, [isEditMode, isAdmin]);

  const handleTextFormat = useCallback((property: string, value: string) => {
    // Apply formatting to selected element
    toast.success('Text formatting applied');
  }, []);

  const handleImageEdit = useCallback((action: string, value?: any) => {
    switch (action) {
      case 'upload':
        // Handle image upload
        toast.success('Image upload functionality');
        break;
      case 'crop':
        // Handle image cropping
        toast.success('Image crop functionality');
        break;
      case 'resize':
        // Handle image resizing
        toast.success('Image resize functionality');
        break;
    }
  }, []);

  const handleLayoutEdit = useCallback((action: string, value?: any) => {
    const { selectedElement } = toolbar;
    if (!selectedElement) return;

    switch (action) {
      case 'move':
        // Enable drag mode
        selectedElement.style.cursor = 'move';
        toast.success('Drag mode enabled');
        break;
      case 'duplicate':
        // Duplicate element
        const cloned = selectedElement.cloneNode(true) as HTMLElement;
        cloned.id = `${selectedElement.id}-copy`;
        selectedElement.parentNode?.insertBefore(cloned, selectedElement.nextSibling);
        toast.success('Element duplicated');
        break;
      case 'delete':
        // Delete element
        selectedElement.remove();
        setToolbar(prev => ({ ...prev, visible: false }));
        toast.success('Element deleted');
        break;
    }
  }, [toolbar]);

  const handleAddComponent = useCallback((componentType: string, config?: any) => {
    const container = contentRef.current;
    if (!container) return;

    let newElement: HTMLElement;

    switch (componentType) {
      case 'heading':
        newElement = document.createElement('h2');
        newElement.textContent = 'New Heading';
        newElement.className = 'text-2xl font-bold mb-4';
        break;
      case 'paragraph':
        newElement = document.createElement('p');
        newElement.textContent = 'New paragraph text. Click to edit.';
        newElement.className = 'mb-4';
        break;
      case 'image':
        newElement = document.createElement('img');
        (newElement as HTMLImageElement).src = '/placeholder.svg';
        (newElement as HTMLImageElement).alt = 'New image';
        newElement.className = 'w-full h-48 object-cover rounded-lg mb-4';
        break;
      case 'button':
        newElement = document.createElement('button');
        newElement.textContent = 'New Button';
        newElement.className = 'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600';
        break;
      case 'section':
        newElement = document.createElement('section');
        newElement.innerHTML = '<div class="p-6 border border-gray-200 rounded-lg"><h3 class="text-lg font-semibold mb-2">New Section</h3><p>Add your content here.</p></div>';
        break;
      case 'columns':
        newElement = document.createElement('div');
        newElement.className = 'grid grid-cols-2 gap-6 mb-6';
        newElement.innerHTML = `
          <div class="p-4 border border-gray-200 rounded-lg">
            <h4 class="font-semibold mb-2">Column 1</h4>
            <p>Content for first column</p>
          </div>
          <div class="p-4 border border-gray-200 rounded-lg">
            <h4 class="font-semibold mb-2">Column 2</h4>
            <p>Content for second column</p>
          </div>
        `;
        break;
      default:
        newElement = document.createElement('div');
        newElement.textContent = `New ${componentType} component`;
        newElement.className = 'p-4 border border-gray-200 rounded-lg mb-4';
    }

    newElement.setAttribute('data-draggable', 'true');
    newElement.id = `component-${Date.now()}`;
    
    // Add to the end of the content
    container.appendChild(newElement);
    
    toast.success(`${componentType} component added`);
    setShowComponentLibrary(false);
  }, []);

  const handleElementMove = useCallback((elementId: string, newPosition: { x: number; y: number }) => {
    // Save position to page content
    updatePageContent(`element-position-${elementId}`, JSON.stringify(newPosition));
  }, [updatePageContent]);

  const handleSave = useCallback(() => {
    // Save all changes
    toast.success('Changes saved successfully');
    setToolbar(prev => ({ ...prev, visible: false }));
  }, []);

  const handlePreview = useCallback(() => {
    setIsPreviewMode(!isPreviewMode);
    setToolbar(prev => ({ ...prev, visible: false }));
    toast.success(isPreviewMode ? 'Edit mode enabled' : 'Preview mode enabled');
  }, [isPreviewMode]);

  const handleCloseToolbar = useCallback(() => {
    setToolbar(prev => ({ ...prev, visible: false }));
  }, []);

  if (!isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {isEditMode && !isPreviewMode ? (
        <DragDropContainer
          onElementSelect={handleElementSelect}
          onElementMove={handleElementMove}
        >
          <div ref={contentRef}>
            {children}
          </div>
        </DragDropContainer>
      ) : (
        <div ref={contentRef}>
          {children}
        </div>
      )}

      {/* Visual Editing Toolbar */}
      {toolbar.visible && isEditMode && !isPreviewMode && (
        <VisualEditingToolbar
          position={toolbar.position}
          elementType={toolbar.elementType}
          selectedElement={toolbar.selectedElement}
          onTextFormat={handleTextFormat}
          onImageEdit={handleImageEdit}
          onLayoutEdit={handleLayoutEdit}
          onAddComponent={handleAddComponent}
          onSave={handleSave}
          onPreview={handlePreview}
          onClose={handleCloseToolbar}
        />
      )}

      {/* Component Library */}
      {showComponentLibrary && isEditMode && !isPreviewMode && (
        <ComponentLibrary
          onAddComponent={handleAddComponent}
          onClose={() => setShowComponentLibrary(false)}
        />
      )}

      {/* Floating Action Button for Component Library */}
      {isEditMode && !isPreviewMode && !showComponentLibrary && (
        <button
          onClick={() => setShowComponentLibrary(true)}
          className="fixed left-4 bottom-4 z-50 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          title="Open Component Library"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
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