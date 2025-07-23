import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { Upload, Link, Image, Check, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MediaFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, any>;
  publicUrl: string;
}

interface MediaPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  mediaType?: 'image' | 'video' | 'all';
  title?: string;
}

export const MediaPickerModal = ({ 
  open, 
  onOpenChange, 
  onSelect, 
  mediaType = 'all',
  title = 'Select Media'
}: MediaPickerModalProps) => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { isUploading, handleMediaUpload } = useMediaUpload({
    mediaType: mediaType === 'all' ? 'image' : mediaType,
    onUploadSuccess: (url) => {
      onSelect(url);
      onOpenChange(false);
      toast({
        title: "Success",
        description: "File uploaded successfully!",
      });
    }
  });

  useEffect(() => {
    if (open) {
      loadMediaFiles();
    }
  }, [open]);

  const loadMediaFiles = async () => {
    try {
      setLoading(true);
      
      const listAllFiles = async (path = '', allFiles: any[] = []): Promise<any[]> => {
        const { data: items, error } = await supabase
          .storage
          .from('media')
          .list(path, {
            limit: 1000
          });

        if (error) throw error;

        for (const item of items || []) {
          const fullPath = path ? `${path}/${item.name}` : item.name;
          
          if (item.metadata === null) {
            // This is a folder, recursively list its contents
            await listAllFiles(fullPath, allFiles);
          } else {
            // This is a file
            allFiles.push({
              ...item,
              name: fullPath
            });
          }
        }

        return allFiles;
      };

      const files = await listAllFiles();
      
      // Get public URLs for all files
      const filesWithUrls = files.map(file => {
        const { data: { publicUrl } } = supabase
          .storage
          .from('media')
          .getPublicUrl(file.name);

        return {
          ...file,
          publicUrl
        };
      });

      // Filter by media type if specified
      const filteredFiles = mediaType === 'all' 
        ? filesWithUrls
        : filesWithUrls.filter(file => {
            const mimetype = file.metadata?.mimetype || '';
            return mimetype.startsWith(`${mediaType}/`);
          });

      setMediaFiles(filteredFiles);
    } catch (error) {
      console.error('Error loading media files:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load media files.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFileType = (mimetype?: string) => {
    if (!mimetype) return 'File';
    if (mimetype.startsWith('image/')) return 'Image';
    if (mimetype.startsWith('video/')) return 'Video';
    if (mimetype.startsWith('audio/')) return 'Audio';
    return 'File';
  };

  const isImage = (mimetype?: string) => mimetype?.startsWith('image/') || false;

  const filteredFiles = mediaFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectFromLibrary = () => {
    if (selectedFile) {
      onSelect(selectedFile);
      onOpenChange(false);
      setSelectedFile('');
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onSelect(urlInput.trim());
      onOpenChange(false);
      setUrlInput('');
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file) {
      await handleMediaUpload(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col bg-white border border-gray-200 shadow-xl z-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="library" className="flex-1 flex flex-col overflow-hidden bg-white">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 text-black">
            <TabsTrigger value="library" className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-black">Media Library</TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-black">Upload New</TabsTrigger>
            <TabsTrigger value="url" className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-black">URL</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="flex-1 flex flex-col overflow-hidden mt-4 bg-white text-black">
            <div className="flex items-center gap-2 mb-4 bg-white">
              <Search className="h-4 w-4 text-gray-600" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-white border-gray-300 text-black placeholder:text-gray-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto border border-gray-300 rounded-lg p-4 bg-white">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="aspect-square w-full" />
                  ))}
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="text-center py-12 text-gray-600">
                  {searchTerm ? (
                    <p>No files found matching "{searchTerm}".</p>
                  ) : (
                    <p>No media files found.</p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.name}
                      className={`relative border-2 rounded-lg cursor-pointer transition-all hover:shadow-md bg-white ${
                        selectedFile === file.publicUrl
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                      onClick={() => setSelectedFile(file.publicUrl)}
                    >
                      <div className="aspect-square bg-gray-100 flex items-center justify-center rounded-t-lg overflow-hidden">
                        {isImage(file.metadata?.mimetype) ? (
                          <img
                            src={file.publicUrl}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center text-gray-600">
                            <div className="text-2xl mb-1">
                              {getFileType(file.metadata?.mimetype) === 'Video' ? '🎥' : 
                               getFileType(file.metadata?.mimetype) === 'Audio' ? '🎵' : '📄'}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {getFileType(file.metadata?.mimetype)}
                            </Badge>
                          </div>
                        )}
                        {selectedFile === file.publicUrl && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                      <div className="p-2 bg-white">
                        <p className="text-xs text-gray-600 truncate" title={file.name}>
                          {file.name.split('/').pop()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4 bg-white pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSelectFromLibrary} 
                disabled={!selectedFile}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Select File
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="flex-1 flex flex-col justify-center bg-white text-black">
            <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={mediaType === 'image' ? 'image/*' : mediaType === 'video' ? 'video/*' : '*/*'}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file);
                    }
                  }}
                  className="hidden"
                />
                <Button
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full max-w-md"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  {isUploading ? 'Uploading...' : 'Choose File to Upload'}
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  {mediaType === 'image' && 'Supported formats: JPG, PNG, GIF, WebP (max 2MB)'}
                  {mediaType === 'video' && 'Supported formats: MP4, WebM, MOV (max 10MB)'}
                  {mediaType === 'all' && 'All file types supported'}
                </p>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="url" className="flex-1 flex flex-col justify-center bg-white text-black">
            <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
              <div className="space-y-2">
                <Label htmlFor="url-input" className="text-black">Media URL</Label>
                <Input
                  id="url-input"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="bg-white border-gray-300 text-black placeholder:text-gray-500"
                />
                <p className="text-sm text-gray-600">
                  Enter a direct URL to an image, video, or other media file.
                </p>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleUrlSubmit} 
                  disabled={!urlInput.trim()}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Link className="h-4 w-4 mr-2" />
                  Use URL
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};