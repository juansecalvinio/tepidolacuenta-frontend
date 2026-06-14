import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useSubscription } from "../../hooks/useSubscription";
import { useFetchSubscription } from "../../hooks/useFetchSubscription";
import { useFetchPayment } from "../../hooks/useFetchPayment";
import { AuthLogo } from "../../components/AuthLogo";
import { Alert } from "../../components/Alert";
import { PlanCard } from "../../components/PlanCard";
import type { Plan } from "../../../core/modules/subscription/domain/models/Subscription";

export const SelectPlan = () => {
  const navigate = useNavigate();
  const { restaurantId } = useAuth();
  const { plans, isLoading, error } = useSubscription();
  const { fetchPlans } = useFetchSubscription();
  const { createPreference } = useFetchPayment();

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleSelectPlan = async (plan: Plan) => {
    if (restaurantId) {
      const result = await createPreference({
        restaurantId,
        planId: plan.id,
      });
      if (result.success && result.data) {
        window.location.href = result.data.paymentUrl;
      }
      return;
    }

    navigate("/dashboard/onboarding", { state: { plan } });
  };

  if (isLoading && plans.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const sortedPlans = [...plans].sort((a, b) => a.price - b.price);
  const recommendedId = sortedPlans[Math.floor((sortedPlans.length - 1) / 2)]?.id;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-base-100 p-4 mt-4">
      <div className="w-full max-w-4xl">
        <AuthLogo />

        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-semibold mb-1 text-balance">
            Elegí tu plan
          </h1>
          <p className="opacity-60">
            Comenzá con un período de prueba gratuito.
          </p>
        </div>

        {error && <Alert className="mb-6">{error}</Alert>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {sortedPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isRecommended={plan.id === recommendedId}
              ctaLabel="Comenzar"
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
    </div>
  );
};
