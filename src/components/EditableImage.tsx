
import { useState, useRef } from 'react';
import { useInlineEdit } from '@/contexts/InlineEditContext';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Edit3, Check, X, Link } from 'lucide-react';

interface EditableImageProps {
  contentKey: string;
  defaultSrc: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}

const EditableImage = ({ 
  contentKey, 
  defaultSrc, 
  alt = '', 
  className = '',
  width,
  height
}: EditableImageProps) => {
  const { isEditMode, isAdmin, updatePageContent, pageContent } = useInlineEdit();
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSrc = pageContent[contentKey] || defaultSrc;

  const { handleMediaUpload, isUploading } = useMediaUpload({
    mediaType: 'image',
    onUploadSuccess: async (url) => {
      await updatePageContent(contentKey, url);
      setIsEditing(false);
    }
  });

  const handleEdit = () => {
    if (!isEditMode || !isAdmin) return;
    setIsEditing(true);
    setUrlInput(currentSrc);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleMediaUpload(file);
    }
  };

  const handleUrlSave = async () => {
    await updatePageContent(contentKey, urlInput);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setUrlInput(currentSrc);
    setIsEditing(false);
  };

  if (!isAdmin) {
    return (
      <img 
        src={currentSrc} 
        alt={alt} 
        className={className}
        width={width}
        height={height}
      />
    );
  }

  return (
    <div 
      className={`relative group ${isEditMode ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditing ? (
        <div className="space-y-3 p-4 border-2 border-blue-500 rounded bg-white">
          <div>
            <label className="block text-sm font-medium mb-2">Upload new image:</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
            >
              <Upload size={16} className="mr-2" />
              {isUploading ? 'Uploading...' : 'Choose File'}
            </Button>
          </div>
          
          <div className="relative">
            <span className="block text-sm text-gray-500 text-center">or</span>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Enter image URL:</label>
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="mb-2"
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleUrlSave} className="flex-1">
              <Check size={16} className="mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              <X size={16} className="mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <img 
            src={currentSrc} 
            alt={alt} 
            className={`${className} ${isEditMode ? 'hover:opacity-75 transition-opacity' : ''}`}
            width={width}
            height={height}
            onClick={handleEdit}
          />
          
          {isEditMode && isHovered && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                <Edit3 size={14} />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EditableImage;
