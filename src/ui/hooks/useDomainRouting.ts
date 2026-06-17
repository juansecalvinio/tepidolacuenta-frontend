import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { APP_ORIGIN, isMarketingHost, isNeutralHost } from "../utils/host";

// Rutas que pertenecen a la landing (marketing). El resto se considera "app".
const isMarketingPath = (pathname: string): boolean => pathname === "/";

/**
 * Aísla las superficies por dominio (solo en producción):
 * - En el dominio de marketing (apex) solo vive la landing; cualquier ruta de app
 *   se redirige al subdominio `app.` (mismo path).
 * - En el subdominio `app.`, la landing redirige a la app (lo maneja la propia Landing).
 *
 * En localhost y previews de Vercel no hace nada (host neutro).
 */
export const useDomainRouting = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (isNeutralHost()) return;

    if (isMarketingHost() && !isMarketingPath(pathname)) {
      window.location.replace(`${APP_ORIGIN}${pathname}${search}${hash}`);
    }
  }, [pathname, search, hash]);
};
