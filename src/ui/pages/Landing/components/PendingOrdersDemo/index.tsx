import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { CashIcon, CardIcon } from "../../../../components/icons";
import { usePrefersReducedMotion } from "../../../../hooks/usePrefersReducedMotion";

type Order = {
  id: string;
  mesa: number;
  labelKey: string; // clave i18n del método de pago (minúscula)
  Icon: (props: { className?: string }) => React.ReactElement;
  agoKey: string; // clave i18n del tiempo transcurrido
};

// Pedidos que van "llegando" en vivo, en orden de arribo (el índice 0 llega
// primero). Espejan la card real de la vista employee. El contenedor reserva
// espacio para los tres, así no se redimensiona a medida que aparecen.
const ORDERS: Order[] = [
  { id: "o1", mesa: 5, labelKey: "demo.cashLower", Icon: CashIcon, agoKey: "demo.justNow" },
  { id: "o2", mesa: 12, labelKey: "demo.creditLower", Icon: CardIcon, agoKey: "demo.ago1min" },
  { id: "o3", mesa: 3, labelKey: "demo.debitLower", Icon: CardIcon, agoKey: "demo.ago2min" },
];

// Cada cuánto llega un pedido nuevo, y pausa antes de reiniciar el ciclo.
const ARRIVAL_MS = 650;
const RESTART_MS = 2600;

// Demo cíclico de la vista del empleado: los pedidos aparecen en tiempo real,
// el más nuevo arriba, con su punto pulsante. Al completarse el listado hace
// una pausa y reinicia. Respeta prefers-reduced-motion (los muestra todos).
export const PendingOrdersDemo = () => {
  const { t } = useTranslation();
  const reduced = usePrefersReducedMotion();
  // Arranca con el contenedor vacío y va sumando 1, 2, 3.
  const [count, setCount] = useState(reduced ? ORDERS.length : 0);

  useEffect(() => {
    if (reduced) return;
    const delay = count >= ORDERS.length ? RESTART_MS : ARRIVAL_MS;
    const id = setTimeout(() => {
      setCount((prev) => (prev >= ORDERS.length ? 0 : prev + 1));
    }, delay);
    return () => clearTimeout(id);
  }, [count, reduced]);

  // Cada pedido aparece en su lugar (de arriba hacia abajo) sin mover a los
  // demás: el contenedor ya reserva el alto para los tres.
  const visible = ORDERS.slice(0, count);

  return (
    <div
      className="surface rounded-3xl border border-base-300 bg-base-100 overflow-hidden"
      aria-hidden="true"
    >
      {/* Barra superior tipo app */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-base-300/60 bg-base-200/40">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-70 animate-ping" />
            <span className="relative inline-flex rounded-full w-2 h-2 bg-success" />
          </span>
          {t("demo.pendingRequests")}
        </span>
        <span className="ml-auto text-xs text-fg-subtle tabular-nums">
          {t("demo.live", { count })}
        </span>
      </div>

      {/* Listado de pedidos: alto fijo para tres, van apareciendo de a uno */}
      <div className="p-4 flex flex-col gap-3 h-[21rem]">
        <AnimatePresence initial={false}>
          {visible.map(({ id, mesa, labelKey, Icon, agoKey }) => (
            <motion.div
              key={id}
              initial={reduced ? false : { opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="card bg-base-100 border border-base-300"
            >
              <div className="card-body p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-xl leading-tight">
                        {t("demo.table", { n: mesa })}
                      </div>
                      <div className="font-semibold text-sm text-fg flex items-center gap-1.5">
                        <span>{t("demo.paysWith", { label: t(labelKey) })}</span>
                        <Icon className="w-4 h-4 shrink-0" />
                      </div>
                      <div className="text-xs text-fg-soft">{t(agoKey)}</div>
                    </div>
                  </div>
                  <span className="btn btn-primary btn-sm pointer-events-none shrink-0">
                    {t("demo.deliverBill")}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
