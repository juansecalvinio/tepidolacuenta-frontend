import { useState } from "react";

const Spinner = () => (
  <div
    className="
    flex
    items-center
    justify-center
      w-8 h-8
      border-4 border-white/30
      border-t-white
      rounded-full
      animate-spin
    "
  />
);

const SuccessMessage = () => (
  <div className="absolute bottom-24 left-0 right-0 max-w-md mx-auto px-4 animate-fade-in">
    <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 shadow-md">
      <div className="flex items-start gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 h-6 w-6 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <h3 className="font-bold text-green-900">¡Listo!</h3>
          <p className="text-sm text-green-700 mt-1">
            Ya te traemos la cuenta, enseguida viene el mozo para que puedas
            pagarle
          </p>
        </div>
      </div>
    </div>
  </div>
);

export const RequestBill = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    // Simulate an async action
    // TODO: Implementar llamada a la API POST /api/v1/public/request-account
    setTimeout(() => {
      setIsRequested(true);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-base-200 relative">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <button
          onClick={handleClick}
          disabled={isRequested}
          className={`
          flex items-center justify-center
          w-50 h-50
          rounded-full
          text-white text-4xl font-extrabold
          transition-all
          disabled:cursor-not-allowed
          ${
            isRequested
              ? "bg-linear-to-br from-green-500 to-green-700 ring-4 ring-green-900/70 shadow-[0_0_25px_rgba(34,197,94,0.5)]"
              : "bg-linear-to-br from-cyan-400 to-cyan-600 ring-4 ring-cyan-700/70 shadow-[0_0_25px_rgba(34,211,238,0.5)] active:shadow-[0_4px_0_#0e7490] active:translate-y-1 hover:from-cyan-500 hover:to-cyan-700"
          }
          `}
        >
          {isLoading && <Spinner />}
          {!isLoading && !isRequested && "Pedir la cuenta"}
          {!isLoading && isRequested && "Cuenta pedida"}
        </button>
      </div>

      {/* Success Message - positioned absolutely */}
      {isRequested && <SuccessMessage />}

      {/* Footer */}
      <footer className="pb-8 pt-4">
        <p className="font-sans text-center text-lg font-extrabold text-base-content/40">
          tepidolacuenta
        </p>
      </footer>
    </div>
  );
};
