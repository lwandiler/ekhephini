
import { useEffect } from 'react';

const GoogleAnalytics = () => {
  useEffect(() => {
    const analyticsId = localStorage.getItem('googleAnalyticsId');
    
    if (analyticsId && analyticsId.trim()) {
      // Check if Google Analytics is already loaded
      const existingScript = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
      
      if (!existingScript) {
        // Load Google Analytics script
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
        document.head.appendChild(script1);

        // Initialize Google Analytics
        const script2 = document.createElement('script');
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${analyticsId}');
        `;
        document.head.appendChild(script2);
        
        console.log('Google Analytics loaded with ID:', analyticsId);
      }
    }
  }, []);

  return null; // This component doesn't render anything
};

export default GoogleAnalytics;
