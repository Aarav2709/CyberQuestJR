import { createContext, useContext, useCallback } from 'react';

type SoundContextType = {
  playSound: (type: 'click' | 'success' | 'error' | 'complete' | 'achievement') => void;
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const playSound = useCallback((type: 'click' | 'success' | 'error' | 'complete' | 'achievement') => {
    // Create audio context and oscillator for simple sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different sounds for different actions
    switch (type) {
      case 'click':
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.05);
        break;
      case 'success':
        oscillator.frequency.value = 523.25; // C5
        gainNode.gain.value = 0.15;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
        setTimeout(() => {
          const osc2 = audioContext.createOscillator();
          const gain2 = audioContext.createGain();
          osc2.connect(gain2);
          gain2.connect(audioContext.destination);
          osc2.frequency.value = 659.25; // E5
          gain2.gain.value = 0.15;
          osc2.start();
          osc2.stop(audioContext.currentTime + 0.15);
        }, 100);
        break;
      case 'error':
        oscillator.frequency.value = 200;
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
      case 'complete':
        // Ascending melody
        [523.25, 587.33, 659.25, 783.99].forEach((freq, i) => {
          setTimeout(() => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = freq;
            gain.gain.value = 0.15;
            osc.start();
            osc.stop(audioContext.currentTime + 0.2);
          }, i * 100);
        });
        break;
      case 'achievement':
        // Triumphant chord
        [523.25, 659.25, 783.99].forEach((freq) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.connect(gain);
          gain.connect(audioContext.destination);
          osc.frequency.value = freq;
          gain.gain.value = 0.1;
          osc.start();
          osc.stop(audioContext.currentTime + 0.5);
        });
        break;
    }
  }, []);

  return (
    <SoundContext.Provider value={{ playSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within SoundProvider');
  }
  return context;
}
