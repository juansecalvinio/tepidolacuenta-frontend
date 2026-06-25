import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  applyPrimaryColor,
  DEFAULT_PRIMARY,
  isPrimaryColor,
  type PrimaryColor,
} from "../utils/primaryColor";

export type Theme = "black" | "white";

export interface NotificationPrefs {
  sound: boolean;
  desktop: boolean;
  volume: number; // 0–1, volumen del sonido de alerta
}

interface PreferencesState {
  theme: Theme;
  primaryColor: PrimaryColor;
  notifications: NotificationPrefs;
  setTheme: (theme: Theme) => void;
  setPrimaryColor: (color: PrimaryColor) => void;
  setNotificationPref: <K extends keyof NotificationPrefs>(
    key: K,
    value: NotificationPrefs[K],
  ) => void;
}

const THEME_COLORS: Record<Theme, string> = {
  black: "#1a1a1a",
  white: "#fafafa",
};

// El tema lo aplica el script de index.html antes de pintar; acá lo leemos de
// `data-theme` (ya seteado) y mantenemos la key `theme` por compatibilidad.
const getInitialTheme = (): Theme =>
  typeof document !== "undefined" &&
  document.documentElement.getAttribute("data-theme") === "white"
    ? "white"
    : "black";

const applyTheme = (theme: Theme) => {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // localStorage no disponible (modo privado) — el tema igual se aplica
  }
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLORS[theme]);
};

export const usePreferencesContext = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: getInitialTheme(),
      primaryColor: DEFAULT_PRIMARY,
      notifications: { sound: true, desktop: true, volume: 0.5 },
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
      setPrimaryColor: (color) => {
        applyPrimaryColor(color);
        set({ primaryColor: color });
      },
      setNotificationPref: (key, value) =>
        set((state) => ({
          notifications: { ...state.notifications, [key]: value },
        })),
    }),
    {
      name: "tplc-preferences",
      // Subir este número al cambiar la forma persistida; `migrate` adapta datos
      // viejos para no romper sesiones existentes (client-localstorage-schema).
      version: 1,
      migrate: (persisted) => persisted as Partial<PreferencesState>,
      // Merge profundo de `notifications`: si datos persistidos viejos no tienen
      // un campo nuevo (ej. `volume`), se toma su default del estado actual.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<PreferencesState>;
        return {
          ...current,
          ...p,
          notifications: {
            ...current.notifications,
            ...(p.notifications ?? {}),
          },
        };
      },
      storage: createJSONStorage(() => localStorage),
      // El tema vive en su propia key (`theme`, leída por el script anti-FOUC),
      // así que no lo persistimos acá para no tener dos fuentes de verdad.
      partialize: (state) => ({
        primaryColor: state.primaryColor,
        notifications: state.notifications,
      }),
      // Al rehidratar, validamos el color guardado (si quedó uno inválido de una
      // versión vieja, volvemos al default) y lo reaplicamos como respaldo del
      // script anti-FOUC de index.html.
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (!isPrimaryColor(state.primaryColor)) {
          state.primaryColor = DEFAULT_PRIMARY;
        }
        applyPrimaryColor(state.primaryColor);
      },
    },
  ),
);
