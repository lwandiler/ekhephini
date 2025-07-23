import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, Download, Trash2, Copy, Eye, RefreshCw } from 'lucide-react';

interface MediaFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, any>;
  publicUrl: string;
}

const MediaTab = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMediaFiles();
  }, []);

  const loadMediaFiles = async () => {
    try {
      setLoading(true);
      console.log('MediaTab: Starting to load media files...');
      
      // First, try to list all files recursively
      const listAllFiles = async (path = '', allFiles: any[] = []): Promise<any[]> => {
        const { data: items, error } = await supabase
          .storage
          .from('media')
          .list(path, {
            limit: 1000
          });

        if (error) {
          console.error('MediaTab: Storage error for path', path, ':', error);
          throw error;
        }

        console.log('MediaTab: Items found in path', path, ':', items);

        for (const item of items || []) {
          const fullPath = path ? `${path}/${item.name}` : item.name;
          
          if (item.metadata === null) {
            // This is a folder, recursively list its contents
            console.log('MediaTab: Found folder:', fullPath);
            await listAllFiles(fullPath, allFiles);
          } else {
            // This is a file
            console.log('MediaTab: Found file:', fullPath, item);
            allFiles.push({
              ...item,
              name: fullPath // Use full path as name
            });
          }
        }

        return allFiles;
      };

      const files = await listAllFiles();
      console.log('MediaTab: All files found:', files);

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

      console.log('MediaTab: Files with URLs:', filesWithUrls);
      console.log('MediaTab: Total files found:', filesWithUrls.length);

      setMediaFiles(filesWithUrls);
    } catch (error) {
      console.error('Error loading media files:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load media files. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMediaFiles();
    setRefreshing(false);
  };

  const deleteFile = async (fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .storage
        .from('media')
        .remove([fileName]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "File deleted successfully!",
      });
      
      // Remove from local state
      setMediaFiles(prev => prev.filter(file => file.name !== fileName));
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete file. Please try again.",
      });
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Copied!",
        description: "URL copied to clipboard.",
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy URL to clipboard.",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (mimetype?: string) => {
    if (!mimetype) return 'File';
    if (mimetype.startsWith('image/')) return 'Image';
    if (mimetype.startsWith('video/')) return 'Video';
    if (mimetype.startsWith('audio/')) return 'Audio';
    return 'Document';
  };

  const isImage = (mimetype?: string) => mimetype?.startsWith('image/') || false;

  const filteredFiles = mediaFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Media Library</h2>
        <Button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>All Media Files ({filteredFiles.length})</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm ? (
                <p>No files found matching "{searchTerm}".</p>
              ) : (
                <p>No media files found. Upload some files to get started.</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles.map((file) => (
                <Card key={file.name} className="overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center relative">
                    {isImage(file.metadata?.mimetype) ? (
                      <img
                        src={file.publicUrl}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLElement).parentElement;
                          if (parent) {
                            parent.innerHTML = '<div class="text-muted-foreground">Preview unavailable</div>';
                          }
                        }}
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <div className="text-4xl mb-2">
                          {getFileType(file.metadata?.mimetype) === 'Video' ? '🎥' : 
                           getFileType(file.metadata?.mimetype) === 'Audio' ? '🎵' : '📄'}
                        </div>
                        <div className="text-sm">{getFileType(file.metadata?.mimetype)}</div>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-medium text-sm truncate" title={file.name}>
                          {file.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                            {getFileType(file.metadata?.mimetype)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(file.metadata?.size || 0)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        <div>Created: {new Date(file.created_at).toLocaleDateString()}</div>
                        <div>Modified: {new Date(file.updated_at).toLocaleDateString()}</div>
                      </div>

                      <div className="flex gap-1 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(file.publicUrl, '_blank')}
                          className="flex-1"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(file.publicUrl)}
                          className="flex-1"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy URL
                        </Button>
                      </div>

                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = file.publicUrl;
                            link.download = file.name;
                            link.click();
                          }}
                          className="flex-1"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteFile(file.name)}
                          className="flex-1"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaTab;