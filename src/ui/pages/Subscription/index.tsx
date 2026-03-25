import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../../hooks/useSubscription";
import { useFetchSubscription } from "../../hooks/useFetchSubscription";
import { useAuth } from "../../hooks/useAuth";

const STATUS_LABELS: Record<string, string> = {
  trialing: "Período de prueba",
  active: "Activa",
  canceled: "Cancelada",
  expired: "Vencida",
  past_due: "Pago pendiente",
};

const STATUS_BADGE: Record<string, string> = {
  trialing: "badge-info",
  active: "badge-success",
  canceled: "badge-neutral",
  expired: "badge-error",
  past_due: "badge-warning",
};

export const Subscription = () => {
  const navigate = useNavigate();
  const { restaurantId } = useAuth();
  const {
    subscription,
    activePlan,
    isLoading,
    trialDaysRemaining,
    isTrialing,
  } = useSubscription();
  const { fetchPlans, fetchSubscription, cancelSubscription } =
    useFetchSubscription();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    fetchPlans();
    if (restaurantId) fetchSubscription(restaurantId);
  }, [restaurantId]);

  const handleCancel = async () => {
    if (!subscription) return;
    await cancelSubscription(subscription.id);
    setShowCancelConfirm(false);
  };

  if (isLoading && !subscription) {
    return (
      <div className="flex items-center justify-center min-h-40">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Suscripción</h1>
        <p className="opacity-60">Administrá tu plan actual.</p>
      </div>

      {!subscription ? (
        <div className="card bg-base-100 card-border border-base-300">
          <div className="card-body text-center">
            <p className="opacity-60 mb-4">No tenés una suscripción activa.</p>
            <button
              className="btn btn-primary mx-auto"
              onClick={() => navigate("/dashboard/plans")}
            >
              Ver planes
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Plan actual */}
          <div className="card bg-base-100 card-border border-base-300">
            <div className="card-body p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm opacity-60 mb-1">Plan actual</p>
                  <h2 className="text-2xl font-bold">
                    {activePlan?.name ?? "—"}
                  </h2>
                  {activePlan && (
                    <p className="text-sm opacity-60 mt-1">
                      ${activePlan.price.toFixed(2)}/mes
                    </p>
                  )}
                </div>
                <span
                  className={`badge badge-sm ${STATUS_BADGE[subscription.status] ?? "badge-neutral"}`}
                >
                  {STATUS_LABELS[subscription.status] ?? subscription.status}
                </span>
              </div>

              {isTrialing && trialDaysRemaining !== null && (
                <div className="mt-4 p-3 bg-base-200 rounded-lg">
                  <p className="text-sm">
                    <span className="font-semibold">{trialDaysRemaining}</span>{" "}
                    {trialDaysRemaining === 1
                      ? "día restante"
                      : "días restantes"}{" "}
                    de prueba
                    {subscription.trialEndsAt && (
                      <span className="opacity-60">
                        {" "}
                        · Vence el{" "}
                        {new Date(subscription.trialEndsAt).toLocaleDateString(
                          "es-AR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </span>
                    )}
                  </p>
                </div>
              )}

              {activePlan && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="p-3 bg-base-200 rounded-lg">
                    <p className="text-xs opacity-60 mb-1">Mesas</p>
                    <p className="font-bold">
                      {activePlan.maxTables === -1
                        ? "Ilimitadas"
                        : activePlan.maxTables}
                    </p>
                  </div>
                  <div className="p-3 bg-base-200 rounded-lg">
                    <p className="text-xs opacity-60 mb-1">Sucursales</p>
                    <p className="font-bold">
                      {activePlan.maxBranches === -1
                        ? "Ilimitadas"
                        : activePlan.maxBranches}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Acciones */}
          {subscription.status !== "canceled" && (
            <div className="card bg-base-100 card-border border-base-300">
              <div className="card-body p-6 gap-3">
                <button
                  className="btn btn-outline w-full"
                  onClick={() => navigate("/dashboard/plans")}
                >
                  Cambiar de plan
                </button>

                {!showCancelConfirm ? (
                  <button
                    className="btn btn-ghost text-error w-full"
                    onClick={() => setShowCancelConfirm(true)}
                  >
                    Cancelar suscripción
                  </button>
                ) : (
                  <div className="p-4 bg-error/10 rounded-lg space-y-3">
                    <p className="text-sm font-semibold">
                      ¿Estás seguro que querés cancelar tu suscripción?
                    </p>
                    <p className="text-sm opacity-70">
                      Perderás acceso al servicio al finalizar el período
                      actual.
                    </p>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-error btn-sm flex-1"
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="loading loading-spinner loading-xs" />
                        ) : (
                          "Sí, cancelar"
                        )}
                      </button>
                      <button
                        className="btn btn-ghost btn-sm flex-1"
                        onClick={() => setShowCancelConfirm(false)}
                      >
                        Volver
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {subscription.status === "canceled" && (
            <div className="card bg-base-100 card-border border-base-300">
              <div className="card-body p-6 text-center">
                <p className="opacity-60 mb-4">
                  Tu suscripción está cancelada.
                </p>
                <button
                  className="btn btn-primary mx-auto"
                  onClick={() => navigate("/dashboard/plans")}
                >
                  Reactivar con un plan
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
