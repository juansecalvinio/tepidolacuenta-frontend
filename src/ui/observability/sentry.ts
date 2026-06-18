import * as Sentry from "@sentry/react";

/**
 * Inicializa Sentry. Solo arranca si hay DSN (en dev local sin configurar, no
 * envía nada). El environment y el release se toman de envs para distinguir
 * production / preview / dev y saber qué deploy metió cada error.
 */
export const initSentry = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) {
    console.warn(
      "[observability] Sentry NO inicializado: falta VITE_SENTRY_DSN en el build.",
    );
    return;
  }

  Sentry.init({
    dsn,
    environment:
      import.meta.env.VITE_SENTRY_ENV || import.meta.env.MODE || "production",
    release: import.meta.env.VITE_RELEASE || undefined,
    integrations: [Sentry.browserTracingIntegration()],
    // Muestreo de trazas. Por defecto Sentry solo propaga la traza a same-origin,
    // así que NO toca las llamadas cross-origin a api.* (la conexión front↔back
    // se activa en la Fase 3, junto con el CORS). Bajá este valor si el volumen molesta.
    tracesSampleRate: 1.0,
  });

  console.info("[observability] Sentry inicializado ✓");
};

export { Sentry };
