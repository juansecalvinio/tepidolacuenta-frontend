import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { es } from "./locales/es";
import { en } from "./locales/en";

const STORAGE_KEY = "lang";

const readStored = (): "es" | "en" => {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "en" ? "en" : "es";
  } catch {
    return "es";
  }
};

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: readStored(),
  fallbackLng: "es",
  interpolation: { escapeValue: false }, // React ya escapa
});

// Mantener <html lang> y localStorage sincronizados con el idioma activo.
const applyLang = (lng: string) => {
  const short = lng.startsWith("en") ? "en" : "es";
  document.documentElement.lang = short;
  try {
    localStorage.setItem(STORAGE_KEY, short);
  } catch {
    /* almacenamiento no disponible: ignorar */
  }
};

applyLang(i18n.language);
i18n.on("languageChanged", applyLang);

export default i18n;
