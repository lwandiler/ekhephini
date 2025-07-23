import React, { useState, useRef, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Save, Eye, X, Plus, Type, Image, Square, 
  Columns, List, Play, MessageSquare 
} from 'lucide-react';
import { useInlineEdit } from '@/contexts/InlineEditContext';
import { toast } from 'sonner';
import DropZone from './DropZone';
import ComponentLibrary from './ComponentLibrary';
import PropertyPanel from './PropertyPanel';

interface VisualEditorProps {
  children: React.ReactNode;
}

export interface EditorElement {
  id: string;
  type: string;
  content: string;
  styles: Record<string, string>;
  attributes: Record<string, any>;
}

const VisualEditor: React.FC<VisualEditorProps> = ({ children }) => {
  const { isEditMode, toggleEditMode, isAdmin, saveChanges } = useInlineEdit();
  const [selectedElement, setSelectedElement] = useState<EditorElement | null>(null);
  const [showComponentLibrary, setShowComponentLibrary] = useState(false);
  const [elements, setElements] = useState<EditorElement[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const handleElementClick = useCallback((event: React.MouseEvent) => {
    if (!isEditMode || !isAdmin) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    const target = event.target as HTMLElement;
    const elementId = target.getAttribute('data-element-id');
    
    if (elementId) {
      const element = elements.find(el => el.id === elementId);
      setSelectedElement(element || null);
    }
  }, [isEditMode, isAdmin, elements]);

  const handleAddComponent = useCallback((componentType: string) => {
    const newElement: EditorElement = {
      id: `element-${Date.now()}`,
      type: componentType,
      content: getDefaultContent(componentType),
      styles: getDefaultStyles(componentType),
      attributes: {}
    };
    
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement);
    setShowComponentLibrary(false);
    toast.success('Component added successfully!');
  }, []);

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
    setSelectedElement(null);
  };

  if (!isAdmin) {
    return <>{children}</>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
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

        {/* Property Panel */}
        {selectedElement && isEditMode && !isPreview && (
          <PropertyPanel
            element={selectedElement}
            onUpdate={(updatedElement) => {
              setElements(prev => 
                prev.map(el => el.id === updatedElement.id ? updatedElement : el)
              );
              setSelectedElement(updatedElement);
            }}
            onClose={() => setSelectedElement(null)}
          />
        )}

        {/* Main Content Area */}
        <div 
          ref={containerRef}
          className={`min-h-screen ${isEditMode && !isPreview ? 'cursor-pointer' : ''}`}
          onClick={handleElementClick}
        >
          {isEditMode && !isPreview ? (
            <DropZone onDrop={handleAddComponent}>
              {children}
            </DropZone>
          ) : (
            children
          )}
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
    </DndProvider>
  );
};

function getDefaultContent(componentType: string): string {
  switch (componentType) {
    case 'heading': return 'Your Heading Here';
    case 'paragraph': return 'Your paragraph text goes here. Click to edit this content.';
    case 'button': return 'Click Me';
    case 'image': return '';
    default: return 'New Element';
  }
}

function getDefaultStyles(componentType: string): Record<string, string> {
  switch (componentType) {
    case 'heading':
      return {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: '1rem'
      };
    case 'paragraph':
      return {
        fontSize: '1rem',
        color: '#d1d5db',
        lineHeight: '1.6',
        marginBottom: '1rem'
      };
    case 'button':
      return {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        border: 'none',
        cursor: 'pointer'
      };
    case 'image':
      return {
        width: '100%',
        height: 'auto',
        borderRadius: '0.5rem'
      };
    default:
      return {};
  }
}

export default VisualEditor;