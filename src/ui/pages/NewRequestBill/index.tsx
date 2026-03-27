import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useFetchBillRequests } from "../../hooks/useFetchBillRequests";
import { useBillRequests } from "../../hooks/useBillRequests";
import type { PaymentMethod } from "../../../core/modules/bill-request/domain/models/BillRequest";
import { BillGeneratingAnimation } from "../../components/FeedbacksAnimations/BillGeneratingAnimation";

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; icon: string }[] =
  [
    { value: "cash", label: "Efectivo", icon: "💵" },
    { value: "debit_card", label: "Débito", icon: "💳" },
    { value: "credit_card", label: "Crédito", icon: "💳" },
  ];

const Spinner = () => (
  <div
    aria-hidden="true"
    className="w-5 h-5 rounded-full border-2 border-black/30 border-t-black animate-spin motion-reduce:animate-none"
  />
);

export const NewRequestBill = () => {
  const [searchParams] = useSearchParams();
  const { isLoading, isRequested, isDuplicateRequest, error } =
    useBillRequests();
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

  const buttonLabel = isLoading
    ? "Cargando..."
    : isRequested || isDuplicateRequest
      ? "Cuenta pedida"
      : "Pedir la cuenta";

  return (
    <div className="h-full flex justify-center bg-base-200">
      <div className="w-full max-w-sm h-full flex flex-col bg-base-200">
        {/* Top bar */}
        <header className="flex items-center justify-center px-6 pt-8 pb-4">
          <h1 className="text-brand text-xl sm:text-2xl font-light tracking-tighter cursor-pointer hover:opacity-80 transition-opacity">
            tepidolacuenta
          </h1>
        </header>

        {/* Contenido principal */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 gap-10">
          {/* Estado: solicitud duplicada */}
          {isDuplicateRequest && (
            <div
              role="status"
              aria-live="polite"
              className="flex flex-col items-center gap-5 text-center max-w-xs"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-base-100 border border-base-content/10">
                <svg
                  aria-hidden="true"
                  className="w-7 h-7 text-primary"
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
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-base-content">
                  Ya hay una cuenta pedida
                </p>
                <p className="text-sm leading-relaxed text-base-content/40">
                  Alguien en tu mesa ya solicitó la cuenta. El mozo está en
                  camino.
                </p>
              </div>
            </div>
          )}

          {/* Estado: QR inválido */}
          {!requestData && !isDuplicateRequest && (
            <div role="alert" className="text-center max-w-xs">
              <p className="text-sm leading-relaxed text-base-content/40">
                El código QR no es válido. Por favor, escaneá el código de tu
                mesa nuevamente.
              </p>
            </div>
          )}

          {/* Estado de pago: selector / cargando / éxito */}
          {!isDuplicateRequest && requestData && (
            <>
              <BillGeneratingAnimation
                isLoading={isLoading}
                isRequested={isRequested}
              />
              {/* {!isLoading && isRequested && <WaiterComingAnimation />} */}
              {!isLoading && !isRequested && (
                <div className="w-full max-w-sm flex flex-col gap-4">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-center font-medium text-base-content/70">
                    ¿Cómo vas a pagar?
                  </p>
                  <div
                    role="radiogroup"
                    aria-label="Método de pago"
                    className="grid grid-cols-3 gap-3"
                  >
                    {PAYMENT_OPTIONS.map((option) => {
                      const isSelected = paymentMethod === option.value;
                      return (
                        <button
                          key={option.value}
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => setPaymentMethod(option.value)}
                          disabled={isLoading}
                          className={`
                            flex flex-col items-center gap-3 py-6 rounded-2xl
                            transition-all duration-200
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral
                            disabled:opacity-40 active:scale-95
                            border
                            ${
                              isSelected
                                ? "bg-base-200 border-primary/45"
                                : "bg-base-100 border-base-content/5"
                            }
                          `}
                          style={
                            isSelected
                              ? {
                                  boxShadow:
                                    "0 0 20px rgba(200, 144, 42, 0.10)",
                                }
                              : undefined
                          }
                        >
                          <span className="text-2xl" aria-hidden="true">
                            {option.icon}
                          </span>
                          <span
                            className={`text-xs font-medium tracking-wide ${isSelected ? "text-primary" : "text-base-content/70"}`}
                          >
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* Zona CTA */}
        <div
          className="px-6 pt-4 flex flex-col gap-3"
          style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}
        >
          {/* Error inline */}
          {!isDuplicateRequest && error && (
              <div
                role="alert"
                aria-live="assertive"
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm animate-fade-in bg-error/10 border border-error/30 text-error"
              >
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v4m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Botón sello */}
            <button
              onClick={handleClick}
              disabled={isRequested || isDuplicateRequest || isLoading || !requestData}
              aria-label={buttonLabel}
              aria-busy={isLoading}
              className={`
                w-full h-18 rounded-full
                flex items-center justify-center gap-3
                text-xl font-black tracking-tight
                transition-all duration-500
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-neutral
                active:scale-[0.97]
                disabled:cursor-not-allowed
                ${!isRequested && !isDuplicateRequest && !isLoading && requestData ? "animate-breathe" : ""}
              `}
              style={
                isRequested || isDuplicateRequest
                  ? {
                      background: "linear-gradient(135deg, #3A7A50, #4E9A65)",
                      color: "#E8F5ED",
                      boxShadow: "0 0 32px rgba(60, 140, 90, 0.25)",
                    }
                  : {
                      background: "linear-gradient(135deg, #C88A2A, #D4A840)",
                      color: "#0E0A04",
                    }
              }
            >
              {isLoading && <Spinner />}
              {!isLoading && (isRequested || isDuplicateRequest) && (
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
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
              <span>{buttonLabel}</span>
            </button>
          </div>

        {/* Brand footer */}
        <footer className="py-4 flex items-center justify-center"></footer>
      </div>
    </div>
  );
};
