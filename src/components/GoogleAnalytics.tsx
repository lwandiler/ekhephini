
import { useEffect } from 'react';

const GoogleAnalytics = () => {
  useEffect(() => {
    const analyticsScript = localStorage.getItem('googleAnalyticsScript');
    
    if (analyticsScript && analyticsScript.trim()) {
      // Check if a custom analytics script is already loaded
      const existingCustomScript = document.querySelector('#custom-google-analytics');
      
      if (!existingCustomScript) {
        // Create a script element and add the custom analytics code
        const scriptElement = document.createElement('script');
        scriptElement.id = 'custom-google-analytics';
        scriptElement.innerHTML = analyticsScript;
        document.head.appendChild(scriptElement);
        
        console.log('Custom Google Analytics script loaded');
      }
    }
  }, []);

  return null; // This component doesn't render anything
};

export default GoogleAnalytics;
