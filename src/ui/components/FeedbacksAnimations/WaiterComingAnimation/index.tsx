export const WaiterComingAnimation = () => (
  <div
    role="status"
    aria-live="polite"
    aria-label="Cuenta pedida. El mozo está yendo a tu mesa."
    className="flex flex-col items-center gap-6 animate-fade-in"
  >
    {/* Recibo con checkmark flotando */}
    <div className="animate-gentle-float" aria-hidden="true">
      <svg width="56" height="68" viewBox="0 0 56 68" fill="none">
        {/* Papel */}
        <rect
          width="56"
          height="52"
          rx="6"
          fill="currentColor"
          className="text-base-200"
        />
        {/* Dentado inferior */}
        <path
          d="M0 52 L4 60 L9 52 L14 60 L18 52 L23 60 L28 52 L33 60 L37 52 L42 60 L47 52 L51 60 L56 52Z"
          fill="currentColor"
          className="text-base-200"
        />
        {/* Líneas del recibo */}
        <rect
          x="8"
          y="10"
          width="28"
          height="4"
          rx="2"
          fill="currentColor"
          className="text-base-content/20"
        />
        <rect
          x="8"
          y="20"
          width="22"
          height="3"
          rx="1.5"
          fill="currentColor"
          className="text-base-content/15"
        />
        <rect
          x="8"
          y="29"
          width="26"
          height="3"
          rx="1.5"
          fill="currentColor"
          className="text-base-content/15"
        />
        <rect
          x="4"
          y="38"
          width="48"
          height="1"
          rx="0.5"
          fill="currentColor"
          className="text-base-content/10"
        />
        <rect
          x="8"
          y="43"
          width="20"
          height="4"
          rx="2"
          fill="currentColor"
          className="text-base-content/20"
        />
        {/* Círculo check - superpuesto */}
        <circle
          cx="44"
          cy="10"
          r="12"
          fill="currentColor"
          className="text-success"
        />
        <path
          d="M39 10 L43 14 L50 6"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>

    {/* Huellas de pasos — perspectiva: arriba=lejos, abajo=cerca */}
    <div className="flex flex-col gap-2.5 items-center" aria-hidden="true">
      {/* Paso 1 — más lejos (izquierda) */}
      <div
        className="flex gap-10 items-center animate-footstep"
        style={{ animationDelay: "0s" }}
      >
        <div className="w-3 h-5 rounded-full bg-success/20 -rotate-12" />
        <div className="w-3 h-5 opacity-0" />
      </div>
      {/* Paso 2 (derecha) */}
      <div
        className="flex gap-10 items-center animate-footstep"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="w-3 h-5 opacity-0" />
        <div className="w-3.5 h-5 rounded-full bg-success/35 rotate-12" />
      </div>
      {/* Paso 3 (izquierda) */}
      <div
        className="flex gap-10 items-center animate-footstep"
        style={{ animationDelay: "0.4s" }}
      >
        <div className="w-3.5 h-6 rounded-full bg-success/55 -rotate-12" />
        <div className="w-3.5 h-6 opacity-0" />
      </div>
      {/* Paso 4 — más cerca (derecha) */}
      <div
        className="flex gap-10 items-center animate-footstep"
        style={{ animationDelay: "0.6s" }}
      >
        <div className="w-4 h-6 opacity-0" />
        <div className="w-4 h-6 rounded-full bg-success/75 rotate-12" />
      </div>
    </div>

    <div className="flex flex-col items-center gap-1.5 text-center">
      <p className="text-sm font-semibold text-base-content">¡Cuenta pedida!</p>
      <p className="text-xs text-base-content/40">
        El mozo está yendo a tu mesa
      </p>
    </div>
  </div>
);
