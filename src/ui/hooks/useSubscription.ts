import { useSubscriptionContext } from "../contexts/subscription.context";

export const useSubscription = () => {
  const { plans, subscription, isLoading, error } = useSubscriptionContext();

  const safePlans = Array.isArray(plans) ? plans : [];
  const activePlan =
    safePlans.find((p) => p.id === subscription?.planId) ?? null;

  const trialDaysRemaining =
    subscription?.status === "trialing" && subscription.trialEndsAt
      ? Math.max(
          0,
          Math.ceil(
            (new Date(subscription.trialEndsAt).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : null;

  const isTrialing = subscription?.status === "trialing";
  const isActive = subscription?.status === "active";
  const isCanceled = subscription?.status === "canceled";
  const isExpired =
    subscription?.status === "expired" ||
    subscription?.status === "past_due" ||
    (isTrialing && trialDaysRemaining === 0);

  return {
    plans,
    subscription,
    activePlan,
    isLoading,
    error,
    trialDaysRemaining,
    isTrialing,
    isActive,
    isCanceled,
    isExpired,
  };
};
