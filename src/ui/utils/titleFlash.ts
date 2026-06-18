let originalTitle: string | null = null;
let intervalId: ReturnType<typeof setInterval> | null = null;
let visibilityBound = false;

const handleVisibility = () => {
  if (!document.hidden) stopTitleFlash();
};

/**
 * Hace parpadear el título de la pestaña con un mensaje mientras la pestaña
 * está en segundo plano. Funciona como respaldo de aviso sin permisos y se
 * detiene solo cuando el usuario vuelve a la pestaña.
 */
export const startTitleFlash = (message: string) => {
  if (typeof document === "undefined" || !document.hidden) return;
  if (intervalId) return;

  if (originalTitle === null) originalTitle = document.title;

  let showMessage = true;
  document.title = message;
  intervalId = setInterval(() => {
    showMessage = !showMessage;
    document.title = showMessage ? message : (originalTitle ?? message);
  }, 1200);

  if (!visibilityBound) {
    document.addEventListener("visibilitychange", handleVisibility);
    visibilityBound = true;
  }
};

export const stopTitleFlash = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  if (originalTitle !== null) {
    document.title = originalTitle;
    originalTitle = null;
  }
};
