
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface UseMediaUploadOptions {
  mediaType: 'image' | 'video';
  onUploadSuccess: (url: string) => void;
}

export function useMediaUpload({ mediaType, onUploadSuccess }: UseMediaUploadOptions) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleMediaUpload = async (file: File): Promise<void> => {
    if (!file) return;
    
    // Check file size (max 10MB for videos, 2MB for images)
    const maxSize = mediaType === 'video' ? 10 * 1024 * 1024 : 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `File too large. ${mediaType === 'video' ? 'Videos must be under 10MB.' : 'Images must be under 2MB.'}`,
      });
      return;
    }

    // Check file type
    if (mediaType === 'video' && !file.type.startsWith('video/')) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a valid video file (MP4, WebM, etc.).",
      });
      return;
    } else if (mediaType === 'image' && !file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a valid image file (JPG, PNG, GIF, etc.).",
      });
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${new Date().getTime()}.${fileExt}`;
      const filePath = `banners/${mediaType}s/${fileName}`;
      
      console.log('Uploading file to path:', filePath);
      
      // Start tracking progress manually with intervals
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          // Simulate progress until we reach ~90%
          // The last 10% will be set after the upload completes
          const newProgress = prev + 5;
          return newProgress < 90 ? newProgress : 90;
        });
      }, 300);
      
      // Upload the file to Supabase Storage without the problematic option
      const { data, error } = await supabase
        .storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      // Clear the interval once upload is complete or failed
      clearInterval(progressInterval);
      
      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }
      
      // Set progress to 100% after successful upload
      setUploadProgress(100);
      
      console.log('Upload successful, getting public URL');
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase
        .storage
        .from('media')
        .getPublicUrl(filePath);
      
      console.log('Public URL obtained:', publicUrl);
      
      onUploadSuccess(publicUrl);
      
      toast({
        title: "File Uploaded",
        description: "Media file has been uploaded successfully.",
      });
    } catch (error: any) {
      console.error('Error uploading file:', error);
      
      let errorMessage = "Failed to upload file. Please try again.";
      
      // Check for specific error types
      if (error.message?.includes('row-level security')) {
        errorMessage = "Permission denied. This could be due to Row Level Security policies. Check if you're properly authenticated.";
      } else if (error.message?.includes('bucket not found')) {
        errorMessage = "Storage bucket not found. Please check if the 'media' bucket exists.";
      } else if (error.statusCode === 403 || error.status === 403) {
        errorMessage = "Access denied. You may not have permission to upload files.";
      }
      
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: errorMessage,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadProgress,
    handleMediaUpload
  };
}
