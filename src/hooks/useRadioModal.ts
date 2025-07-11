
import { useState, useEffect } from 'react';
import { Howler } from 'howler';

export function useRadioModal() {
  const [modalOpen, setModalOpen] = useState(false);
  
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const toggleModal = () => setModalOpen(!modalOpen);
  
  useEffect(() => {
    if (modalOpen) {
      // Try to unlock audio context when modal opens
      try {
        // First try with Howler's context
        if (Howler.ctx && Howler.ctx.state === 'suspended') {
          console.log("Resuming Howler context from modal");
          Howler.ctx.resume().catch(e => {
            console.error("Failed to resume Howler context:", e);
          });
        }
        
        // Also try with a new AudioContext
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const audioContext = new AudioContext();
          if (audioContext.state === 'suspended') {
            audioContext.resume().then(() => {
              console.log("AudioContext resumed by modal interaction");
            }).catch(e => {
              console.error("Failed to resume context in modal:", e);
            });
          }
        }
        
        // Try with oscillator for iOS
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        oscillator.start(0);
        oscillator.stop(0.1);
        
      } catch (e) {
        console.error("Error accessing AudioContext in modal:", e);
      }
    }
  }, [modalOpen]);
  
  return {
    modalOpen,
    setModalOpen,
    openModal,
    closeModal,
    toggleModal
  };
}
