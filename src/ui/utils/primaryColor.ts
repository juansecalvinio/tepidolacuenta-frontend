// Paleta de color primary seleccionable. Como toda la app usa el token
// `--color-primary` (daisyUI), basta con sobrescribir esa variable en runtime
// para que el cambio se propague a toda la UI.
//
// ⚠️ Si cambiás estos valores, replicá los mismos en el script anti-FOUC de
// `index.html` (que los aplica antes de pintar para evitar un flash de color).

export type PrimaryColor = "amber" | "emerald" | "indigo";

export const DEFAULT_PRIMARY: PrimaryColor = "amber";

export const PRIMARY_PALETTE: Record<
  PrimaryColor,
  { label: string; primary: string; primaryContent: string }
> = {
  amber: {
    label: "Ámbar",
    primary: "oklch(83% 0.128 66.29)",
    primaryContent: "oklch(14% 0 0)",
  },
  emerald: {
    label: "Esmeralda",
    primary: "oklch(80% 0.14 162)",
    primaryContent: "oklch(14% 0 0)",
  },
  indigo: {
    label: "Índigo",
    primary: "oklch(58% 0.2 270)",
    primaryContent: "oklch(98% 0 0)",
  },
};

export const isPrimaryColor = (value: unknown): value is PrimaryColor =>
  typeof value === "string" && value in PRIMARY_PALETTE;

export const applyPrimaryColor = (color: PrimaryColor) => {
  const { primary, primaryContent } = PRIMARY_PALETTE[color];
  const root = document.documentElement;
  root.style.setProperty("--color-primary", primary);
  root.style.setProperty("--color-primary-content", primaryContent);
};
