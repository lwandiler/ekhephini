
import { useState, useRef, useEffect } from 'react';
import { useInlineEdit } from '@/contexts/InlineEditContext';
import { Button } from '@/components/ui/button';
import { Check, X, Edit3 } from 'lucide-react';

interface EditableTextProps {
  contentKey: string;
  defaultValue: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  placeholder?: string;
}

const EditableText = ({ 
  contentKey, 
  defaultValue, 
  className = '', 
  as: Component = 'p',
  placeholder = 'Click to edit...'
}: EditableTextProps) => {
  const { isEditMode, isAdmin, updatePageContent, pageContent } = useInlineEdit();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentValue = pageContent[contentKey] || defaultValue;
  const isMultiline = Component === 'p' || Component === 'div';

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = () => {
    if (!isEditMode || !isAdmin) return;
    setIsEditing(true);
  };

  const handleSave = async () => {
    await updatePageContent(contentKey, value);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(currentValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isMultiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isAdmin) {
    if (Component === 'div' && (currentValue || defaultValue).includes('<')) {
      return <Component className={className} dangerouslySetInnerHTML={{ __html: currentValue || defaultValue }} />;
    }
    return <Component className={className}>{currentValue || defaultValue}</Component>;
  }

  return (
    <div 
      className={`relative group ${isEditMode ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditing ? (
        <div className="relative">
          {isMultiline ? (
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-full resize-none border-2 border-blue-500 rounded px-2 py-1 ${className}`}
              rows={3}
              placeholder={placeholder}
            />
          ) : (
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-full border-2 border-blue-500 rounded px-2 py-1 bg-transparent ${className}`}
              placeholder={placeholder}
            />
          )}
          <div className="flex gap-1 mt-1">
            <Button size="sm" onClick={handleSave} className="h-6 px-2">
              <Check size={12} />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} className="h-6 px-2">
              <X size={12} />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Component 
            className={`${className} ${isEditMode ? 'hover:bg-blue-50 hover:outline hover:outline-2 hover:outline-blue-300 rounded transition-all' : ''}`}
            onClick={handleEdit}
            {...(Component === 'div' && (currentValue || defaultValue).includes('<') 
              ? { dangerouslySetInnerHTML: { __html: currentValue || defaultValue || placeholder } }
              : {}
            )}
          >
            {Component === 'div' && (currentValue || defaultValue).includes('<') 
              ? undefined 
              : (currentValue || defaultValue || placeholder)
            }
          </Component>
          
          {isEditMode && isHovered && (
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" variant="secondary" className="h-6 w-6 p-0">
                <Edit3 size={12} />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EditableText;
