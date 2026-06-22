import { useState, useEffect, useMemo, useRef } from "react";
import { useFetchBillRequests } from "../../hooks/useFetchBillRequests";
import { useBillRequests } from "../../hooks/useBillRequests";
import type {
  PaymentMethod,
  VenueInfo,
} from "../../../core/modules/bill-request/domain/models/BillRequest";
import { getBillRequestRepository } from "../../../core/modules/bill-request/infrastructure/repositories/BillRequestRepositoryFactory";
import { GetVenueInfo } from "../../../core/modules/bill-request/use-cases/GetVenueInfo";
import { BillGeneratingAnimation } from "../../components/FeedbacksAnimations/BillGeneratingAnimation";
import { WaiterComingAnimation } from "../../components/FeedbacksAnimations/WaiterComingAnimation";
import { parseBillRequestQr } from "./parseBillRequestQr";

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; icon: string }[] =
  [
    { value: "cash", label: "Efectivo", icon: "💵" },
    { value: "debit_card", label: "Débito", icon: "🏧" },
    { value: "credit_card", label: "Crédito", icon: "💳" },
  ];

const Spinner = () => (
  <div
    aria-hidden="true"
    className="w-5 h-5 rounded-full border-2 border-black/30 border-t-black animate-spin motion-reduce:animate-none"
  />
);

