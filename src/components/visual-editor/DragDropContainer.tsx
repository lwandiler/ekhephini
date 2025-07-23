import React, { useState, useRef, useCallback } from 'react';
import { useInlineEdit } from '@/contexts/InlineEditContext';

interface DragDropContainerProps {
  children: React.ReactNode;
  onElementSelect?: (element: HTMLElement, type: 'text' | 'image' | 'layout') => void;
  onElementMove?: (elementId: string, newPosition: { x: number; y: number }) => void;
}

const DragDropContainer: React.FC<DragDropContainerProps> = ({
  children,
  onElementSelect,
  onElementMove
}) => {
  const { isEditMode, isAdmin } = useInlineEdit();
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElement, setDraggedElement] = useState<HTMLElement | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isEditMode || !isAdmin) return;

    const target = e.target as HTMLElement;
    
    // Don't interfere with existing editable components
    if (target.closest('.editable-text') || target.closest('.editable-image')) {
      return;
    }

    // Check if clicking on a draggable element
    const draggableElement = target.closest('[data-draggable="true"]') as HTMLElement;
    if (draggableElement) {
      e.preventDefault();
      setIsDragging(true);
      setDraggedElement(draggableElement);
      
      const rect = draggableElement.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    } else {
      // Element selection for toolbar
      const elementType = getElementType(target);
      if (elementType && onElementSelect) {
        onElementSelect(target, elementType);
      }
    }
  }, [isEditMode, isAdmin, onElementSelect]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !draggedElement) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const newX = e.clientX - containerRect.left - dragOffset.x;
    const newY = e.clientY - containerRect.top - dragOffset.y;

    // Update element position
    draggedElement.style.position = 'absolute';
    draggedElement.style.left = `${newX}px`;
    draggedElement.style.top = `${newY}px`;
    draggedElement.style.zIndex = '1000';
  }, [isDragging, draggedElement, dragOffset]);

  const handleMouseUp = useCallback(() => {
    if (isDragging && draggedElement && onElementMove) {
      const elementId = draggedElement.id || generateElementId();
      if (!draggedElement.id) {
        draggedElement.id = elementId;
      }
      
      const rect = draggedElement.getBoundingClientRect();
      onElementMove(elementId, { x: rect.left, y: rect.top });
    }
    
    setIsDragging(false);
    setDraggedElement(null);
  }, [isDragging, draggedElement, onElementMove]);

  const getElementType = (element: HTMLElement): 'text' | 'image' | 'layout' | null => {
    if (element.tagName === 'IMG') return 'image';
    if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'DIV'].includes(element.tagName)) {
      return element.textContent?.trim() ? 'text' : 'layout';
    }
    if (['SECTION', 'ARTICLE', 'ASIDE', 'HEADER', 'FOOTER', 'NAV'].includes(element.tagName)) {
      return 'layout';
    }
    return null;
  };

  const generateElementId = () => {
    return `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Add draggable attributes to elements in edit mode
  const enhanceChildren = (children: React.ReactNode): React.ReactNode => {
    if (!isEditMode || !isAdmin) return children;

    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        const enhanced = React.cloneElement(child as React.ReactElement<any>, {
          'data-draggable': 'true',
          style: {
            ...((child as React.ReactElement).props.style || {}),
            cursor: isEditMode ? 'move' : 'default',
            outline: isEditMode ? '1px dashed #3b82f6' : 'none',
            outlineOffset: isEditMode ? '2px' : '0'
          }
        });

        // Recursively enhance nested children
        if ((child as React.ReactElement).props.children) {
          return React.cloneElement(enhanced, {
            children: enhanceChildren((child as React.ReactElement).props.children)
          });
        }

        return enhanced;
      }
      return child;
    });
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${isEditMode ? 'cursor-crosshair' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {isEditMode ? enhanceChildren(children) : children}
      
      {isEditMode && (
        <div className="fixed top-4 left-4 z-50 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
          Visual Edit Mode: Click elements to edit, drag to move
        </div>
      )}
    </div>
  );
};

export default DragDropContainer;