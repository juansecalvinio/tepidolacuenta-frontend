import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useFetchPayment } from "../../hooks/useFetchPayment";
import { usePaymentWebSocket } from "../../hooks/usePaymentWebSocket";
import type { PaymentApprovedWsMessage } from "../../../core/modules/payment/domain/models/Payment";

const REDIRECT_DELAY_MS = 2500;

export const PaymentPending = () => {
  const navigate = useNavigate();
  const { token, restaurantId } = useAuth();
  const { clearPaymentStorage, getStoredPreferenceId, getStoredRestaurantId } =
    useFetchPayment();

  const [approved, setApproved] = useState(false);

  const storedPreferenceId = getStoredPreferenceId();
  const storedRestaurantId = getStoredRestaurantId() ?? restaurantId;

  const handleApproved = (payment: PaymentApprovedWsMessage["payment"]) => {
    console.log("✅ Pago aprobado via WebSocket (pending):", payment.id);
    clearPaymentStorage();
    setApproved(true);
    setTimeout(() => navigate("/dashboard"), REDIRECT_DELAY_MS);
  };

  usePaymentWebSocket({
    restaurantId: storedRestaurantId,
    token,
    preferenceId: storedPreferenceId,
    onPaymentApproved: handleApproved,
  });

  const handleDashboard = () => {
    clearPaymentStorage();
    navigate("/dashboard");
  };

  if (approved) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 p-4">
        <div className="w-full max-w-sm text-center space-y-6">
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
            <h1 className="text-2xl font-bold mb-2">¡Pago aprobado!</h1>
            <p className="opacity-60 text-sm">
              Tu suscripción fue activada correctamente. Redirigiendo al
              dashboard...
            </p>
          </div>
          <span className="loading loading-dots loading-sm text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 p-4">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-warning/20 mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8 text-warning"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">Pago en proceso</h1>
          <p className="opacity-60 text-sm">
            Tu pago está siendo procesado. Te notificaremos cuando se confirme.
            Podés cerrar esta pantalla y volver más tarde.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm opacity-60">
          <span className="loading loading-ring loading-xs" />
          <span>Esperando confirmación...</span>
        </div>

        <button className="btn btn-ghost w-full" onClick={handleDashboard}>
          Ir al dashboard
        </button>
      </div>
    </div>
  );
};
