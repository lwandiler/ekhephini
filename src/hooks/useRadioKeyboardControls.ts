
import { useEffect } from 'react';

export function useRadioKeyboardControls(
  volume: number,
  togglePlayPause: () => void,
  handleVolumeChange: (value: number[]) => void
) {
  // Add keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default actions for these keys to avoid page scrolling, etc.
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault();
      }

      // Space bar toggles play/pause
      if (e.code === 'Space') {
        togglePlayPause();
      }

      // Arrow Up increases volume (by 5)
      if (e.code === 'ArrowUp') {
        const newVolume = Math.min(volume + 5, 100);
        handleVolumeChange([newVolume]);
      }

      // Arrow Down decreases volume (by 5)
      if (e.code === 'ArrowDown') {
        const newVolume = Math.max(volume - 5, 0);
        handleVolumeChange([newVolume]);
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [volume, togglePlayPause, handleVolumeChange]);
}
