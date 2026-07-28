import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PendingOrdersDemo } from "../PendingOrdersDemo";
import { Reveal } from "../Reveal";
import {
  MockTeamInvite,
  MockBranches,
  MockTables,
  MockPrintQRs,
} from "./mocks";

type RowProps = {
  eyebrow: string;
  title: string;
  body: string;
  visual: ReactNode;
  // Si es true, el visual va a la izquierda y el texto a la derecha.
  flip?: boolean;
};

// Fila del showcase: texto de un lado y visual del otro, alternando. El visual
// puede ser una demo animada o un mockup estático.
const Row = ({ eyebrow, title, body, visual, flip }: RowProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={flip ? "lg:order-2" : ""}
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-primary">
        {eyebrow}
      </span>
      <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mt-2 mb-3 text-balance">
        {title}
      </h3>
      <p className="text-fg-subtle text-base leading-relaxed max-w-md">{body}</p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
      className={flip ? "lg:order-1" : ""}
    >
      {visual}
    </motion.div>
  </div>
);

// Sección "Todo lo que podés gestionar": muestra las funcionalidades con demos
// animadas y mockups estáticos, alternando lado. Los textos vienen de i18n
// (showcase.rows); los visuales y el lado (flip) viven en código, zipeados por índice.
export const ManageShowcase = () => {
  const { t } = useTranslation();
  const rows = t("showcase.rows", { returnObjects: true }) as {
    eyebrow: string;
    title: string;
    body: string;
  }[];
  const visuals: ReactNode[] = [
    <PendingOrdersDemo />,
    <MockTeamInvite />,
    <MockBranches />,
    <MockTables />,
    <MockPrintQRs />,
  ];
  const flips = [false, true, false, true, false];

  return (
    <section className="py-24 px-4 border-t border-base-300/40">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-3 text-balance">
            {t("showcase.heading")}
          </h2>
          <p className="text-fg-subtle text-lg text-balance">
            {t("showcase.subtitle")}
          </p>
        </Reveal>

        <div className="flex flex-col gap-20 lg:gap-28">
          {rows.map((row, i) => (
            <Row
              key={row.title}
              eyebrow={row.eyebrow}
              title={row.title}
              body={row.body}
              flip={flips[i]}
              visual={visuals[i]}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
