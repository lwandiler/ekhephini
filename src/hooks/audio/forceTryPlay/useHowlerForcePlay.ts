
import { Howl } from 'howler';
import { toast } from 'sonner';

export function useHowlerForcePlay() {
  const forcePlayHowler = (
    sound: React.MutableRefObject<Howl | null>,
    setIsLoading: (value: boolean) => void,
    setStreamError: (value: string | null) => void
  ) => {
    console.log("Force play: Using Howler approach");
    
    // Unload completely and create a fresh instance
    if (sound.current) {
      sound.current.unload();
    }
    
    // Create a fresh Howl instance with a known working stream
    sound.current = new Howl({
      src: ["https://ice2.somafm.com/groovesalad-128-mp3"], // Known working stream
      html5: true,
      format: ['mp3'],
      autoplay: false, // Changed to false to prevent automatic playback
      volume: 1.0, // Full volume for testing, will be adjusted later
      onload: function() {
        console.log("Force play: Howl loaded");
        // Only play once after loading
        if (this.state() !== 'loaded') {
          this.play();
          setTimeout(() => {
            if (this.playing()) {
              toast.success("Audio playback started!");
              setIsLoading(false);
            }
          }, 1000);
        }
      },
      onplay: function() {
        console.log("Force play: Howl playing");
        setIsLoading(false);
        toast.success("Audio playback started!");
      },
      onloaderror: function(id, err) {
        console.error("Force play: Load error", err);
        setIsLoading(false);
        setStreamError("Stream failed to load. Try opening in browser.");
        
        // Last resort - try with HTML5 Audio directly
        tryLastResortAudio();
      },
      onplayerror: function(id, err) {
        console.error("Force play: Play error", err);
        setIsLoading(false);
        setStreamError("Browser blocked playback. Try opening in browser.");
        
        // Last resort - try with HTML5 Audio directly
        tryLastResortAudio();
      }
    });
  };
  
  const tryLastResortAudio = () => {
    const audio = new Audio("https://ice2.somafm.com/groovesalad-128-mp3");
    audio.play().then(() => {
      console.log("Last resort HTML5 Audio successful");
      toast.success("Audio playback started using fallback player!");
    }).catch(e => {
      console.error("Last resort HTML5 Audio failed:", e);
      toast.error("All playback attempts failed. Try opening in your browser.");
    });
  };

  return { forcePlayHowler };
}
