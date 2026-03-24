import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useFetchBillRequests } from "../../hooks/useFetchBillRequests";
import { useBillRequests } from "../../hooks/useBillRequests";
import type { PaymentMethod } from "../../../core/modules/bill-request/domain/models/BillRequest";

const Spinner = () => (
  <div
    className="
    flex items-center justify-center
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

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; icon: string }[] =
  [
    { value: "cash", label: "Efectivo", icon: "💵" },
    { value: "debit_card", label: "Tarjeta de débito", icon: "💳" },
    { value: "credit_card", label: "Tarjeta de crédito", icon: "💳" },
  ];

export const RequestBill = () => {
  const [searchParams] = useSearchParams();
  const { isLoading, isRequested, isDuplicateRequest, error } = useBillRequests();
  const { createBillRequest } = useFetchBillRequests();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
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
    if (!requestData || !paymentMethod) return;
    await createBillRequest({ ...requestData, paymentMethod });
  };

  return (
    <div className="h-full flex flex-col bg-base-200 relative">
      <div className="flex-1 flex flex-col items-center justify-center gap-10 px-6">

        {/* Duplicate request blocked state */}
        {isDuplicateRequest && (
          <div className="w-full max-w-xs flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-warning/15 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-warning"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-base-content">
                Ya hay una cuenta pedida
              </p>
              <p className="text-sm text-base-content/50 mt-1">
                Alguien en tu mesa ya solicitó la cuenta. El mozo está en camino.
              </p>
            </div>
          </div>
        )}

        {/* Payment method selector */}
        {!isRequested && !isDuplicateRequest && (
          <div className="w-full max-w-xs flex flex-col gap-3">
            <p className="text-base-content/40 text-xs tracking-widest uppercase text-center">
              ¿Cómo vas a pagar?
            </p>
            <div className="rounded-2xl overflow-hidden border border-base-content/10">
              {PAYMENT_OPTIONS.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => setPaymentMethod(option.value)}
                  disabled={isLoading}
                  className={`
                    w-full flex items-center gap-4 px-5 py-4 transition-colors
                    ${index > 0 ? "border-t border-base-content/10" : ""}
                    ${
                      paymentMethod === option.value
                        ? "bg-primary/15 text-base-content"
                        : "bg-transparent text-base-content/50 hover:bg-base-content/5"
                    }
                  `}
                >
                  <span className="text-xl">{option.icon}</span>
                  <span className="flex-1 text-left text-sm font-medium">
                    {option.label}
                  </span>
                  {paymentMethod === option.value && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-primary shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main button */}
        {!isDuplicateRequest && <button
          onClick={handleClick}
          disabled={isRequested}
          className={`
            flex items-center justify-center
            w-50 h-50
            rounded-full
            text-neutral text-4xl font-extrabold
            transition-all
            disabled:cursor-not-allowed
            ${
              isRequested
                ? "bg-linear-to-br from-green-300 to-green-500 ring-4 ring-green-900/70 shadow-[0_0_25px_rgba(34,197,94,0.5)]"
                : "bg-linear-to-br from-orange-300 to-orange-400 ring-4 ring-orange-900/70 shadow-[0_0_25px_rgba(197,175,34,0.5)] active:translate-y-1 hover:cursor-pointer"
            }
          `}
        >
          {isLoading && <Spinner />}
          {!isLoading && !isRequested && "Pedir la cuenta"}
          {!isLoading && isRequested && "Cuenta pedida"}
        </button>}

      </div>

      {isRequested && <SuccessMessage />}

      {error && <ErrorMessage message={error} />}

      <footer className="pb-8 pt-4 flex items-center justify-center">
        <h1 className="text-xl sm:text-2xl font-light tracking-tighter cursor-pointer hover:opacity-80 transition-opacity">
          tepidolacuenta
        </h1>
      </footer>
    </div>
  );
};
