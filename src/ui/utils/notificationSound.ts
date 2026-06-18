const SOUND_URL = "/sounds/notification.wav";

let audio: HTMLAudioElement | null = null;
let unlocked = false;

const getAudio = () => {
  if (!audio) {
    audio = new Audio(SOUND_URL);
  }
  return audio;
};

/**
 * Desbloquea el audio aprovechando un gesto del usuario. Los navegadores
 * bloquean `audio.play()` hasta que la página tuvo una interacción; llamando
 * a esto desde un listener de gesto, los avisos posteriores sí suenan.
 */
export const unlockNotificationSound = () => {
  if (unlocked) return;
  // Usamos un elemento aparte (no el compartido) para el desbloqueo: la
  // activación de autoplay es a nivel documento, así que sirve igual, y así el
  // pause/reset del priming nunca corta un aviso real que esté sonando.
  const primer = new Audio(SOUND_URL);
  primer.volume = 0;
  primer
    .play()
    .then(() => {
      primer.pause();
      unlocked = true;
    })
    .catch(() => {
      // Se reintentará en el próximo gesto del usuario.
    });
};

export const playNotificationSound = (volume = 0.3) => {
  const element = getAudio();
  element.volume = volume;
  element.currentTime = 0;
  element.play().catch((error) => {
    // Bloqueado por la política de autoplay (p. ej. sin gesto previo en la pestaña).
    console.error("Error playing sound:", error);
  });
};
