import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useFetchPayment } from "../../hooks/useFetchPayment";
import { usePaymentWebSocket } from "../../hooks/usePaymentWebSocket";
import type { PaymentApprovedWsMessage } from "../../../core/modules/payment/domain/models/Payment";
import { logger } from "../../utils/logger";

type Stage = "processing" | "approved" | "error";

const REDIRECT_DELAY_MS = 2500;
const FALLBACK_DELAY_MS = 3000;

export const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { token, restaurantId } = useAuth();
  const {
    fetchPaymentHistory,
    clearPaymentStorage,
    getStoredPreferenceId,
    getStoredRestaurantId,
  } = useFetchPayment();

  const [stage, setStage] = useState<Stage>("processing");
  const fallbackRanRef = useRef(false);

  const storedPreferenceId = getStoredPreferenceId();
  const storedRestaurantId = getStoredRestaurantId() ?? restaurantId;

  const handleApproved = (payment: PaymentApprovedWsMessage["payment"]) => {
    logger.debug("✅ Pago aprobado via WebSocket:", payment.id);
    clearPaymentStorage();
    setStage("approved");
    setTimeout(() => navigate("/dashboard"), REDIRECT_DELAY_MS);
  };

  usePaymentWebSocket({
    restaurantId: storedRestaurantId,
    token,
    preferenceId: storedPreferenceId,
    onPaymentApproved: handleApproved,
  });

  // Fallback: consultar historial después de 3 segundos
  useEffect(() => {
    if (!storedRestaurantId || fallbackRanRef.current) return;

    const timer = setTimeout(async () => {
      if (fallbackRanRef.current || stage !== "processing") return;
      fallbackRanRef.current = true;

      const result = await fetchPaymentHistory(storedRestaurantId);
      if (!result.success || !result.data) return;

      const latest = result.data[0];
      if (latest?.status === "approved") {
        const matchesPreference =
          !storedPreferenceId ||
          latest.mpPreferenceId === storedPreferenceId;

        if (matchesPreference) {
          logger.debug("✅ Pago aprobado via fallback HTTP:", latest.id);
          clearPaymentStorage();
          setStage("approved");
          setTimeout(() => navigate("/dashboard"), REDIRECT_DELAY_MS);
        }
      }
    }, FALLBACK_DELAY_MS);

    return () => clearTimeout(timer);
  }, [
    storedRestaurantId,
    storedPreferenceId,
    stage,
    fetchPaymentHistory,
    clearPaymentStorage,
    navigate,
  ]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 p-4">
      <div className="w-full max-w-sm text-center space-y-6">
        {stage === "processing" && (
          <>
            <span className="loading loading-spinner loading-lg text-primary" />
            <div>
              <h1 className="font-host text-2xl font-bold mb-2">Procesando tu pago</h1>
              <p className="opacity-60 text-sm">
                Estamos confirmando tu pago con MercadoPago. Esto puede tardar
                unos segundos...
              </p>
            </div>
          </>
        )}

        {stage === "approved" && (
          <>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-success/20 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-8 h-8 text-success"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            </div>
            <div>
              <h1 className="font-host text-2xl font-bold mb-2">¡Pago aprobado!</h1>
              <p className="opacity-60 text-sm">
                Tu suscripción fue activada correctamente. Redirigiendo al
                dashboard...
              </p>
            </div>
            <span className="loading loading-dots loading-sm text-primary" />
          </>
        )}

        {stage === "error" && (
          <>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-error/20 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8 text-error"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>
            <div>
              <h1 className="font-host text-2xl font-bold mb-2">
                No pudimos verificar tu pago
              </h1>
              <p className="opacity-60 text-sm mb-4">
                El pago puede estar siendo procesado. Revisá tu suscripción en
                el dashboard.
              </p>
            </div>
            <button
              className="btn btn-primary w-full"
              onClick={() => navigate("/dashboard")}
            >
              Ir al dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};
