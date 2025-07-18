import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File;
  onSave: (editedImageFile: File) => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  isOpen,
  onClose,
  imageFile,
  onSave
}) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [imageSrc, setImageSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setWidth(naturalWidth);
    setHeight(naturalHeight);
    
    // Set initial crop to center 80% of image
    const centerCrop: Crop = {
      unit: '%',
      x: 10,
      y: 10,
      width: 80,
      height: 80,
    };
    setCrop(centerCrop);
  }, []);

  const generateEditedImage = useCallback(async (): Promise<File | null> => {
    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    
    if (!image || !canvas || !completedCrop) {
      return null;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    
    const ctx = offscreen.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );

    const blob = await offscreen.convertToBlob({
      type: 'image/jpeg',
      quality: 0.9,
    });

    const fileName = `edited_${imageFile.name}`;
    return new File([blob], fileName, { type: 'image/jpeg' });
  }, [completedCrop, imageFile]);

  const handleSave = async () => {
    const editedFile = await generateEditedImage();
    if (editedFile) {
      onSave(editedFile);
      onClose();
    }
  };

  const handleWidthChange = (value: string) => {
    const newWidth = parseInt(value) || 0;
    if (newWidth > 0 && height > 0) {
      const aspectRatio = width / height;
      setWidth(newWidth);
      setHeight(Math.round(newWidth / aspectRatio));
    }
  };

  const handleHeightChange = (value: string) => {
    const newHeight = parseInt(value) || 0;
    if (newHeight > 0 && width > 0) {
      const aspectRatio = width / height;
      setHeight(newHeight);
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Image</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Scale</Label>
              <Slider
                value={[scale]}
                onValueChange={(value) => setScale(value[0])}
                min={0.1}
                max={3}
                step={0.1}
                className="w-full"
              />
              <div className="text-sm text-muted-foreground text-center">
                {Math.round(scale * 100)}%
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="width">Width (px)</Label>
              <Input
                id="width"
                type="number"
                value={width}
                onChange={(e) => handleWidthChange(e.target.value)}
                min="1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => handleHeightChange(e.target.value)}
                min="1"
              />
            </div>
          </div>

          {/* Image Editor */}
          <div className="flex justify-center">
            <div className="max-w-full">
              {imageSrc && (
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={undefined}
                  className="max-w-full"
                >
                  <img
                    ref={imgRef}
                    alt="Crop preview"
                    src={imageSrc}
                    style={{ 
                      transform: `scale(${scale})`,
                      maxWidth: '100%',
                      height: 'auto'
                    }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              )}
            </div>
          </div>

          {/* Hidden canvas for preview */}
          <canvas
            ref={previewCanvasRef}
            style={{ display: 'none' }}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-radio-accent hover:bg-radio-accent/80">
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};