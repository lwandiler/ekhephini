
import { Howl } from 'howler';

export function useVolumeControl() {
  const handleVolumeChange = (
    newVolume: number[],
    setVolume: (value: number) => void,
    sound: React.MutableRefObject<Howl | null>,
    audioElement: React.MutableRefObject<HTMLAudioElement | null>
  ) => {
    const volumeValue = newVolume[0];
    console.log("Volume changing to:", volumeValue);
    setVolume(volumeValue);
    
    if (sound.current) {
      sound.current.volume(volumeValue / 100);
    }
    
    if (audioElement.current) {
      audioElement.current.volume = volumeValue / 100;
    }
  };

  return { handleVolumeChange };
}
