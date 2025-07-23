import React, { useState, useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { Button } from '@/components/ui/button';
import { Edit2, Move, Trash2 } from 'lucide-react';
import { EditorElement } from './VisualEditor';

interface EditableElementProps {
  element: EditorElement;
  isSelected: boolean;
  isEditMode: boolean;
  onClick: () => void;
  onUpdate: (element: EditorElement) => void;
  onDelete: () => void;
}

const EditableElement: React.FC<EditableElementProps> = ({
  element,
  isSelected,
  isEditMode,
  onClick,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'ELEMENT',
    item: { id: element.id, type: element.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const handleDoubleClick = () => {
    if (isEditMode) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    if (contentRef.current) {
      const newContent = contentRef.current.innerText;
      onUpdate({ ...element, content: newContent });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
  };

  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus();
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(contentRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);

  const renderElement = () => {
    const baseStyles = {
      ...element.styles,
      position: 'relative' as const,
      outline: isSelected ? '2px solid #3b82f6' : 'none',
      opacity: isDragging ? 0.5 : 1
    };

    const commonProps = {
      ref: drag,
      style: baseStyles,
      onClick,
      onDoubleClick: handleDoubleClick,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      'data-element-id': element.id
    };

    switch (element.type) {
      case 'heading':
        return (
          <h1 {...commonProps}>
            <div
              ref={contentRef}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className={isEditing ? 'outline-none' : ''}
            >
              {element.content}
            </div>
          </h1>
        );

      case 'paragraph':
        return (
          <p {...commonProps}>
            <div
              ref={contentRef}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className={isEditing ? 'outline-none' : ''}
            >
              {element.content}
            </div>
          </p>
        );

      case 'button':
        return (
          <button {...commonProps}>
            <div
              ref={contentRef}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className={isEditing ? 'outline-none' : ''}
            >
              {element.content}
            </div>
          </button>
        );

      case 'image':
        return (
          <div {...commonProps}>
            <img
              src={element.attributes.src || '/placeholder.svg'}
              alt={element.content}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        );

      default:
        return (
          <div {...commonProps}>
            <div
              ref={contentRef}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className={isEditing ? 'outline-none' : ''}
            >
              {element.content}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative group">
      {renderElement()}
      
      {/* Element Controls */}
      {isEditMode && (isSelected || isHovered) && (
        <div className="absolute -top-8 left-0 flex gap-1 bg-blue-600 rounded px-2 py-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-white hover:bg-blue-700"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <Edit2 size={12} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-white hover:bg-blue-700 cursor-move"
            ref={drag}
          >
            <Move size={12} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-white hover:bg-red-600"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 size={12} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditableElement;