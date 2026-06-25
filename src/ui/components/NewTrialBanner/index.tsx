import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../../hooks/useSubscription";
import { useFetchSubscription } from "../../hooks/useFetchSubscription";
import { useAuth } from "../../hooks/useAuth";

export const NewTrialBanner = () => {
  const navigate = useNavigate();
  const { restaurantId, isOwner } = useAuth();
  const { isTrialing, isExpired, trialDaysRemaining } = useSubscription();
  const { fetchPlans, fetchSubscription } = useFetchSubscription();

  useEffect(() => {
    // El trial/plan es asunto del owner; los empleados no lo gestionan.
    if (!isOwner || !restaurantId) return;
    fetchPlans();
    fetchSubscription(restaurantId);
  }, [isOwner, restaurantId, fetchPlans, fetchSubscription]);

  if (!isOwner) return null;

  if (!isTrialing && !isExpired) return null;

  if (isExpired) {
    return (
      <div className="flex items-start gap-3 border border-error/25 bg-error/5 rounded-xl px-4 py-3 mb-6 text-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 shrink-0 mt-0.5 text-error"
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
          <span className="text-fg-soft ml-1">
            Elegí un plan para seguir usando el servicio.
          </span>
        </div>
        <button
          className="btn btn-xs btn-ghost shrink-0 text-error hover:bg-error/10"
          onClick={() => navigate("/dashboard/plans")}
        >
          Ver planes
        </button>
      </div>
    );
  }

  const isUrgent = trialDaysRemaining !== null && trialDaysRemaining <= 3;

  const daysText = trialDaysRemaining === 1 ? "1 día" : `${trialDaysRemaining} días`;

  // Prueba con días de sobra: la prueba es una buena noticia, no una advertencia.
  // Solo en los últimos días (isUrgent) el llamado a suscribirse es legítimo.
  const title = isUrgent
    ? `Te queda${trialDaysRemaining === 1 ? "" : "n"} ${daysText} de prueba.`
    : "Prueba gratis activa.";

  const subtitle = isUrgent
    ? "Suscribite para no perder el acceso."
    : `Tenés acceso completo por ${daysText} más.`;

  return (
    <div
      className={`flex items-start gap-3 border rounded-xl px-4 py-3 mb-6 text-sm ${
        isUrgent
          ? "border-warning/30 bg-warning/5"
          : "border-info/25 bg-info/5"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`w-4 h-4 shrink-0 mt-0.5 ${isUrgent ? "text-warning" : "text-info"}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
        />
      </svg>
      <div className="flex-1 min-w-0">
        <span className="font-semibold text-base-content">{title}</span>
        <span className="text-fg-soft ml-1">{subtitle}</span>
      </div>
      <button
        className={`btn btn-xs btn-ghost shrink-0 ${
          isUrgent
            ? "text-warning hover:bg-warning/10"
            : "text-info hover:bg-info/10"
        }`}
        onClick={() => navigate("/dashboard/plans")}
      >
        Ver planes
      </button>
    </div>
  );
};
