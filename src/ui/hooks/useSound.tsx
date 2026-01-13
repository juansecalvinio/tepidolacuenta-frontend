import { useCallback } from "react";

export const useSound = (soundUrl: string) => {
  const play = useCallback(() => {
    const audio = new Audio(soundUrl);
    audio.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  }, [soundUrl]);

  return { play };
};
