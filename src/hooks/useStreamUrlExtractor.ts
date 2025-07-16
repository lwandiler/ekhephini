
import { useState, useEffect } from 'react';
import { extractMCRSStreamUrl, tryAlternativeStreamExtraction } from '@/utils/streamExtractor';

export function useStreamUrlExtractor() {
  const [extractedUrl, setExtractedUrl] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);

  const extractStreamUrl = async () => {
    setIsExtracting(true);
    setExtractionError(null);
    
    try {
      console.log('Starting stream URL extraction...');
      
      // First try to extract from the live page
      let url = await extractMCRSStreamUrl();
      
      // If that fails, try alternative approaches
      if (!url) {
        console.log('Primary extraction failed, trying alternatives...');
        url = await tryAlternativeStreamExtraction();
      }
      
      if (url) {
        console.log('Successfully extracted stream URL:', url);
        setExtractedUrl(url);
      } else {
        setExtractionError('Could not extract streaming URL from MCRS website');
      }
    } catch (error) {
      console.error('Stream URL extraction failed:', error);
      setExtractionError('Failed to extract streaming URL');
    } finally {
      setIsExtracting(false);
    }
  };

  // Auto-extract on mount
  useEffect(() => {
    extractStreamUrl();
  }, []);

  return {
    extractedUrl,
    isExtracting,
    extractionError,
    retryExtraction: extractStreamUrl
  };
}
