import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import QRCode from "react-qr-code";
import { APP_ORIGIN } from "../../../../utils/host";
import { usePrefersReducedMotion } from "../../../../hooks/usePrefersReducedMotion";

// Hero visual: el teléfono (lo que ve el comensal) + la notificación (lo que
// recibe el dueño), ahora con tilt hacia el mouse, flotación y parallax de
// profundidad. Todo 2D + Framer Motion. Respeta prefers-reduced-motion.
export const HeroVisual = () => {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Mouse normalizado (-0.5..0.5) suavizado con spring.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 150, damping: 22 });
  const sy = useSpring(my, { stiffness: 150, damping: 22 });

  // Tilt 3D del teléfono (sutil) + parallax de la notificación (se mueve más).
  const rotateY = useTransform(sx, [-0.5, 0.5], [11, -11]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [-7, 7]);
  const notifX = useTransform(sx, [-0.5, 0.5], [24, -24]);
  const notifY = useTransform(sy, [-0.5, 0.5], [16, -16]);

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className="relative w-full h-full flex items-center justify-center"
      style={{ perspective: 1100 }}
    >
      {/* Glow cálido detrás */}
      <div className="absolute w-72 h-72 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />

      {/* Teléfono — lo que ve el comensal */}
      <motion.div
        style={{
          rotateX: reduced ? 0 : rotateX,
          rotateY: reduced ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={reduced ? undefined : { y: [0, -10, 0] }}
        transition={
          reduced ? undefined : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
        }
        className="relative mx-auto w-64 rounded-[2.5rem] border-[6px] border-base-300 bg-base-100 shadow-2xl p-3"
        aria-hidden="true"
      >
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
      </motion.div>

      {/* Notificación flotante — lo que recibe el dueño, al instante (parallax) */}
      <motion.div
        style={{ x: reduced ? 0 : notifX, y: reduced ? 0 : notifY }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-0 sm:-right-2 bottom-8 w-56 rounded-2xl border border-base-300 bg-base-100 shadow-xl p-3.5 flex items-start gap-3"
        aria-hidden="true"
      >
        <span className="shrink-0 w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            />
          </svg>
        </span>
        <div className="text-left">
          <p className="text-sm font-semibold leading-tight">Mesa 5 pidió la cuenta</p>
          <p className="text-xs text-fg-subtle">recién · sin apps</p>
        </div>
        <span className="ml-auto mt-1 w-2 h-2 rounded-full bg-success animate-pulse shrink-0" />
      </motion.div>
    </div>
  );
};
