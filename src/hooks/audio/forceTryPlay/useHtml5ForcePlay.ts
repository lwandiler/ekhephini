
import { toast } from 'sonner';

export function useHtml5ForcePlay() {
  const forcePlayHtml5Audio = (
    audioElement: React.MutableRefObject<HTMLAudioElement | null>,
    setIsLoading: (value: boolean) => void,
    setStreamError: (value: string | null) => void
  ) => {
    console.log("Force play: Using HTML5 Audio approach");
    
    // Try a sequence of approaches for HTML audio
    if (audioElement.current) {
      audioElement.current.pause();
    }
    
    // Try to force a new audio element
    audioElement.current = new Audio();
    audioElement.current.autoplay = true;
    audioElement.current.crossOrigin = "anonymous";
    audioElement.current.preload = "auto";
    
    // Try both URLs from stations for the current station if we have them
    const primaryUrl = "https://ice2.somafm.com/groovesalad-128-mp3"; // Known working URL
    
    console.log("Force play using URL:", primaryUrl);
    audioElement.current.src = primaryUrl;
    audioElement.current.load();
    
    // Try with a delay to let the browser process user input
    setTimeout(() => {
      if (audioElement.current) {
        audioElement.current.play().then(() => {
          console.log("Force play HTML5 Audio successful!");
          toast.success("Audio playback started!");
        }).catch(err => {
          console.error("Force HTML5 play failed:", err);
          setIsLoading(false);
          setStreamError("Playback still blocked. Try opening in browser.");
          toast.error("Force play failed. Try opening in your browser.");
        });
      }
    }, 500);
  };

  return { forcePlayHtml5Audio };
}
