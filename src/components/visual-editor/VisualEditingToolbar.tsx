import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Type, Palette, Upload, Move, Copy, Trash2, Plus, Save, Eye
} from 'lucide-react';

interface ToolbarPosition {
  x: number;
  y: number;
}

interface VisualEditingToolbarProps {
  position: ToolbarPosition;
  elementType: 'text' | 'image' | 'layout' | null;
  selectedElement?: HTMLElement;
  onTextFormat?: (property: string, value: string) => void;
  onImageEdit?: (action: string, value?: any) => void;
  onLayoutEdit?: (action: string, value?: any) => void;
  onAddComponent?: (componentType: string) => void;
  onSave?: () => void;
  onPreview?: () => void;
  onClose?: () => void;
}

const VisualEditingToolbar: React.FC<VisualEditingToolbarProps> = ({
  position,
  elementType,
  selectedElement,
  onTextFormat,
  onImageEdit,
  onLayoutEdit,
  onAddComponent,
  onSave,
  onPreview,
  onClose
}) => {
  const [fontSize, setFontSize] = useState([16]);
  const [textColor, setTextColor] = useState('#000000');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!elementType) return null;

  const handleTextFormat = (property: string, value: string) => {
    if (selectedElement && onTextFormat) {
      selectedElement.style[property as any] = value;
      onTextFormat(property, value);
    }
  };

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value);
    handleTextFormat('fontSize', `${value[0]}px`);
  };

  const handleColorChange = (color: string) => {
    setTextColor(color);
    handleTextFormat('color', color);
  };

  const renderTextTools = () => (
    <div className="flex items-center gap-2 p-2">
      {/* Text Formatting */}
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleTextFormat('fontWeight', 'bold')}
        >
          <Bold size={14} />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleTextFormat('fontStyle', 'italic')}
        >
          <Italic size={14} />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleTextFormat('textDecoration', 'underline')}
        >
          <Underline size={14} />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Alignment */}
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleTextFormat('textAlign', 'left')}
        >
          <AlignLeft size={14} />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleTextFormat('textAlign', 'center')}
        >
          <AlignCenter size={14} />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleTextFormat('textAlign', 'right')}
        >
          <AlignRight size={14} />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Font Size */}
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline">
            <Type size={14} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <div className="space-y-2">
            <label className="text-sm font-medium">Font Size</label>
            <Slider
              value={fontSize}
              onValueChange={handleFontSizeChange}
              max={72}
              min={8}
              step={1}
              className="w-full"
            />
            <div className="text-center text-sm">{fontSize[0]}px</div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Color Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline">
            <Palette size={14} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <div className="space-y-2">
            <label className="text-sm font-medium">Text Color</label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-full h-8 rounded cursor-pointer"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );

  const renderImageTools = () => (
    <div className="flex items-center gap-2 p-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && onImageEdit) {
            onImageEdit('upload', file);
          }
        }}
      />
      
      <Button
        size="sm"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={14} />
        Replace
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={() => onImageEdit?.('crop')}
      >
        Crop
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={() => onImageEdit?.('resize')}
      >
        Resize
      </Button>
    </div>
  );

  const renderLayoutTools = () => (
    <div className="flex items-center gap-2 p-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onLayoutEdit?.('move')}
      >
        <Move size={14} />
        Move
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={() => onLayoutEdit?.('duplicate')}
      >
        <Copy size={14} />
        Duplicate
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={() => onLayoutEdit?.('delete')}
      >
        <Trash2 size={14} />
        Delete
      </Button>
    </div>
  );

  const renderComponentLibrary = () => (
    <div className="flex items-center gap-2 p-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline">
            <Plus size={14} />
            Add Element
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <div className="grid grid-cols-1 gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="justify-start"
              onClick={() => onAddComponent?.('text')}
            >
              Text Block
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="justify-start"
              onClick={() => onAddComponent?.('image')}
            >
              Image
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="justify-start"
              onClick={() => onAddComponent?.('button')}
            >
              Button
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="justify-start"
              onClick={() => onAddComponent?.('section')}
            >
              Section
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="justify-start"
              onClick={() => onAddComponent?.('column')}
            >
              Columns
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <div
      className="fixed z-[100] bg-white border border-gray-200 rounded-lg shadow-lg"
      style={{
        left: position.x,
        top: position.y - 60,
        transform: 'translateX(-50%)'
      }}
    >
      <div className="flex items-center">
        {elementType === 'text' && renderTextTools()}
        {elementType === 'image' && renderImageTools()}
        {elementType === 'layout' && renderLayoutTools()}
        
        {/* Component Library */}
        <Separator orientation="vertical" className="h-6" />
        {renderComponentLibrary()}
        
        {/* Global Actions */}
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-1 p-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onPreview}
          >
            <Eye size={14} />
          </Button>
          
          <Button
            size="sm"
            variant="default"
            onClick={onSave}
          >
            <Save size={14} />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
          >
            ×
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VisualEditingToolbar;