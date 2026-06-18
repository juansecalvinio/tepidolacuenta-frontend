import QRCode from "react-qr-code";

interface Props {
  tableNumber: number;
  qrCode: string;
  large?: boolean;
}

// Tarjeta pensada para impresión: siempre fondo blanco y QR negro (independiente
// del tema de la app), para que escanee y se imprima bien.
export const QRPrintCard = ({ tableNumber, qrCode, large = false }: Props) => (
  <div
    className={`break-inside-avoid flex flex-col items-center text-center bg-white border border-dashed border-neutral-300 rounded-lg ${
      large ? "px-8 py-10 gap-5" : "px-4 py-5 gap-3"
    }`}
  >
    <span
      className={`font-display font-semibold tracking-tight text-neutral-900 ${
        large ? "text-2xl" : "text-base"
      }`}
    >
      tepidolacuenta
    </span>

    <QRCode value={qrCode} size={large ? 280 : 140} />

    <div className="flex flex-col gap-0.5">
      <span
        className={`font-bold text-neutral-900 ${large ? "text-3xl" : "text-lg"}`}
      >
        Mesa {tableNumber}
      </span>
      <span className={`text-neutral-500 ${large ? "text-sm" : "text-xs"}`}>
        Escaneá para pedir la cuenta
      </span>
    </div>
  </div>
);
