// Fuente única de verdad de los hosts de producción.
//
// La separación landing (apex) vs app (subdominio) SOLO aplica en estos dominios.
// En localhost y en los previews de Vercel (*.vercel.app) no hay separación: todo
// funciona en el mismo host para no romper dev ni preview.

export const APP_HOST = "app.tepidolacuenta.site";
export const APP_ORIGIN = `https://${APP_HOST}`;

export const MARKETING_HOSTS = [
  "tepidolacuenta.site",
  "www.tepidolacuenta.site",
];

const currentHostname = (): string =>
  typeof window !== "undefined" ? window.location.hostname : "";

export const isAppHost = (): boolean => currentHostname() === APP_HOST;

export const isMarketingHost = (): boolean =>
  MARKETING_HOSTS.includes(currentHostname());

// Host "neutro": localhost, 127.0.0.1, *.vercel.app, IPs… → sin guards por dominio.
export const isNeutralHost = (): boolean => !isAppHost() && !isMarketingHost();
