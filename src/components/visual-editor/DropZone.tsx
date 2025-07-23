import React from 'react';
import { useDrop } from 'react-dnd';

interface DropZoneProps {
  children: React.ReactNode;
  onDrop: (componentType: string) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ children, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'COMPONENT',
    drop: (item: { type: string }) => {
      onDrop(item.type);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  return (
    <div
      ref={drop}
      className={`relative min-h-full ${
        isOver && canDrop ? 'ring-2 ring-blue-400 ring-inset' : ''
      }`}
    >
      {children}
      
      {isOver && canDrop && (
        <div className="absolute inset-0 bg-blue-100 bg-opacity-20 pointer-events-none">
          <div className="flex items-center justify-center h-full">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
              Drop component here
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropZone;