import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Wrapper de entrada al hacer scroll: fade-in con desplazamiento direccional
// (desde abajo, los laterales o con escala desde el centro). Anima una sola vez
// y respeta `prefers-reduced-motion` (en ese caso, solo fade sin movimiento).
type Direction = "up" | "left" | "right" | "scale";

interface Props {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
}

const OFFSET: Record<Direction, { x?: number; y?: number; scale?: number }> = {
  up: { y: 24 },
  left: { x: -32 },
  right: { x: 32 },
  scale: { scale: 0.94 },
};

export const Reveal = ({
  children,
  direction = "up",
  delay = 0,
  className,
}: Props) => {
  const reduce = useReducedMotion();
  const offset = OFFSET[direction];

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, ...offset }}
      whileInView={
        reduce ? { opacity: 1 } : { opacity: 1, x: 0, y: 0, scale: 1 }
      }
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
