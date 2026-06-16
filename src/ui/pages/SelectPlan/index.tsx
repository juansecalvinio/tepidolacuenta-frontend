import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useSubscription } from "../../hooks/useSubscription";
import { useFetchSubscription } from "../../hooks/useFetchSubscription";
import { useFetchPayment } from "../../hooks/useFetchPayment";
import { usePendingPayment } from "../../hooks/usePendingPayment";
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

  // Guard contra doble pago: si ya hay un pago en vuelo, no dejamos pagar otra vez.
  const { status: pendingStatus, recheck, dismiss } = usePendingPayment();
  const [isRechecking, setIsRechecking] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Si el pago en vuelo ya se aprobó (el webhook llegó), al dashboard.
  useEffect(() => {
    if (pendingStatus === "approved") {
      navigate("/dashboard", { replace: true });
    }
  }, [pendingStatus, navigate]);

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

  const handleRecheck = async () => {
    setIsRechecking(true);
    const next = await recheck();
    setIsRechecking(false);
    if (next === "approved") {
      navigate("/dashboard", { replace: true });
    }
  };

  if (pendingStatus === "checking" || (isLoading && plans.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const sortedPlans = [...plans].sort((a, b) => a.price - b.price);
  const recommendedId = sortedPlans[Math.floor((sortedPlans.length - 1) / 2)]?.id;

  // Con local existente se cobra (MercadoPago); sin local, el alta arranca con
  // un trial. El CTA y el subtítulo lo comunican explícitamente.
  const isPayFlow = !!restaurantId;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-base-100 p-4 mt-4">
      <div className="w-full max-w-4xl">
        <AuthLogo />

        {pendingStatus === "pending" ? (
          <div className="card bg-base-100 card-border border-base-300 max-w-md mx-auto">
            <div className="card-body items-center text-center gap-4 p-6">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-warning/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-7 h-7 text-warning"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold mb-1">
                  Tenés un pago en proceso
                </h2>
                <p className="opacity-60 text-sm">
                  Estamos confirmando tu pago con MercadoPago. Puede tardar unos
                  minutos — no hace falta que pagues de nuevo.
                </p>
              </div>
              <div className="w-full space-y-2">
                <button
                  className="btn btn-primary w-full"
                  onClick={handleRecheck}
                  disabled={isRechecking}
                >
                  {isRechecking ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    "Verificar de nuevo"
                  )}
                </button>
                <button className="btn btn-ghost w-full" onClick={dismiss}>
                  Elegir otro plan
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="font-display text-3xl font-semibold mb-1 text-balance">
                Elegí tu plan
              </h1>
              <p className="opacity-60">
                {isPayFlow
                  ? "Elegí un plan para continuar usando el servicio."
                  : "Comenzá con un período de prueba gratuito."}
              </p>
            </div>

            {error && <Alert className="mb-6">{error}</Alert>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              {sortedPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isRecommended={plan.id === recommendedId}
                  ctaLabel={
                    isPayFlow
                      ? "Suscribirme"
                      : plan.trialDays > 0
                        ? "Empezar prueba gratis"
                        : "Empezar"
                  }
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
          </>
        )}
      </div>
    </div>
  );
};
