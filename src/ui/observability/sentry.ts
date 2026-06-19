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
    // Muestreo de trazas (bajá este valor si el volumen molesta).
    tracesSampleRate: 1.0,
    // Propagamos la traza al backend para conectar front↔back en una sola traza.
    // Incluye localhost (dev) + el host de la API. Requiere que el CORS del backend
    // permita los headers `sentry-trace` y `baggage` (ya habilitados).
    tracePropagationTargets: [
      "localhost",
      ...(import.meta.env.VITE_API_BASE_URL
        ? [import.meta.env.VITE_API_BASE_URL]
        : []),
    ],
  });

  console.info("[observability] Sentry inicializado ✓");
};

export { Sentry };
