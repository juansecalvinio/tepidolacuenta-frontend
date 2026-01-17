import { useCallback } from "react";

interface UseSoundOptions {
  volume?: number; // De 0 a 1
  loop?: boolean;
}

export const useSound = (soundUrl: string, options: UseSoundOptions) => {
  const { volume = 0.3, loop = false } = options;
  const play = useCallback(() => {
    const audio = new Audio(soundUrl);
    audio.volume = volume;
    audio.loop = loop;
    audio.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  }, [soundUrl]);

  return { play };
};
