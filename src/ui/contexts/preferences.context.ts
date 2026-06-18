import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  applyPrimaryColor,
  DEFAULT_PRIMARY,
  type PrimaryColor,
} from "../utils/primaryColor";

export type Theme = "black" | "white";

export interface NotificationPrefs {
  sound: boolean;
  desktop: boolean;
}

interface PreferencesState {
  theme: Theme;
  primaryColor: PrimaryColor;
  notifications: NotificationPrefs;
  setTheme: (theme: Theme) => void;
  setPrimaryColor: (color: PrimaryColor) => void;
  setNotificationPref: (key: keyof NotificationPrefs, value: boolean) => void;
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
      notifications: { sound: true, desktop: true },
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
      storage: createJSONStorage(() => localStorage),
      // El tema vive en su propia key (`theme`, leída por el script anti-FOUC),
      // así que no lo persistimos acá para no tener dos fuentes de verdad.
      partialize: (state) => ({
        primaryColor: state.primaryColor,
        notifications: state.notifications,
      }),
      // Reaplica el color al rehidratar (respaldo del script de index.html).
      onRehydrateStorage: () => (state) => {
        if (state) applyPrimaryColor(state.primaryColor);
      },
    },
  ),
);
