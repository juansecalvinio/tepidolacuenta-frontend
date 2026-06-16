import { useEffect } from "react";
import { useSubscription } from "../../hooks/useSubscription";
import { useFetchSubscription } from "../../hooks/useFetchSubscription";
import { useFetchPayment } from "../../hooks/useFetchPayment";
import { useAuth } from "../../hooks/useAuth";
import { PlanCard } from "../../components/PlanCard";
import type { Plan } from "../../../core/modules/subscription/domain/models/Subscription";

export const Plans = () => {
  const { restaurantId } = useAuth();
  const { plans, subscription, activePlan, isLoading } = useSubscription();
  const { fetchPlans, fetchSubscription } = useFetchSubscription();
  const { createPreference } = useFetchPayment();

  useEffect(() => {
    fetchPlans();
    if (restaurantId) fetchSubscription(restaurantId);
  }, [restaurantId, fetchPlans, fetchSubscription]);

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
        <h1 className="font-display text-3xl font-semibold mb-1 text-balance">Planes</h1>
        <p className="opacity-60">
          Elegí el plan que mejor se adapta a tu negocio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {sortedPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isRecommended={plan.id === recommendedId}
            isCurrent={activePlan?.id === plan.id}
            ctaLabel="Suscribirme"
            onSelect={handleSelectPlan}
            loading={isLoading}
          />
        ))}
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
