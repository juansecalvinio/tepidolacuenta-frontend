import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useSubscription } from "../../hooks/useSubscription";
import { useFetchSubscription } from "../../hooks/useFetchSubscription";

interface Props {
  children: ReactNode;
}

/**
 * Bloquea las rutas del dashboard (owner) si no hay una suscripción válida:
 * sin plan, trial vencido o suscripción expirada. Los empleados pasan directo.
 * El trial se evalúa client-side (`isExpired`) porque el backend no lo expira solo.
 */
export const SubscriptionGuard = ({ children }: Props) => {
  const { isOwner, restaurantId } = useAuth();
  const { subscription, isExpired } = useSubscription();
  const { fetchSubscription } = useFetchSubscription();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isOwner || !restaurantId) return;
    let active = true;
    fetchSubscription(restaurantId).finally(() => {
      if (active) setChecked(true);
    });
    return () => {
      active = false;
    };
  }, [isOwner, restaurantId, fetchSubscription]);

  // Empleados: no se les exige suscripción (usan el local del owner).
  if (!isOwner) return <>{children}</>;

  // Owner sin local todavía → a elegir plan (de ahí sigue al onboarding).
  if (!restaurantId) return <Navigate to="/dashboard/select-plan" replace />;

  if (!checked) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span
          className="loading loading-spinner loading-lg text-primary"
          aria-label="Cargando…"
        />
      </div>
    );
  }

  if (subscription === null || isExpired) {
    return <Navigate to="/dashboard/select-plan" replace />;
  }

  return <>{children}</>;
};
