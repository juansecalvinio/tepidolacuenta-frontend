import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { APP_ORIGIN, isAppHost } from "../../utils/host";
import { motion } from "motion/react";
import QRCode from "react-qr-code";
import { useAuth } from "../../hooks/useAuth";
import { useSubscription } from "../../hooks/useSubscription";
import { useFetchSubscription } from "../../hooks/useFetchSubscription";
import type { Plan } from "../../../core/modules/subscription/domain/models/Subscription";
import { PriceUtils } from "../../utils/price.utils";
import { getPlanFeatures } from "../../utils/plan.utils";


// ─── Icons ────────────────────────────────────────────────────────────────────

const QrCodeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"
    />
  </svg>
);

const BellIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
    />
  </svg>
);

const BuildingStorefrontIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
    />
  </svg>
);

const ChartBarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={2}
    stroke="currentColor"
    className="w-4 h-4 shrink-0"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m4.5 12.75 6 6 9-13.5"
    />
  </svg>
);

// ─── Static data ──────────────────────────────────────────────────────────────

const FEATURES = [
  {
    Icon: QrCodeIcon,
    title: "QR por mesa",
    description:
      "Cada mesa tiene su propio código QR. El cliente escanea sin instalar ninguna app, en segundos.",
  },
  {
    Icon: BellIcon,
    title: "Solicitudes en tiempo real",
    description:
      "Recibís la notificación al instante que tu cliente la hace. Sin tener que mirar cada mesa.",
  },
  {
    Icon: BuildingStorefrontIcon,
    title: "Multi-sucursal",
    description:
      "Manejá todas tus sucursales desde un solo panel. Cada una con sus propias mesas y QRs.",
  },
  {
    Icon: ChartBarIcon,
    title: "Panel de administración",
    description:
      "Configurá tus mesas, revisá el historial y gestioná las solicitudes de cuenta desde un solo lugar.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Configurás tus mesas",
    description:
      "Creás tu cuenta, agregás tu restaurante y generás los códigos QR para cada mesa en minutos.",
  },
  {
    number: "02",
    title: "El cliente escanea",
    description:
      "Cuando quiere la cuenta, escanea el QR de la mesa y elige el método de pago. Sin apps.",
  },
  {
    number: "03",
    title: "Vos recibís la solicitud",
    description:
      "La solicitud aparece en tu dashboard en tiempo real. Un toque y está atendida.",
  },
];

const TRUST_SIGNALS = [
  "Sin app para el cliente",
  "Sin tarjeta para probar",
  "Listo en minutos",
];

const FAQS = [
  {
    question: "¿El cliente tiene que descargar una app?",
    answer:
      "No. El cliente escanea el QR de la mesa con la cámara del teléfono y pide la cuenta desde el navegador. Sin instalar nada.",
  },
  {
    question: "¿Necesito comprar algún hardware?",
    answer:
      "No hace falta. Imprimís los códigos QR que genera el sistema y los ponés en cada mesa. Nada más.",
  },
  {
    question: "¿Cómo me entero cuando un cliente pide la cuenta?",
    answer:
      "Te llega una notificación al instante en tu panel, con el número de mesa. La atendés con un toque.",
  },
  {
    question: "¿Puedo manejar más de una sucursal?",
    answer:
      "Sí. Gestionás todas tus sucursales desde un mismo panel, cada una con sus propias mesas y QRs.",
  },
  {
    question: "¿Puedo cancelar cuando quiera?",
    answer:
      "Sí. Empezás con días de prueba gratis y cancelás cuando quieras, sin compromiso ni permanencia.",
  },
];

// ─── Plan card ────────────────────────────────────────────────────────────────

