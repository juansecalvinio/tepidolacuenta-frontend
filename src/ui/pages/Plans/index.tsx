import { useEffect, useState } from "react";
import { useSubscription } from "../../hooks/useSubscription";
import { useFetchSubscription } from "../../hooks/useFetchSubscription";
import { useFetchPayment } from "../../hooks/useFetchPayment";
import { useAuth } from "../../hooks/useAuth";
import { PlanCard } from "../../components/PlanCard";
import { BillingCycleToggle } from "../../components/BillingCycleToggle";
import { EnterpriseContactCta } from "../../components/EnterpriseContactCta";
import type { Plan } from "../../../core/modules/subscription/domain/models/Subscription";
import type { BillingCycle } from "../../../core/modules/payment/domain/models/Payment";

export const Plans = () => {
  const { restaurantId } = useAuth();
  const { plans, subscription, activePlan, isLoading } = useSubscription();
  const { fetchPlans, fetchSubscription } = useFetchSubscription();
  const { createPreference } = useFetchPayment();
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  useEffect(() => {
    fetchPlans();
    if (restaurantId) fetchSubscription(restaurantId);
  }, [restaurantId, fetchPlans, fetchSubscription]);

  const handleSelectPlan = async (plan: Plan, branches: number) => {
    if (!subscription || !restaurantId) return;
    if (activePlan?.id === plan.id) return;

    const result = await createPreference({
      restaurantId,
      planId: plan.id,
      cycle,
      branches,
    });
    if (result.success && result.data) {
      window.location.href = result.data.paymentUrl;
    }
  };

  const sortedPlans = [...plans].sort((a, b) => a.price - b.price);
  const recommendedId = sortedPlans[1]?.id; // Pro

  if (isLoading && plans.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-40">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold mb-1 text-balance">Planes</h1>
        <p className="text-fg-soft">
          Elegí el plan que mejor se adapta a tu local.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <BillingCycleToggle value={cycle} onChange={setCycle} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
        {sortedPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            cycle={cycle}
            isRecommended={plan.id === recommendedId}
            isCurrent={activePlan?.id === plan.id}
            ctaLabel="Suscribirme"
            onSelect={handleSelectPlan}
            loading={isLoading}
          />
        ))}
      </div>

      {plans.length > 0 && <EnterpriseContactCta />}

      {plans.length === 0 && !isLoading && (
        <div className="card bg-base-100 card-border border-base-300">
          <div className="card-body text-center text-fg-soft">
            No hay planes disponibles por el momento.
          </div>
        </div>
      )}
    </div>
  );
};
