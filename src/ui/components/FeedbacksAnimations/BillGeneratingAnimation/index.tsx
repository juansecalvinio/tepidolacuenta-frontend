interface AnimationsProps {
  isLoading: boolean;
  isRequested: boolean;
}

export const BillGeneratingAnimation = ({
  isLoading,
  isRequested,
}: AnimationsProps) => {
  if (!isLoading && !isRequested) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Generando la cuenta"
      className="flex flex-col items-center gap-8 animate-fade-in"
    >
      <div className="animate-gentle-float">
        <svg
          width="64"
          height="76"
          viewBox="0 0 64 76"
          fill="none"
          aria-hidden="true"
        >
          {/* Cuerpo del recibo */}
          <rect
            width="64"
            height="60"
            rx="6"
            fill="currentColor"
            className="text-base-200"
          />
          {/* Borde inferior dentado */}
          <path
            d="M0 60 L5 68 L11 60 L16 68 L21 60 L27 68 L32 60 L37 68 L43 60 L48 68 L53 60 L59 68 L64 60Z"
            fill="currentColor"
            className="text-base-200"
          />
          {/* Línea encabezado */}
          <rect
            x="10"
            y="12"
            width="44"
            height="5"
            rx="2.5"
            fill="currentColor"
            className="text-primary animate-receipt-line"
            style={{ animationDelay: "0s" }}
          />
          {/* Líneas de ítems */}
          <rect
            x="10"
            y="25"
            width="32"
            height="4"
            rx="2"
            fill="currentColor"
            className="text-base-content/20 animate-receipt-line"
            style={{ animationDelay: "0.3s" }}
          />
          <rect
            x="10"
            y="34"
            width="38"
            height="4"
            rx="2"
            fill="currentColor"
            className="text-base-content/20 animate-receipt-line"
            style={{ animationDelay: "0.6s" }}
          />
          <rect
            x="10"
            y="43"
            width="26"
            height="4"
            rx="2"
            fill="currentColor"
            className="text-base-content/20 animate-receipt-line"
            style={{ animationDelay: "0.9s" }}
          />
          {/* Separador total */}
          <rect
            x="6"
            y="53"
            width="52"
            height="1"
            rx="0.5"
            fill="currentColor"
            className="text-base-content/10"
          />
        </svg>
      </div>

      {/* Puntitos loading */}
      <div className="flex gap-1.5 items-center" aria-hidden="true">
        <div
          className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: "0.15s" }}
        />
        <div
          className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: "0.3s" }}
        />
      </div>

      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="text-md font-bold text-base-content">
          {isLoading && "Enviando tu pedido..."}
          {!isLoading && isRequested && "Tu pedido se envió a la caja."}
        </p>
        <p className="text-sm leading-relaxed text-base-content/40">
          {isLoading && "Un momento por favor."}
          {!isLoading &&
            isRequested &&
            "Enseguida te acercamos la cuenta a la mesa."}
        </p>
      </div>
    </div>
  );
};
