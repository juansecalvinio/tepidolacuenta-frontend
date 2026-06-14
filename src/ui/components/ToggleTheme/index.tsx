import { useEffect, useState } from "react";

type Theme = "black" | "white";

const THEME_COLORS: Record<Theme, string> = {
  black: "#1a1a1a",
  white: "#fafafa",
};

const getInitialTheme = (): Theme =>
  document.documentElement.getAttribute("data-theme") === "white"
    ? "white"
    : "black";

export const ToggleTheme = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // localStorage no disponible (modo privado) — el tema igual se aplica en memoria
    }
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", THEME_COLORS[theme]);
  }, [theme]);

  const isDark = theme === "black";

  return (
    <label className="flex items-center cursor-pointer gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
      </svg>
      <input
        type="checkbox"
        className="toggle toggle-sm"
        checked={isDark}
        onChange={(e) => setTheme(e.target.checked ? "black" : "white")}
        aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </label>
  );
};
