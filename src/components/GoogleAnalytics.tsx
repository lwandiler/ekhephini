
import { useEffect } from 'react';

const GoogleAnalytics = () => {
  useEffect(() => {
    const analyticsScript = localStorage.getItem('googleAnalyticsScript');
    
    if (analyticsScript && analyticsScript.trim()) {
      // Check if a custom analytics script is already loaded
      const existingCustomScript = document.querySelector('#custom-google-analytics');
      
      if (!existingCustomScript) {
        try {
          // Sanitize and validate the script content
          const sanitizedScript = analyticsScript.replace(/<script[^>]*>|<\/script>/gi, '');
          
          // Only allow basic Google Analytics patterns
          const allowedPatterns = [
            /gtag\s*\(/,
            /dataLayer/,
            /GoogleAnalyticsObject/,
            /window\.ga/
          ];
          
          const isValidScript = allowedPatterns.some(pattern => pattern.test(sanitizedScript));
          
          if (isValidScript) {
            // Create a script element with safer injection
            const scriptElement = document.createElement('script');
            scriptElement.id = 'custom-google-analytics';
            scriptElement.type = 'text/javascript';
            scriptElement.text = sanitizedScript; // Use .text instead of .innerHTML
            document.head.appendChild(scriptElement);
            
            console.log('Custom Google Analytics script loaded');
          } else {
            console.warn('Analytics script contains potentially unsafe content and was blocked');
          }
        } catch (error) {
          console.error('Error loading analytics script:', error);
        }
      }
    }
  }, []);

  return null; // This component doesn't render anything
};

export default GoogleAnalytics;
