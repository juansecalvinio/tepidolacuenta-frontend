import { useEffect } from "react";
import { useSubscription } from "../../hooks/useSubscription";
import { useFetchSubscription } from "../../hooks/useFetchSubscription";
import { useFetchPayment } from "../../hooks/useFetchPayment";
import { useAuth } from "../../hooks/useAuth";
import type { Plan } from "../../../core/modules/subscription/domain/models/Subscription";
import { PriceUtils } from "../../utils/price.utils";


const PlanFeature = ({ label }: { label: string }) => (
  <li className="flex items-center gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-4 h-4 text-success shrink-0"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 12.75 6 6 9-13.5"
      />
    </svg>
    <span className="text-sm">{label}</span>
  </li>
);

const getPlanFeatures = (plan: Plan): string[] => {
  const tables =
    plan.maxTables === -1
      ? "Mesas ilimitadas"
      : `Hasta ${plan.maxTables} mesas`;
  const branches =
    plan.maxBranches === -1
      ? "Sucursales ilimitadas"
      : `${plan.maxBranches} sucursal${plan.maxBranches > 1 ? "es" : ""}`;

  return [
    tables,
    branches,
    "Solicitudes de cuenta por QR",
    "Panel de administración",
  ];
};

export const Plans = () => {
  const { restaurantId } = useAuth();
  const { plans, subscription, activePlan, isLoading } = useSubscription();
  const { fetchPlans, fetchSubscription } = useFetchSubscription();
  const { createPreference } = useFetchPayment();

  useEffect(() => {
    fetchPlans();
    if (restaurantId) fetchSubscription(restaurantId);
  }, [restaurantId]);

  const handleSelectPlan = async (plan: Plan) => {
    if (!subscription || !restaurantId) return;
    if (activePlan?.id === plan.id) return;

    const result = await createPreference({ restaurantId, planId: plan.id });
    if (result.success && result.data) {
      window.location.href = result.data.paymentUrl;
    }
  };

  const sortedPlans = [...plans].sort((a, b) => a.price - b.price);
  const recommendedId = sortedPlans[Math.floor((sortedPlans.length - 1) / 2)]?.id;

  if (isLoading && plans.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-40">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1 text-balance">Planes</h1>
        <p className="opacity-60">
          Elegí el plan que mejor se adapta a tu negocio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {sortedPlans.map((plan) => {
          const isRecommended = plan.id === recommendedId;
          const isCurrent = activePlan?.id === plan.id;

          return (
            <div
              key={plan.id}
              className={`card card-border w-full relative transition-shadow ${
                isRecommended
                  ? "border-primary border-2 bg-base-100 md:shadow-lg"
                  : "border-base-300 bg-base-100"
              }`}
            >
              {isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="badge badge-primary badge-sm font-semibold px-3">
                    Recomendado
                  </span>
                </div>
              )}

              <div className="card-body p-6">
                <h2 className="card-title text-xl">{plan.name}</h2>

                <div className="my-2">
                  <span className="text-4xl font-black">
                    $ {PriceUtils.getFormattedPrice(plan.price)}
                  </span>
                  <span className="text-sm opacity-60">/mes</span>
                </div>

                {plan.trialDays > 0 && (
                  <p className="text-xs opacity-60 -mt-1">
                    {plan.trialDays} días gratis al comenzar
                  </p>
                )}

                <ul className="space-y-2 mt-4 mb-6">
                  {getPlanFeatures(plan).map((feature) => (
                    <PlanFeature key={feature} label={feature} />
                  ))}
                </ul>

                <div className="card-actions">
                  {isCurrent ? (
                    <button className="btn btn-outline w-full" disabled>
                      Plan actual
                    </button>
                  ) : (
                    <button
                      className={`btn w-full ${isRecommended ? "btn-primary" : "btn-neutral"}`}
                      onClick={() => handleSelectPlan(plan)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="loading loading-spinner loading-sm" aria-label="Cargando…" />
                      ) : (
                        "Elegir Plan"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {plans.length === 0 && !isLoading && (
        <div className="card bg-base-100 card-border border-base-300">
          <div className="card-body text-center opacity-60">
            No hay planes disponibles por el momento.
          </div>
        </div>
      )}
    </div>
  );
};