const PlanCard = ({
  plan,
  isRecommended,
  onSelect,
}: {
  plan: Plan;
  isRecommended: boolean;
  onSelect: () => void;
}) => (
  <div
    className={`relative flex flex-col w-full rounded-2xl transition-shadow ${
      isRecommended
        ? "border-2 border-primary bg-base-100 md:shadow-lg"
        : "border border-base-300 bg-base-100"
    }`}
  >
    {isRecommended && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <span className="badge badge-primary badge-sm font-semibold px-3">
          Recomendado
        </span>
      </div>
    )}
    <div className="flex flex-col flex-1 p-6">
      <h3 className="font-display text-xl font-semibold mb-3">{plan.name}</h3>
      <div className="mb-1">
        <span className="font-display text-4xl font-semibold tracking-tight whitespace-nowrap tabular-nums">
          $ {PriceUtils.getFormattedPrice(plan.price)}
        </span>
        <span className="text-sm opacity-60">/mes</span>
      </div>
      {plan.trialDays > 0 && (
        <p className="text-xs opacity-50 mb-5">
          {plan.trialDays} días gratis al comenzar
        </p>
      )}
      <ul className="space-y-2.5 mb-8 flex-1">
        {getPlanFeatures(plan).map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <span className="text-success">
              <CheckIcon />
            </span>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <button
        className={`btn w-full ${isRecommended ? "btn-primary" : "btn-secondary"}`}
        onClick={onSelect}
      >
        Empezar Gratis
      </button>
    </div>
  </div>
);

// ─── Hero mockup ──────────────────────────────────────────────────────────────

