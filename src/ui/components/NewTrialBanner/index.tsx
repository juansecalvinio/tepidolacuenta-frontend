import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../../hooks/useSubscription";
import { useFetchSubscription } from "../../hooks/useFetchSubscription";
import { useAuth } from "../../hooks/useAuth";

export const NewTrialBanner = () => {
  const navigate = useNavigate();
  const { restaurantId } = useAuth();
  const { isTrialing, isExpired, trialDaysRemaining } = useSubscription();
  const { fetchPlans, fetchSubscription } = useFetchSubscription();

  useEffect(() => {
    if (!restaurantId) return;
    fetchPlans();
    fetchSubscription(restaurantId);
  }, [restaurantId]);

  if (!isTrialing && !isExpired) return null;

  if (isExpired) {
    return (
      <div className="flex items-start gap-3 border border-red-500/25 bg-red-500/5 rounded-xl px-4 py-3 mb-6 text-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 shrink-0 mt-0.5 text-red-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-base-content">
            Tu período de prueba ha vencido.
          </span>
          <span className="text-base-content/60 ml-1">
            Elegí un plan para seguir usando el servicio.
          </span>
        </div>
        <button
          className="btn btn-xs btn-ghost shrink-0 text-red-500 hover:bg-red-500/10"
          onClick={() => navigate("/dashboard/plans")}
        >
          Ver planes
        </button>
      </div>
    );
  }

  const isUrgent = trialDaysRemaining !== null && trialDaysRemaining <= 3;

  const daysLabel =
    trialDaysRemaining === 1
      ? "Te queda 1 día de prueba."
      : `Te quedan ${trialDaysRemaining} días de prueba.`;

  return (
    <div
      className={`flex items-start gap-3 border rounded-xl px-4 py-3 mb-6 text-sm ${
        isUrgent
          ? "border-amber-400/30 bg-amber-400/5"
          : "border-blue-400/25 bg-blue-400/5"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`w-4 h-4 shrink-0 mt-0.5 ${isUrgent ? "text-amber-500" : "text-blue-500"}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
        />
      </svg>
      <div className="flex-1 min-w-0">
        <span className="font-semibold text-base-content">{daysLabel}</span>
        <span className="text-base-content/60 ml-1">
          Elegí un plan para no interrumpir el servicio.
        </span>
      </div>
      <button
        className={`btn btn-xs btn-ghost shrink-0 ${
          isUrgent
            ? "text-amber-600 hover:bg-amber-400/10"
            : "text-blue-600 hover:bg-blue-400/10"
        }`}
        onClick={() => navigate("/dashboard/plans")}
      >
        Ver planes
      </button>
    </div>
  );
};
