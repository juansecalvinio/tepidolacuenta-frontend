import { lazy, type ComponentType } from "react";

// Envuelve React.lazy para recuperarse de chunks obsoletos tras un deploy.
//
// Con code-splitting por ruta, cada página es un .js con hash en el nombre. Al
// desplegar una versión nueva, Vercel borra los assets viejos; una pestaña que
// quedó abierta con la build anterior pide un chunk que ya no existe y falla con
// "Failed to fetch dynamically imported module". En ese caso forzamos UN reload
// para tomar el HTML nuevo (con los hashes nuevos). El flag en sessionStorage
// evita un bucle de recargas si el error fuese real y no un chunk viejo.
const RELOAD_FLAG = "chunk-reload-once";

// Mismo constraint que React.lazy (ComponentType<any>) para preservar las props
// de cada página; con ComponentType<unknown> se romperían las que reciben props.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyWithReload<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
) {
  return lazy(async () => {
    try {
      const mod = await factory();
      // Import exitoso: limpiamos el flag para habilitar un futuro reintento.
      sessionStorage.removeItem(RELOAD_FLAG);
      return mod;
    } catch (err) {
      if (!sessionStorage.getItem(RELOAD_FLAG)) {
        sessionStorage.setItem(RELOAD_FLAG, "1");
        window.location.reload();
        // La página se está recargando: devolvemos una promesa que nunca
        // resuelve para que React no muestre el error mientras tanto.
        return new Promise<{ default: T }>(() => {});
      }
      // Ya reintentamos una vez y volvió a fallar: propagamos el error real
      // para que lo capture el ErrorBoundary / Sentry.
      throw err;
    }
  });
}
