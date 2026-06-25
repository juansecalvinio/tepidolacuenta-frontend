import { useNavigate } from "react-router-dom";
import { useFetchPayment } from "../../hooks/useFetchPayment";

export const PaymentFailure = () => {
  const navigate = useNavigate();
  const { clearPaymentStorage } = useFetchPayment();

  const handleRetry = () => {
    clearPaymentStorage();
    navigate("/dashboard/plans");
  };

  const handleDashboard = () => {
    clearPaymentStorage();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 p-4">
      <div className="w-full max-w-sm text-center space-y-6">
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
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </div>

        <div>
          <h1 className="font-display text-2xl font-semibold mb-2">El pago no se procesó</h1>
          <p className="text-fg-soft text-sm">
            Tu pago no pudo ser procesado. Podés intentarlo nuevamente con otro
            método de pago.
          </p>
        </div>

        <div className="space-y-3">
          <button className="btn btn-primary w-full" onClick={handleRetry}>
            Reintentar pago
          </button>
          <button className="btn btn-ghost w-full" onClick={handleDashboard}>
            Volver al dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
