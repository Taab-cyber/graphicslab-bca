import { useCallback } from 'react';
import { useAppStore } from '../store';

type SoundType = 'correct' | 'wrong' | 'click' | 'levelup' | 'badge' | 'xp';

const audioCtxRef: { current: AudioContext | null } = { current: null };

function getAudioContext(): AudioContext {
  if (!audioCtxRef.current) {
    audioCtxRef.current = new AudioContext();
  }
  return audioCtxRef.current;
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

const SOUNDS: Record<SoundType, () => void> = {
  correct: () => {
    playTone(523, 0.1, 'sine'); // C5
    setTimeout(() => playTone(659, 0.1, 'sine'), 100); // E5
    setTimeout(() => playTone(784, 0.2, 'sine'), 200); // G5
  },
  wrong: () => {
    playTone(200, 0.3, 'sawtooth', 0.2);
  },
  click: () => {
    playTone(800, 0.05, 'sine', 0.1);
  },
  levelup: () => {
    [523, 659, 784, 1047].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.2, 'sine', 0.3), i * 150);
    });
  },
  badge: () => {
    [784, 988, 1175].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.15, 'triangle', 0.3), i * 120);
    });
  },
  xp: () => {
    playTone(1200, 0.08, 'sine', 0.15);
  },
};

export function useSound() {
  const soundEnabled = useAppStore((s) => s.soundEnabled);

  const playSound = useCallback(
    (type: SoundType) => {
      if (soundEnabled && SOUNDS[type]) {
        SOUNDS[type]();
      }
    },
    [soundEnabled]
  );

  return { playSound };
}
