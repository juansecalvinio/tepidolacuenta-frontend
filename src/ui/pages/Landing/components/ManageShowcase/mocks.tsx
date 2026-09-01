// Mockups estáticos del showcase. No son capturas exactas: son muestras
// visuales fieles al look de la app (mismos tokens y componentes daisyUI).
// El texto de sample viene de i18n (demo.*); "La Parrilla" y las direcciones no
// se traducen (nombres propios).
//
// Cada mockup se renderiza SIEMPRE en oscuro (`data-theme="black"` en su raíz),
// independiente del tema de la página, para que las ventanas simulen pantallas
// reales y resalten sobre el fondo claro de la landing.
import { useTranslation } from "react-i18next";

// Glifo de QR reutilizable (decorativo).
const QrGlyph = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
    <rect x="2" y="2" width="12" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <rect x="26" y="2" width="12" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <rect x="2" y="26" width="12" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <rect x="6" y="6" width="4" height="4" fill="currentColor" />
    <rect x="30" y="6" width="4" height="4" fill="currentColor" />
    <rect x="6" y="30" width="4" height="4" fill="currentColor" />
    <path d="M20 20h4v4h-4zM28 20h4v4h-4zM20 28h4v4h-4zM32 28h4v4h-4zM28 34h4v4h-4z" fill="currentColor" />
  </svg>
);

const PinIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 0 1 15 0Z" />
  </svg>
);

// Equipo por código de invitación — espeja el panel "Equipo" del perfil.
export const MockTeamInvite = () => {
  const { t } = useTranslation();
  return (
    <div
      data-theme="black"
      className="surface bg-base-100 border border-base-300 rounded-2xl overflow-hidden max-w-md mx-auto lg:mx-0"
      aria-hidden="true"
    >
      <div className="p-4 border-b border-base-300">
        <p className="text-sm text-fg-soft">{t("demo.inviteDesc")}</p>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 bg-base-200 rounded-lg p-3">
          <code className="flex-1 font-mono text-sm tracking-wide">TL-8F3K-92Q</code>
          <span className="btn btn-sm btn-ghost shrink-0 pointer-events-none">
            {t("demo.copy")}
          </span>
        </div>
        <p className="text-xs text-fg-subtle">
          {t("demo.accessTo")}{" "}
          <span className="font-medium text-fg-soft">{t("demo.branchCentro")}</span>
        </p>
      </div>
    </div>
  );
};

// Sucursales — lista de locales con dirección.
export const MockBranches = () => {
  const { t } = useTranslation();
  const branches = [
    { name: t("demo.branchCentro"), address: "Av. Corrientes 1234", mesas: 12 },
    { name: t("demo.branchPalermo"), address: "Thames 880", mesas: 8 },
    { name: t("demo.branchCostanera"), address: "Av. Rafael Obligado 500", mesas: 20 },
  ];
  return (
    <div
      data-theme="black"
      className="surface bg-base-100 border border-base-300 rounded-2xl p-4 flex flex-col gap-2.5 max-w-md mx-auto lg:mx-0"
      aria-hidden="true"
    >
      {branches.map(({ name, address, mesas }) => (
        <div
          key={name}
          className="flex items-center gap-3 rounded-xl border border-base-300 bg-base-100 px-3.5 py-3"
        >
          <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <PinIcon />
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-sm truncate">{name}</div>
            <div className="text-xs text-fg-subtle truncate">{address}</div>
          </div>
          <span className="text-xs text-fg-subtle whitespace-nowrap">
            {t("demo.tablesCount", { count: mesas })}
          </span>
        </div>
      ))}
    </div>
  );
};

// Mesas — grilla de mesas con su QR.
export const MockTables = () => {
  const { t } = useTranslation();
  return (
    <div
      data-theme="black"
      className="surface bg-base-100 border border-base-300 rounded-2xl p-4 max-w-md mx-auto lg:mx-0"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold">{t("demo.tablesTitle")}</span>
        <span className="text-xs text-fg-subtle">{t("demo.branchCentro")}</span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
          <div
            key={n}
            className="rounded-xl border border-base-300 bg-base-100 flex flex-col items-center justify-center py-3 gap-1"
          >
            <QrGlyph className="w-7 h-7 text-fg-subtle" />
            <span className="text-xs font-medium">{t("demo.table", { n })}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Imprimir QRs — cartelitos listos para imprimir en PDF.
export const MockPrintQRs = () => {
  const { t } = useTranslation();
  return (
    <div
      data-theme="black"
      // padding + radius + borde: sin esto el fondo base-100 que daisyUI aplica
      // al elemento con data-theme sería un rectángulo de bordes duros. Con el
      // panel redondeado, la barra y las dos tarjetas de impresión quedan adentro.
      className="surface bg-base-100 border border-base-300 rounded-2xl p-4 max-w-md mx-auto lg:mx-0"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-fg-soft">
          {t("demo.readyToPrint")}
        </span>
        <span className="btn btn-primary btn-sm pointer-events-none gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0V4.125C17.25 3.504 16.746 3 16.125 3h-8.25C7.254 3 6.75 3.504 6.75 4.125v3.253" />
          </svg>
          {t("demo.print")}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { venue: "La Parrilla", mesa: 1 },
          { venue: "La Parrilla", mesa: 2 },
        ].map(({ venue, mesa }) => (
          <div
            key={mesa}
            className="surface bg-base-100 border border-base-300 rounded-2xl p-4 flex flex-col items-center text-center"
          >
            <span className="font-display text-sm font-semibold">{venue}</span>
            <span className="text-xs text-fg-subtle mb-3">
              {t("demo.table", { n: mesa })}
            </span>
            <div className="rounded-lg border border-base-300 p-2.5">
              <QrGlyph className="w-16 h-16 text-fg" />
            </div>
            <span className="text-[10px] text-fg-subtle mt-2">
              {t("demo.scanToOrder")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
