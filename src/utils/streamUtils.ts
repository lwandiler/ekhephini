
import { RadioStation } from '@/hooks/audio/types';
import { toast } from 'sonner';

export function openStreamInNewTab(station: RadioStation) {
  // Get all potential URLs to attempt
  const fallbackUrl = station.fallbackUrl;
  const primaryUrl = station.url;
  const settingsUrl = station.streamUrl;
  
  // Prioritize URLs: settings URL > fallback URL > primary URL
  const url = settingsUrl || fallbackUrl || primaryUrl;
  
  console.log(`Opening stream in new tab: ${url}`);
  
  // Create an anchor element for more reliable window opening
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  
  // Dispatch a click event
  const clickEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: false
  });
  
  a.dispatchEvent(clickEvent);
  
  toast.info(`Opening ${station.name} in a new tab`);
  toast.info('If it doesn\'t play, try enabling autoplay in your browser settings');
}
