import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { usePrefersReducedMotion } from "../../../../hooks/usePrefersReducedMotion";

type Step = {
  number: string;
  title: string;
  description: string;
};

// Cuánto dura cada paso antes de avanzar al siguiente (ms).
const STEP_MS = 2800;

// Transición de entrada/salida de cada pantalla del teléfono.
const screenTransition = { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const };

// Pantalla 01 — el dueño configura sus mesas (cada una con su QR).
const SetupScreen = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col h-full">
      <span className="text-xs text-fg-subtle mb-3">{t("demo.yourTables")}</span>
      {[1, 2, 3, 4].map((n, i) => (
      <motion.div
        key={n}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 + i * 0.1, duration: 0.35 }}
        className="flex items-center gap-3 rounded-xl bg-base-100 border border-base-300 px-3 py-2.5 mb-2"
      >
        <span className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center text-fg-subtle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-4 h-4">
            <rect x="4" y="4" width="6" height="6" rx="1" />
            <rect x="14" y="4" width="6" height="6" rx="1" />
            <rect x="4" y="14" width="6" height="6" rx="1" />
            <path strokeLinecap="round" d="M14 14h2m4 0h.01M14 18h.01M18 18h2m0 2h.01" />
          </svg>
        </span>
        <span className="text-sm font-medium flex-1">
          {t("demo.table", { n })}
        </span>
        <span className="text-success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
          </svg>
        </span>
      </motion.div>
      ))}
    </div>
  );
};

// Pantalla 02 — el comensal escanea y pide la cuenta (sin apps).
const ScanScreen = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center text-center h-full justify-center">
      <span className="font-display text-lg font-semibold">La Parrilla</span>
      <span className="text-xs text-fg-subtle mb-4">{t("demo.table", { n: 5 })}</span>
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="rounded-xl bg-base-100 border border-base-300 p-3"
    >
      <svg viewBox="0 0 40 40" className="w-24 h-24 text-fg">
        <rect x="2" y="2" width="12" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <rect x="26" y="2" width="12" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <rect x="2" y="26" width="12" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <rect x="6" y="6" width="4" height="4" fill="currentColor" />
        <rect x="30" y="6" width="4" height="4" fill="currentColor" />
        <rect x="6" y="30" width="4" height="4" fill="currentColor" />
        <path d="M20 20h4v4h-4zM28 20h4v4h-4zM20 28h4v4h-4zM32 28h4v4h-4zM28 34h4v4h-4z" fill="currentColor" />
      </svg>
    </motion.div>
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="mt-5 w-full rounded-xl bg-primary text-primary-content text-sm font-semibold py-2.5"
    >
      {t("demo.askBill")}
    </motion.div>
      <span className="text-[10px] text-fg-subtle mt-2">
        {t("demo.noApp")}
      </span>
    </div>
  );
};

// Pantalla 03 — el dueño recibe el pedido en tiempo real.
const ReceiveScreen = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col h-full">
      <span className="text-xs text-fg-subtle mb-3">
        {t("demo.pendingRequests")}
      </span>
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.15, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl bg-base-100 border border-base-300 p-4 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span className="text-sm font-semibold">{t("demo.table", { n: 5 })}</span>
        <span className="ml-auto text-[10px] text-fg-subtle">
          {t("demo.justNow")}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-fg-subtle mb-4">
        <span className="rounded-full bg-base-200 px-2 py-0.5">
          {t("demo.cash")}
        </span>
        <span>{t("demo.askedBill")}</span>
      </div>
      <div className="w-full rounded-lg bg-primary text-primary-content text-xs font-semibold py-2 text-center">
        {t("demo.markHandled")}
      </div>
      </motion.div>
    </div>
  );
};

const SCREENS = [SetupScreen, ScanScreen, ReceiveScreen];

type PhoneDemoProps = {
  steps: Step[];
};

// Demo cíclico: el teléfono recorre los tres pasos (configurar → escanear →
// recibir) y la lista de la derecha resalta el paso activo en sincronía. Es un
// walkthrough en loop, distinto de la foto estática del hero. Se puede clickear
// cada paso para saltar y respeta prefers-reduced-motion.
export const PhoneDemo = ({ steps }: PhoneDemoProps) => {
  const reduced = usePrefersReducedMotion();
  // Sin animación arrancamos en el paso del comensal (el más representativo).
  const [active, setActive] = useState(reduced ? 1 : 0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduced || paused) return;
    const id = setInterval(
      () => setActive((prev) => (prev + 1) % steps.length),
      STEP_MS
    );
    return () => clearInterval(id);
  }, [reduced, paused, steps.length]);

  const Screen = SCREENS[active] ?? ScanScreen;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      {/* Teléfono con la pantalla del paso activo */}
      <div
        className="flex justify-center"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-hidden="true"
      >
        <div className="relative">
          <div className="absolute inset-0 -z-10 m-auto w-56 h-56 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
          {/* El celular va en oscuro (data-theme) para resaltar sobre la landing
              clara; la lista de pasos de la derecha queda en el tema de la página.
              El data-theme va acá (en el marco redondeado), no en el wrapper, para
              que el fondo base-100 llene la forma del teléfono y no un rectángulo. */}
          <div data-theme="black" className="relative mx-auto w-64 h-[420px] rounded-[2.5rem] border-[6px] border-base-300 bg-base-100 shadow-2xl p-3">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 h-1.5 w-16 rounded-full bg-base-300" />
            <div className="mt-5 h-[calc(100%-1.75rem)] rounded-[1.75rem] bg-base-200/50 px-4 py-5 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -10 }}
                  transition={screenTransition}
                  className="h-full"
                >
                  <Screen />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de pasos — el activo se resalta */}
      <ol className="flex flex-col gap-3">
        {steps.map(({ number, title, description }, i) => {
          const isActive = i === active;
          return (
            <li key={number}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={isActive ? "step" : undefined}
                className={`w-full text-left flex gap-4 rounded-2xl border p-4 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-base-200 ${
                  isActive
                    ? "border-primary/40 bg-primary/5"
                    : "border-transparent hover:bg-base-200/50"
                }`}
              >
                <span
                  className={`font-display text-3xl font-semibold italic leading-none transition-colors duration-300 ${
                    isActive ? "text-primary" : "text-primary/25"
                  }`}
                >
                  {number}
                </span>
                <span className="flex-1">
                  <span className="block font-display font-semibold text-lg mb-1">
                    {title}
                  </span>
                  <span className="block text-fg-subtle text-sm leading-relaxed">
                    {description}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
