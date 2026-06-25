import type { CSSProperties } from "react";
import { ToggleTheme } from "../../components/ToggleTheme";
import { usePreferencesContext } from "../../contexts/preferences.context";
import {
  PRIMARY_PALETTE,
  primaryVar,
  primaryContentVar,
  type PrimaryColor,
} from "../../utils/primaryColor";
import { useNotificationPermission } from "../../hooks/useNotificationPermission";
import { playNotificationSound } from "../../utils/notificationSound";
import { SpeakerIcon } from "../../components/icons";

export const Settings = () => {
  const primaryColor = usePreferencesContext((s) => s.primaryColor);
  const setPrimaryColor = usePreferencesContext((s) => s.setPrimaryColor);
  const notifications = usePreferencesContext((s) => s.notifications);
  const setNotificationPref = usePreferencesContext((s) => s.setNotificationPref);
  const { supported, permission, request } = useNotificationPermission();

  const handleDesktopToggle = async (value: boolean) => {
    // Al activar, pedimos permiso del navegador si todavía no se decidió.
    if (value && permission === "default") {
      await request();
    }
    setNotificationPref("desktop", value);
  };

  const colors = Object.keys(PRIMARY_PALETTE) as PrimaryColor[];

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="font-display text-2xl font-semibold mb-6">Configuración</h2>

      {/* Apariencia */}
      <section className="surface bg-base-100 border border-base-300 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-base-300">
          <p className="text-sm font-medium text-base-content">Apariencia</p>
        </div>

        <div className="p-4 flex items-center justify-between gap-4 border-b border-base-300">
          <div className="min-w-0">
            <p className="text-sm font-medium">Tema</p>
            <p className="text-xs text-fg-soft">Modo claro u oscuro.</p>
          </div>
          <ToggleTheme />
        </div>

        <div className="p-4">
          <p className="text-sm font-medium">Color principal</p>
          <p className="text-xs text-fg-soft mb-3">
            Cambiá el acento de toda la app.
          </p>
          <div className="flex items-center gap-3">
            {colors.map((key) => {
              const { label } = PRIMARY_PALETTE[key];
              const selected = primaryColor === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPrimaryColor(key)}
                  aria-pressed={selected}
                  aria-label={label}
                  title={label}
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100 ${
                    selected ? "border-base-content" : "border-transparent"
                  }`}
                  style={{ backgroundColor: primaryVar(key) }}
                >
                  {selected && (
                    <svg
                      aria-hidden="true"
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={primaryContentVar(key)}
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Notificaciones */}
      <section className="surface bg-base-100 border border-base-300 rounded-xl overflow-hidden mt-4">
        <div className="p-4 border-b border-base-300">
          <p className="text-sm font-medium text-base-content">Notificaciones</p>
        </div>

        <div className="p-4 flex items-center justify-between gap-4 border-b border-base-300">
          <div className="min-w-0">
            <p className="text-sm font-medium">Sonido</p>
            <p className="text-xs text-fg-soft">
              Reproducir un sonido al recibir un pedido.
            </p>
          </div>
          <input
            type="checkbox"
            className="toggle toggle-sm"
            checked={notifications.sound}
            onChange={(e) => setNotificationPref("sound", e.target.checked)}
            aria-label="Sonido de notificaciones"
          />
        </div>

        {/* Volumen del sonido — se atenúa/deshabilita si el sonido está apagado */}
        <div
          className={`p-4 border-b border-base-300 transition-opacity ${
            notifications.sound ? "" : "opacity-50"
          }`}
        >
          <div className="flex items-center justify-between gap-3 mb-2">
            <p className="text-sm font-medium">Volumen</p>
            <span className="text-xs text-fg-soft tabular-nums">
              {Math.round(notifications.volume * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(notifications.volume * 100)}
              onChange={(e) =>
                setNotificationPref("volume", Number(e.target.value) / 100)
              }
              className="range-thin flex-1"
              style={
                {
                  "--range-fill": `${Math.round(notifications.volume * 100)}%`,
                } as CSSProperties
              }
              aria-label="Volumen del sonido"
              disabled={!notifications.sound}
            />
            <button
              type="button"
              className="btn btn-sm btn-ghost shrink-0 gap-1.5"
              onClick={() => playNotificationSound(notifications.volume)}
              disabled={!notifications.sound}
            >
              <SpeakerIcon className="w-4 h-4" />
              Probar
            </button>
          </div>
        </div>

        <div className="p-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium">Notificaciones de escritorio</p>
            <p className="text-xs text-fg-soft">
              Avisar aunque la pestaña esté en segundo plano.
            </p>
            {supported && permission === "denied" && (
              <p className="text-xs text-error mt-1">
                Están bloqueadas en el navegador. Habilitalas desde la
                configuración del sitio.
              </p>
            )}
            {!supported && (
              <p className="text-xs text-fg-subtle mt-1">
                Tu navegador no soporta notificaciones de escritorio.
              </p>
            )}
          </div>
          <input
            type="checkbox"
            className="toggle toggle-sm"
            checked={notifications.desktop && permission !== "denied"}
            onChange={(e) => handleDesktopToggle(e.target.checked)}
            disabled={!supported || permission === "denied"}
            aria-label="Notificaciones de escritorio"
          />
        </div>
      </section>
    </div>
  );
};
