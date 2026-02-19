import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useFetchBillRequests } from "../../hooks/useFetchBillRequests";
import { useBillRequests } from "../../hooks/useBillRequests";
import { AuthLogo } from "../../components/AuthLogo";

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

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="alert alert-soft alert-error absolute bottom-24 left-0 right-0 max-w-md mx-auto px-4 animate-fade-in">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="stroke-current shrink-0 h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span>{message}</span>
  </div>
);

export const RequestBill = () => {
  const [searchParams] = useSearchParams();
  const { isLoading, isRequested, error } = useBillRequests();
  const { createBillRequest } = useFetchBillRequests();
  const [requestData, setRequestData] = useState<{
    restaurantId: string;
    branchId: string;
    tableId: string;
    tableNumber: number;
    hash: string;
  } | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "black");
    return () => {
      document.documentElement.setAttribute("data-theme", "white");
    };
  }, []);

  useEffect(() => {
    const rawParams = window.location.search.slice(1).replace(/\\u0026/g, "&");
    const fixedSearchParams = new URLSearchParams(rawParams);

    const restaurantId = fixedSearchParams.get("r");
    const branchId = fixedSearchParams.get("b");
    const tableId = fixedSearchParams.get("t");
    const tableNumber = fixedSearchParams.get("n");
    const hash = fixedSearchParams.get("h");

    if (restaurantId && branchId && tableId && tableNumber && hash) {
      setRequestData({
        restaurantId,
        branchId,
        tableId,
        tableNumber: parseInt(tableNumber, 10),
        hash,
      });
    }
  }, [searchParams]);

  const handleClick = async () => {
    if (!requestData) {
      console.error("Datos de la mesa no disponibles");
      return;
    }

    await createBillRequest(requestData);
  };

  return (
    <div className="h-full flex flex-col bg-base-200 relative">
      <div className="flex-1 flex items-center justify-center">
        <button
          onClick={handleClick}
          disabled={isRequested}
          className={`
          flex items-center justify-center
          w-70 h-70
          rounded-full
          text-neutral text-4xl font-extrabold
          transition-all
          disabled:cursor-not-allowed
          ${
            isRequested
              ? "bg-linear-to-br from-lime-300 to-green-500 ring-4 ring-lime-900/70 shadow-[0_0_25px_rgba(34,197,94,0.5)]"
              : "bg-linear-to-br from-lime-300 to-green-500 ring-4 ring-lime-900/70 shadow-[0_0_25px_rgba(34,197,94,0.5)] active:translate-y-1 hover:cursor-pointer"
          }
          `}
        >
          {isLoading && <Spinner />}
          {!isLoading && !isRequested && "Pedir la cuenta"}
          {!isLoading && isRequested && "Cuenta pedida"}
        </button>
      </div>

      {isRequested && <SuccessMessage />}

      {error && <ErrorMessage message={error} />}

      <footer className="pb-8 pt-4">
        <AuthLogo />
      </footer>
    </div>
  );
};
