// Paleta de color primary seleccionable.
//
// Los VALORES (oklch) viven en una sola fuente: styles.css → bloque `:root` con
// las vars `--primary-<key>` y `--primary-<key>-content`. Acá manejamos solo las
// keys y sus labels; el color se referencia por NOMBRE vía `var(--primary-<key>)`.
// Así no hay hex duplicado entre CSS, este archivo y el script anti-FOUC.
//
// Para agregar un color: sumá la var en styles.css y la key acá.

export type PrimaryColor = "amber" | "emerald" | "indigo";

export const DEFAULT_PRIMARY: PrimaryColor = "emerald";

export const PRIMARY_PALETTE: Record<PrimaryColor, { label: string }> = {
  emerald: { label: "Esmeralda" },
  indigo: { label: "Índigo" },
  amber: { label: "Ámbar" },
};

// Referencias a las vars CSS de la paleta (única fuente: styles.css).
export const primaryVar = (color: PrimaryColor) => `var(--primary-${color})`;
export const primaryContentVar = (color: PrimaryColor) =>
  `var(--primary-${color}-content)`;

export const isPrimaryColor = (value: unknown): value is PrimaryColor =>
  typeof value === "string" && value in PRIMARY_PALETTE;

// Como toda la app usa el token `--color-primary`, basta con apuntarlo a la var
// de la paleta elegida en runtime para que el cambio se propague a toda la UI.
export const applyPrimaryColor = (color: PrimaryColor) => {
  const root = document.documentElement;
  root.style.setProperty("--color-primary", primaryVar(color));
  root.style.setProperty("--color-primary-content", primaryContentVar(color));
};
