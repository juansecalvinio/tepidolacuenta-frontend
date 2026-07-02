import { motion } from "motion/react";
import type { ReactNode } from "react";
import { PendingOrdersDemo } from "../PendingOrdersDemo";
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
// animadas y mockups estáticos, alternando lado.
export const ManageShowcase = () => (
  <section className="py-24 px-4 border-t border-base-300/40">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-3 text-balance">
          Todo lo que podés gestionar
        </h2>
        <p className="text-fg-subtle text-lg text-balance">
          Desde una sola pantalla, en tiempo real y sin complicaciones.
        </p>
      </div>

      <div className="flex flex-col gap-20 lg:gap-28">
        <Row
          eyebrow="En tiempo real"
          title="Recibí los pedidos al instante"
          body="Cuando un cliente pide la cuenta, el pedido aparece al toque en tu panel con la mesa y el método de pago. Un toque y queda atendido."
          visual={<PendingOrdersDemo />}
        />
        <Row
          flip
          eyebrow="Equipo"
          title="Sumá a tu equipo con un código"
          body="Generá un código de invitación y tu empleado se registra con acceso solo a la sucursal que le asignes. Sin correos ni configuraciones: expira a los 7 días y es de un solo uso."
          visual={<MockTeamInvite />}
        />
        <Row
          eyebrow="Sucursales"
          title="Manejá todos tus locales"
          body="Administrá varias sucursales desde una sola cuenta, cada una con sus mesas, su equipo y sus pedidos. Cambiás de local con un toque."
          visual={<MockBranches />}
        />
        <Row
          flip
          eyebrow="Mesas"
          title="Una mesa, un QR"
          body="Creás tus mesas en minutos y cada una obtiene su propio código QR único. El cliente escanea el de su mesa y ya sabés exactamente quién pide la cuenta."
          visual={<MockTables />}
        />
        <Row
          eyebrow="Imprimir QRs"
          title="Llevalos a la mesa en un PDF"
          body="Descargá los códigos QR de todas tus mesas listos para imprimir. Los pegás en cada mesa y tus clientes ya pueden pedir la cuenta sin apps."
          visual={<MockPrintQRs />}
        />
      </div>
    </div>
  </section>
);
