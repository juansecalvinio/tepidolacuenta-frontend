import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../../hooks/useSubscription";
import { useFetchSubscription } from "../../hooks/useFetchSubscription";
import { useRestaurants } from "../../hooks/useRestaurants";
import { useFetchBranches } from "../../hooks/useFetchBranches";
import { useAuth } from "../../hooks/useAuth";
import { Alert } from "../../components/Alert";
import { PriceUtils } from "../../utils/price.utils";

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
    currentPlan,
    isLoading,
    trialDaysRemaining,
    isTrialing,
  } = useSubscription();

  const { fetchSubscription, cancelSubscription } = useFetchSubscription();
  const { branches } = useRestaurants();
  const { fetchBranchesByRestaurant } = useFetchBranches();

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelError, setCancelError] = useState("");

  // Conteo real de sucursales creadas, para mostrar uso vs. límite del plan.
  const branchCount = branches?.length ?? 0;

  useEffect(() => {
    if (!restaurantId) return;
    if (subscription !== null) return;

    fetchSubscription(restaurantId);
  }, [restaurantId, subscription, fetchSubscription]);

  useEffect(() => {
    if (restaurantId) fetchBranchesByRestaurant(restaurantId);
  }, [restaurantId, fetchBranchesByRestaurant]);

  const handleCancel = async () => {
    if (!subscription) return;
    setCancelError("");
    const result = await cancelSubscription(subscription.id);
    if (result.success) {
      setShowCancelConfirm(false);
    } else {
      setCancelError(
        result.error || "No se pudo cancelar la suscripción. Intentá de nuevo.",
      );
    }
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
        <h1 className="font-display text-3xl font-semibold mb-1">
          Suscripción
        </h1>
        <p className="text-fg-soft">Administrá tu plan actual.</p>
      </div>

      {!subscription ? (
        <div className="card bg-base-100 card-border border-base-300">
          <div className="card-body text-center">
            <p className="text-fg-soft mb-4">
              No tenés una suscripción activa.
            </p>
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
          <div className="card bg-base-100 card-border border-base-300 mb-8">
            <div className="card-body p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-fg-soft mb-1">Plan actual</p>
                  <h2 className="font-display text-2xl font-semibold">
                    {currentPlan?.name ?? "—"}
                  </h2>
                  {currentPlan && (
                    <p className="text-sm text-fg-soft mt-1">
                      $ {PriceUtils.getFormattedPrice(currentPlan.price)}/mes
                    </p>
                  )}
                </div>
                <span
                  className={`badge badge-sm badge-soft ${STATUS_BADGE[subscription.status] ?? "badge-neutral"}`}
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
                      <span className="text-fg-soft">
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

              {currentPlan && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {/* Sucursales: uso real vs. límite del plan */}
                  <div className="p-3 bg-base-200 rounded-lg">
                    <p className="text-xs text-fg-soft mb-1">Sucursales</p>
                    <p>
                      <span className="font-bold text-lg">{branchCount}</span>{" "}
                      <span className="text-sm text-fg-soft">
                        {currentPlan.maxBranches === -1
                          ? "· sin límite"
                          : `de ${currentPlan.maxBranches}`}
                      </span>
                    </p>
                  </div>
                  {/* Mesas: tope POR sucursal que permite el plan */}
                  <div className="p-3 bg-base-200 rounded-lg">
                    <p className="text-xs text-fg-soft mb-1">
                      {currentPlan.maxBranches === 1
                        ? "Mesas"
                        : "Mesas por sucursal"}
                    </p>
                    <p>
                      {currentPlan.maxTables === -1 ? (
                        <span className="font-bold text-lg">Ilimitadas</span>
                      ) : (
                        <>
                          <span className="text-sm text-fg-soft">hasta</span>{" "}
                          <span className="font-bold text-lg">
                            {currentPlan.maxTables}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Acciones — directas sobre el fondo, no son contenido de una card */}
          {subscription.status !== "canceled" && (
            <div className="flex flex-col gap-3">
              <button
                className="btn btn-secondary w-full"
                onClick={() => navigate("/dashboard/plans")}
              >
                Cambiar de plan
              </button>

              {!showCancelConfirm ? (
                <button
                  className="btn btn-outline w-full"
                  onClick={() => {
                    setCancelError("");
                    setShowCancelConfirm(true);
                  }}
                >
                  Cancelar suscripción
                </button>
              ) : (
                <div className="p-4 bg-error/10 rounded-lg space-y-3">
                  <p className="text-sm font-semibold">
                    ¿Estás seguro que querés cancelar tu suscripción?
                  </p>
                  <p className="text-sm text-fg-soft">
                    Perderás acceso al servicio al finalizar el período actual.
                  </p>
                  {cancelError && <Alert>{cancelError}</Alert>}
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
                      onClick={() => {
                        setCancelError("");
                        setShowCancelConfirm(false);
                      }}
                    >
                      Volver
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {subscription.status === "canceled" && (
            <div className="card bg-base-100 card-border border-base-300">
              <div className="card-body p-6 text-center">
                <p className="text-fg-soft mb-4">
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
