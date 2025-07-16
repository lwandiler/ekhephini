
// Utility to extract streaming URL from MCRS website
export async function extractMCRSStreamUrl(): Promise<string | null> {
  try {
    console.log('Attempting to extract stream URL from MCRS website...');
    
    // Try to fetch the live page
    const response = await fetch('https://mcrs.co.za/live', {
      mode: 'cors',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      console.error('Failed to fetch MCRS live page:', response.status);
      return null;
    }
    
    const html = await response.text();
    console.log('Successfully fetched MCRS live page');
    
    // Look for common streaming URL patterns in the HTML
    const streamPatterns = [
      // M3U8 streams
      /https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/gi,
      // MP3 streams  
      /https?:\/\/[^"'\s]+\.mp3[^"'\s]*/gi,
      // Common streaming domains
      /https?:\/\/[^"'\s]*stream[^"'\s]*\.(m3u8|mp3)[^"'\s]*/gi,
      // Broadband streaming patterns
      /https?:\/\/[^"'\s]*broadsmart[^"'\s]*\.(m3u8|mp3)[^"'\s]*/gi,
      // Generic streaming patterns in audio/video elements
      /<(?:audio|video)[^>]*src=["']([^"']+)["'][^>]*>/gi,
      // JavaScript variables containing stream URLs
      /(?:stream|audio)(?:Url|URL|_url)\s*[:=]\s*["']([^"']+)["']/gi
    ];
    
    for (const pattern of streamPatterns) {
      const matches = html.match(pattern);
      if (matches && matches.length > 0) {
        // Clean up the URL and return the first valid one
        const cleanUrl = matches[0].replace(/['"]/g, '');
        console.log('Found potential stream URL:', cleanUrl);
        
        // Validate that it looks like a proper streaming URL
        if (cleanUrl.includes('.m3u8') || cleanUrl.includes('.mp3')) {
          return cleanUrl;
        }
      }
    }
    
    // If no direct URLs found, look for embedded players or iframes
    const iframePattern = /<iframe[^>]*src=["']([^"']+)["'][^>]*>/gi;
    const iframeMatches = html.match(iframePattern);
    
    if (iframeMatches) {
      console.log('Found iframe sources, may need manual inspection');
      // Log iframe sources for debugging
      iframeMatches.forEach(match => {
        const srcMatch = match.match(/src=["']([^"']+)["']/);
        if (srcMatch) {
          console.log('Iframe source:', srcMatch[1]);
        }
      });
    }
    
    console.log('No streaming URL found in MCRS live page');
    return null;
    
  } catch (error) {
    console.error('Error extracting MCRS stream URL:', error);
    return null;
  }
}

// Alternative approach: try to extract from known streaming service patterns
export async function tryAlternativeStreamExtraction(): Promise<string | null> {
  try {
    // Common South African radio streaming services
    const commonStreamingServices = [
      'https://streamlive-edge-01.broadsmart-streaming.co.za:5443/mdda/streams/mcr128kbps.m3u8',
      'https://streaming.mcrs.co.za/live',
      'https://stream.mcrs.co.za/mcrs',
      'https://mcrs.co.za/stream',
    ];
    
    for (const url of commonStreamingServices) {
      try {
        console.log(`Testing stream URL: ${url}`);
        const response = await fetch(url, { 
          method: 'HEAD',
          mode: 'no-cors' // This might help with CORS issues
        });
        
        // If we get here without error, the URL might be valid
        console.log(`Stream URL appears accessible: ${url}`);
        return url;
      } catch (error) {
        console.log(`Stream URL not accessible: ${url}`);
        continue;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error in alternative stream extraction:', error);
    return null;
  }
}
