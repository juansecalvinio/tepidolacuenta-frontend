import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchPayment } from "../../hooks/useFetchPayment";
import { usePaymentConfirmation } from "../../hooks/usePaymentConfirmation";

const REDIRECT_DELAY_MS = 2500;

export const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { clearPaymentStorage } = useFetchPayment();
  const { status } = usePaymentConfirmation();

  useEffect(() => {
    if (status !== "approved") return;
    const timer = setTimeout(() => navigate("/dashboard"), REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [status, navigate]);

  const goToDashboard = () => {
    clearPaymentStorage();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 p-4">
      <div className="w-full max-w-sm text-center space-y-6">
        {status === "waiting" && (
          <>
            <span className="loading loading-spinner loading-lg text-primary" />
            <div>
              <h1 className="font-display text-2xl font-semibold mb-2">
                Procesando tu pago
              </h1>
              <p className="text-fg-soft text-sm">
                Estamos confirmando tu pago con MercadoPago. Esto puede tardar
                unos segundos…
              </p>
            </div>
            <button className="btn btn-ghost btn-sm w-full" onClick={goToDashboard}>
              Ir al dashboard
            </button>
          </>
        )}

        {status === "approved" && (
          <>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-success/20 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-8 h-8 text-success"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold mb-2">
                ¡Pago aprobado!
              </h1>
              <p className="text-fg-soft text-sm">
                Tu suscripción fue activada correctamente. Redirigiendo al
                dashboard…
              </p>
            </div>
            <span className="loading loading-dots loading-sm text-primary" />
          </>
        )}

        {status === "timeout" && (
          <>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-warning/20 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8 text-warning"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold mb-2">
                El pago sigue procesándose
              </h1>
              <p className="text-fg-soft text-sm">
                Está tardando más de lo normal. Tu suscripción puede activarse en
                unos minutos — podés revisar el estado en el dashboard.
              </p>
            </div>
            <button className="btn btn-primary w-full" onClick={goToDashboard}>
              Ir al dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};
