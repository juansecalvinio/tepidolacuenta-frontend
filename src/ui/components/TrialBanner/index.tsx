import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../../hooks/useSubscription";
import { useFetchSubscription } from "../../hooks/useFetchSubscription";
import { useAuth } from "../../hooks/useAuth";

export const TrialBanner = () => {
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
      <div role="alert" className="alert alert-error mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 shrink-0"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
        <div>
          <p className="font-semibold">Tu período de prueba ha vencido</p>
          <p className="text-sm">
            Elegí un plan para seguir usando el servicio.
          </p>
        </div>
        <button
          className="btn btn-sm btn-neutral"
          onClick={() => navigate("/dashboard/plans")}
        >
          Ver planes
        </button>
      </div>
    );
  }

  const isUrgent = trialDaysRemaining !== null && trialDaysRemaining <= 3;

  return (
    <div
      role="alert"
      className={`alert mb-6 ${isUrgent ? "alert-warning" : "alert-info"}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5 shrink-0"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
        />
      </svg>
      <div>
        <p className="font-semibold">
          {trialDaysRemaining === 1
            ? "Te queda 1 día de prueba"
            : `Te quedan ${trialDaysRemaining} días de prueba`}
        </p>
        <p className="text-sm">
          Elegí un plan para no interrumpir el servicio.
        </p>
      </div>
      <button
        className="btn btn-sm btn-neutral"
        onClick={() => navigate("/dashboard/plans")}
      >
        Ver planes
      </button>
    </div>
  );
};