const HeroMockup = () => (
  <div className="relative w-full max-w-[300px]">
    {/* Phone — what the customer sees */}
    <div className="relative mx-auto w-64 rounded-[2.5rem] border-[6px] border-base-300 bg-base-100 shadow-xl p-3">
      <div className="absolute top-3 left-1/2 -translate-x-1/2 h-1.5 w-16 rounded-full bg-base-300" />
      <div className="mt-5 rounded-[1.75rem] bg-base-200/50 px-5 py-6 flex flex-col items-center text-center">
        <span className="font-display text-lg font-semibold">La Parrilla</span>
        <span className="text-xs text-fg-subtle mb-4">Mesa 5</span>
        <div className="rounded-xl bg-white p-3">
          <QRCode value={`${APP_ORIGIN}/request`} size={116} />
        </div>
        <div className="mt-5 w-full rounded-xl bg-primary text-primary-content text-sm font-semibold py-2.5">
          Pedir la cuenta
        </div>
        <span className="text-[10px] text-fg-subtle mt-2">
          Sin descargar ninguna app
        </span>
      </div>
    </div>

    {/* Floating notification — what the owner gets, instantly */}
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="absolute -right-2 sm:-right-6 -bottom-4 w-52 rounded-2xl border border-base-300/60 bg-base-100 shadow-lg p-3.5 flex items-start gap-3"
    >
      <span className="shrink-0 w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
        <BellIcon />
      </span>
      <div className="text-left">
        <p className="text-sm font-semibold leading-tight">Nueva solicitud</p>
        <p className="text-xs text-fg-subtle">Mesa 5 · hace un instante</p>
      </div>
      <span className="ml-auto mt-0.5 w-2 h-2 rounded-full bg-success animate-pulse shrink-0" />
    </motion.div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { plans, isLoading } = useSubscription();
  const { fetchPlans } = useFetchSubscription();

  // El sticky CTA (mobile) aparece solo cuando el CTA del hero queda fuera de
  // vista, para no mostrar dos botones idénticos al mismo tiempo.
  const heroCtaRef = useRef<HTMLButtonElement>(null);
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    if (isAppHost()) return; // en el subdominio app no se muestra la landing
    fetchPlans();
  }, [fetchPlans]);

  useEffect(() => {
    const el = heroCtaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyCta(!entry.isIntersecting),
      { rootMargin: "0px 0px -16px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleGetStarted = () => {
    navigate(isAuthenticated ? "/dashboard" : "/register");
  };

  const sortedPlans = [...plans].sort((a, b) => a.price - b.price);
  const recommendedId = sortedPlans[Math.floor((sortedPlans.length - 1) / 2)]?.id;
  const trialDays = sortedPlans[0]?.trialDays ?? 30;

  // En el subdominio app la landing no se muestra: a la app directamente.
  if (isAppHost()) {
    return (
      <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
    );
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content overflow-x-hidden">
      {/* ── Sticky Header ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-base-300/40 backdrop-blur-md bg-base-100/80">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-display text-lg font-semibold tracking-tight">
            tepidolacuenta
          </span>
          <Link to="/login" className="btn btn-secondary btn-sm">
            Ingresar
          </Link>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative flex items-center min-h-[calc(100vh-3.5rem)] px-4 py-16 overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-87.5 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center lg:text-left"
          >
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.08] mb-6 text-balance">
              Pedir la cuenta
              <span className="text-primary italic block">ahora es más simple</span>
            </h1>
            <p className="text-lg sm:text-xl text-fg-soft mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Tus clientes escanean el QR de la mesa. Vos recibís la solicitud al
              instante. Sin aplicaciones, sin confusión.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button
                ref={heroCtaRef}
                onClick={handleGetStarted}
                className="btn btn-primary btn-lg"
              >
                Empezar Gratis
              </button>
              <a href="#planes" className="btn btn-ghost btn-lg">
                Ver planes →
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 justify-center lg:justify-start">
              {TRUST_SIGNALS.map((signal) => (
                <li
                  key={signal}
                  className="flex items-center gap-1.5 text-sm text-fg-subtle"
                >
                  <span className="text-primary">
                    <CheckIcon />
                  </span>
                  {signal}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center lg:justify-end"
          >
            <HeroMockup />
          </motion.div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 border-t border-base-300/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-3 text-balance">
              Todo lo que necesitás
            </h2>
            <p className="text-fg-subtle text-lg max-w-md mx-auto">
              Diseñado para restaurantes que quieren dejar de depender del "¿nos
              trae la cuenta?"
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map(({ Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="border border-base-300/60 rounded-2xl p-6 bg-base-100 hover:border-base-300 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Icon />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
                <p className="text-fg-subtle text-sm leading-relaxed">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4 border-t border-base-300/40 bg-base-200/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-3 text-balance">
              Tres pasos y ya
            </h2>
            <p className="text-fg-subtle text-lg">
              Configuración en minutos, resultados desde el primer día.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {STEPS.map(({ number, title, description }, i) => (
              <motion.div
                key={number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <span className="font-display text-6xl font-semibold italic text-primary/25 leading-none block mb-4">
                  {number}
                </span>
                <h3 className="font-display font-semibold text-xl mb-2">{title}</h3>
                <p className="text-fg-subtle text-sm leading-relaxed">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plans ──────────────────────────────────────────────────────────── */}
      <section id="planes" className="py-24 px-4 border-t border-base-300/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-3 text-balance">
              Planes
            </h2>
            <p className="text-fg-subtle text-lg">
              Elegí el plan que mejor se adapta a tu negocio.
            </p>
          </div>

          {isLoading && plans.length === 0 ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              {sortedPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isRecommended={plan.id === recommendedId}
                  onSelect={handleGetStarted}
                />
              ))}
            </div>
          )}

          {plans.length > 0 && (
            <p className="text-center text-sm text-fg-subtle mt-6">
              Todos los planes incluyen {trialDays} días de prueba gratis.
              Cancelás cuando quieras.
            </p>
          )}
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 border-t border-base-300/40 bg-base-200/20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-3 text-balance">
              Preguntas frecuentes
            </h2>
            <p className="text-fg-subtle text-lg">
              Lo que suelen preguntar antes de empezar.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map(({ question, answer }, i) => (
              <motion.details
                key={question}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group rounded-2xl border border-base-300/60 bg-base-100 px-5 [&[open]]:border-base-300"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none py-4 font-display font-semibold text-lg">
                  {question}
                  <span className="shrink-0 text-fg-subtle transition-transform duration-200 group-open:rotate-45">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="text-fg-soft text-sm leading-relaxed pb-5 -mt-1">
                  {answer}
                </p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 border-t border-base-300/40">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-4 text-balance">
            Empezá a usarlo hoy
          </h2>
          <p className="text-fg-subtle text-lg mb-8">
            {trialDays} días gratis. Cancelás cuando quieras.
          </p>
          <button onClick={handleGetStarted} className="btn btn-primary btn-lg">
            Crear Cuenta Gratis
          </button>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-base-300/40 py-10 pb-28 md:pb-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-fg-subtle">
          <span className="font-display font-semibold text-fg-soft">
            tepidolacuenta
          </span>
          <span>© 2026 tepidolacuenta</span>
        </div>
      </footer>

      {/* ── Sticky mobile CTA ──────────────────────────────────────────────── */}
      {/* Aparece solo al scrollear más allá del CTA del hero */}
      <div
        className={`md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-base-300/40 bg-base-100/90 backdrop-blur-md px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] transition-all duration-300 ease-out ${
          showStickyCta
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
        aria-hidden={!showStickyCta}
      >
        <button
          onClick={handleGetStarted}
          className="btn btn-primary btn-block btn-lg"
        >
          Empezar Gratis
        </button>
      </div>
    </div>
  );
};