export const NewRequestBill = () => {
  const { isLoading, isRequested, isDuplicateRequest, error } =
    useBillRequests();
  const { createBillRequest } = useFetchBillRequests();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [isSlow, setIsSlow] = useState(false);
  const [venueInfo, setVenueInfo] = useState<VenueInfo | null>(null);
  const radioRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Parseamos los datos del QR de forma síncrona durante el render para evitar
  // un parpadeo de "QR inválido" mientras corría el efecto en QRs válidos.
  // El QR se carga una sola vez; los params no cambian sin remontar.
  const requestData = useMemo(() => parseBillRequestQr(window.location.search), []);

  useEffect(() => {
    const root = document.documentElement;
    const previousTheme = root.getAttribute("data-theme");
    root.setAttribute("data-theme", "black");

    const meta = document.querySelector('meta[name="theme-color"]');
    const previousThemeColor = meta?.getAttribute("content") ?? null;
    meta?.setAttribute("content", "#1a1a1a");

    return () => {
      root.setAttribute("data-theme", previousTheme ?? "white");
      if (meta && previousThemeColor !== null) {
        meta.setAttribute("content", previousThemeColor);
      }
    };
  }, []);

  // Traemos el nombre del local y la sucursal (endpoint público validado por
  // el hash del QR). Si falla, la página sigue funcionando solo con la mesa.
  useEffect(() => {
    if (!requestData) return;
    let cancelled = false;

    const fetchVenue = async () => {
      try {
        const getVenueInfo = GetVenueInfo(getBillRequestRepository());
        const response = await getVenueInfo({
          restaurantId: requestData.restaurantId,
          branchId: requestData.branchId,
          tableId: requestData.tableId,
          tableNumber: requestData.tableNumber,
          hash: requestData.hash,
        });
        if (!cancelled) setVenueInfo(response.data);
      } catch {
        // Silencioso: el header muestra solo la mesa, que ya viene del QR.
      }
    };

    fetchVenue();
    return () => {
      cancelled = true;
    };
  }, [requestData]);

  // Si el envío tarda demasiado, avisamos que sigue en curso (red lenta).
  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => setIsSlow(true), 8000);
    return () => {
      clearTimeout(timer);
      setIsSlow(false);
    };
  }, [isLoading]);

  const handleClick = async () => {
    if (!requestData || !paymentMethod) return;
    await createBillRequest({ ...requestData, paymentMethod });
  };

  const buttonLabel = isLoading
    ? "Cargando…"
    : isRequested || isDuplicateRequest
      ? "Cuenta pedida"
      : "Pedir la cuenta";

  const selectedOption = PAYMENT_OPTIONS.find(
    (option) => option.value === paymentMethod,
  );
  const isSelecting =
    !!requestData && !isDuplicateRequest && !isRequested && !isLoading;

  // Navegación con flechas dentro del radiogroup (patrón ARIA): mueve la
  // selección y el foco al radio anterior/siguiente.
  const handleRadioKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % PAYMENT_OPTIONS.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex =
        (index - 1 + PAYMENT_OPTIONS.length) % PAYMENT_OPTIONS.length;
    }
    if (nextIndex === null) return;
    event.preventDefault();
    setPaymentMethod(PAYMENT_OPTIONS[nextIndex].value);
    radioRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="h-dvh flex justify-center bg-base-200">
      <div className="w-full max-w-sm h-full flex flex-col bg-base-200">
        {/* Datos del local agrupados */}
        <header className="px-6 pt-6 pb-2">
          {requestData && (
            <div className="rounded-2xl bg-base-100 border border-base-content/10 px-5 py-4 flex flex-col items-center gap-1 text-center">
              {venueInfo && (
                <>
                  <p className="text-lg font-semibold leading-snug text-base-content text-pretty break-words">
                    {venueInfo.restaurantName}
                  </p>
                  {venueInfo.branchAddress && (
                    <p className="text-sm leading-snug text-fg-soft text-pretty break-words">
                      {venueInfo.branchAddress}
                    </p>
                  )}
                </>
              )}
              <span className="mt-2 inline-flex items-center rounded-full bg-primary/10 border border-primary/30 px-3.5 py-1 text-sm font-semibold tracking-wide text-primary">
                Mesa {requestData.tableNumber}
              </span>
            </div>
          )}
        </header>

        {/* Contenido principal */}
        <main className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-center px-6 gap-8">
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
                <p className="text-lg font-semibold text-base-content">
                  Ya hay una cuenta pedida
                </p>
                <p className="text-base leading-relaxed text-fg-soft">
                  Alguien en tu mesa ya solicitó la cuenta. El mozo está en
                  camino.
                </p>
              </div>
            </div>
          )}

          {/* Estado: QR inválido */}
          {!requestData && !isDuplicateRequest && (
            <div role="alert" className="text-center max-w-xs">
              <p className="text-base leading-relaxed text-fg-soft">
                El código QR no es válido. Por favor, escaneá el código de tu
                mesa nuevamente.
              </p>
            </div>
          )}

          {/* Estado de pago: selector / cargando / éxito */}
          {!isDuplicateRequest && requestData && (
            <>
              {isLoading && (
                <BillGeneratingAnimation isLoading={isLoading} isRequested={false} />
              )}
              {isLoading && isSlow && (
                <p
                  aria-live="polite"
                  className="text-base text-center leading-relaxed text-fg-soft max-w-xs -mt-4"
                >
                  Está tardando más de lo normal. Seguí esperando un momento…
                </p>
              )}
              {!isLoading && isRequested && (
                <WaiterComingAnimation method={selectedOption} />
              )}
              {!isLoading && !isRequested && (
                <div className="w-full max-w-sm flex flex-col gap-4">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-center font-medium text-fg-soft">
                    ¿Cómo vas a pagar?
                  </p>
                  <div
                    role="radiogroup"
                    aria-label="Método de pago"
                    className="grid grid-cols-3 gap-3"
                  >
                    {PAYMENT_OPTIONS.map((option, index) => {
                      const isSelected = paymentMethod === option.value;
                      return (
                        <button
                          key={option.value}
                          ref={(el) => {
                            radioRefs.current[index] = el;
                          }}
                          role="radio"
                          aria-checked={isSelected}
                          tabIndex={isSelected ? 0 : -1}
                          onClick={() => setPaymentMethod(option.value)}
                          onKeyDown={(event) => handleRadioKeyDown(event, index)}
                          disabled={isLoading}
                          className={`
                            relative flex flex-col items-center gap-3 py-6 rounded-2xl
                            touch-manipulation
                            transition-[transform,box-shadow,border-color,background-color] duration-200
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral
                            disabled:opacity-40 active:scale-95
                            border
                            ${
                              isSelected
                                ? "bg-base-200 border-primary"
                                : "bg-base-100 border-base-content/5"
                            }
                          `}
                          style={
                            isSelected
                              ? {
                                  boxShadow:
                                    "0 0 24px color-mix(in oklab, var(--color-primary) 24%, transparent)",
                                }
                              : undefined
                          }
                        >
                          {isSelected && (
                            <span
                              aria-hidden="true"
                              className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary text-primary-content flex items-center justify-center"
                            >
                              <svg
                                className="w-2.5 h-2.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3.5}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </span>
                          )}
                          <span className="text-2xl" aria-hidden="true">
                            {option.icon}
                          </span>
                          <span
                            className={`text-xs font-medium tracking-wide ${isSelected ? "text-primary" : "text-fg-soft"}`}
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
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm animate-fade-in motion-reduce:animate-none bg-error/10 border border-error/30 text-error"
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

          {/* Refuerzo del método elegido (evita pedir con el método equivocado) */}
          {isSelecting && selectedOption && (
            <p
              aria-live="polite"
              className="flex items-center justify-center gap-1.5 text-sm text-fg-soft"
            >
              <span>Vas a pagar con</span>
              <span aria-hidden="true">{selectedOption.icon}</span>
              <span className="font-semibold text-base-content">
                {selectedOption.label}
              </span>
            </p>
          )}

          {/* Botón sello */}
          <button
            onClick={handleClick}
            disabled={
              isRequested || isDuplicateRequest || isLoading || !requestData
            }
            aria-label={buttonLabel}
            aria-busy={isLoading}
            className={`
                w-full h-18 rounded-full
                flex items-center justify-center gap-3
                text-xl font-extrabold tracking-tight
                touch-manipulation
                transition-[transform,box-shadow,background-color] duration-500
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-neutral
                active:scale-[0.97]
                disabled:cursor-not-allowed
                ${!isRequested && !isDuplicateRequest && !isLoading && requestData ? "animate-breathe motion-reduce:animate-none" : ""}
              `}
            style={
              isRequested || isDuplicateRequest
                ? {
                    background:
                      "linear-gradient(135deg, var(--seal-from), var(--seal-to))",
                    color: "var(--seal-fg)",
                    boxShadow: "0 0 32px var(--seal-glow)",
                  }
                : {
                    background:
                      "linear-gradient(135deg, var(--color-primary), color-mix(in oklab, var(--color-primary) 82%, white))",
                    color: "var(--color-primary-content)",
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
        <footer className="py-4 flex items-center justify-center">
          <span className="font-display text-sm font-semibold tracking-tight text-fg-subtle">
            tepidolacuenta
          </span>
        </footer>
      </div>
    </div>
  );
};
