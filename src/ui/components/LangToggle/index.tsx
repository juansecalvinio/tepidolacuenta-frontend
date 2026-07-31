import { useTranslation } from "react-i18next";

// Selector de idioma ES / EN. Cambia el idioma de toda la landing y persiste la
// elección (ver src/ui/i18n). "tepidolacuenta" no se traduce.
const LANGS = ["es", "en"] as const;

export const LangToggle = () => {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith("en") ? "en" : "es";

  return (
    <div
      role="group"
      aria-label="Idioma / Language"
      className="inline-flex items-center rounded-full border border-base-300 p-0.5 text-xs font-semibold"
    >
      {LANGS.map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => i18n.changeLanguage(lng)}
          aria-pressed={current === lng}
          className={`rounded-full px-2.5 py-1 uppercase transition-colors ${
            current === lng
              ? "bg-primary text-primary-content"
              : "text-fg-soft hover:text-fg"
          }`}
        >
          {lng}
        </button>
      ))}
    </div>
  );
};
