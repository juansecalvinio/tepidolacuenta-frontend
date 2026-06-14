import { useCallback } from "react";
import { useSubscriptionContext } from "../contexts/subscription.context";
import { getSubscriptionRepository } from "../../core/modules/subscription/infrastructure/repositories/SubscriptionRepositoryFactory";
import { GetPlans } from "../../core/modules/subscription/use-cases/GetPlans";
import { GetSubscriptionByRestaurant } from "../../core/modules/subscription/use-cases/GetSubscriptionByRestaurant";
import { UpdateSubscription } from "../../core/modules/subscription/use-cases/UpdateSubscription";
import { CancelSubscription } from "../../core/modules/subscription/use-cases/CancelSubscription";
import { CreateSubscription } from "../../core/modules/subscription/use-cases/CreateSubscription";
import { GetPlanById } from "../../core/modules/subscription/use-cases/GetPlanById";
import type {
  Plan,
  UpdateSubscriptionRequest,
  CreateSubscriptionRequest,
} from "../../core/modules/subscription/domain/models/Subscription";
import { getErrorMessage } from "../../core/utils/error-messages";

function isNotFoundError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  try {
    const parsed = JSON.parse(err.message);
    return parsed.error === "not found";
  } catch {
    return false;
  }
}

export const useFetchSubscription = () => {
  const {
    setPlans,
    setSubscription,
    updateSubscription,
    setCurrentPlan,
    setLoading,
    setError,
    clearError,
  } = useSubscriptionContext();

  const repository = getSubscriptionRepository();

  const fetchPlans = useCallback(async () => {
    clearError();
    try {
      const execute = GetPlans(repository);
      const response = await execute();
      const plans = Array.isArray(response)
        ? response
        : ((response as { data?: Plan[] }).data ?? []);
      setPlans(plans);
      return { success: true, data: plans };
    } catch (err) {
      const errorMessage = getErrorMessage(err, "fetchPlans");
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [repository, setPlans, setError, clearError]);

  const fetchSubscription = useCallback(
    async (restaurantId: string) => {
      setLoading(true);
      clearError();
      try {
        const execute = GetSubscriptionByRestaurant(repository);
        const subscription = await execute(restaurantId);
        setSubscription(subscription);
        if (subscription.plan) {
          setCurrentPlan(subscription.plan);
        }
        return { success: true, data: subscription };
      } catch (err) {
        if (isNotFoundError(err)) {
          setSubscription(null);
          return { success: true, data: null };
        }
        const errorMessage = getErrorMessage(err, "fetchSubscription");
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [repository, setSubscription, setCurrentPlan, setLoading, setError, clearError],
  );

  const changePlan = useCallback(
    async (subscriptionId: string, request: UpdateSubscriptionRequest) => {
      setLoading(true);
      clearError();
      try {
        const execute = UpdateSubscription(repository);
        const updated = await execute(subscriptionId, request);
        setSubscription(updated);
        return { success: true, data: updated };
      } catch (err) {
        const errorMessage = getErrorMessage(err, "changePlan");
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [repository, setSubscription, setLoading, setError, clearError],
  );

  const cancelSubscription = useCallback(
    async (subscriptionId: string) => {
      setLoading(true);
      clearError();
      try {
        const execute = CancelSubscription(repository);
        await execute(subscriptionId);
        updateSubscription({ status: "canceled" });
        return { success: true };
      } catch (err) {
        const errorMessage = getErrorMessage(err, "cancelSubscription");
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [repository, updateSubscription, setLoading, setError, clearError],
  );

  const createSubscription = useCallback(
    async (request: CreateSubscriptionRequest) => {
      setLoading(true);
      clearError();
      try {
        const execute = CreateSubscription(repository);
        const subscription = await execute(request);
        setSubscription(subscription);
        return { success: true, data: subscription };
      } catch (err) {
        const errorMessage = getErrorMessage(err, "createSubscription");
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [repository, setSubscription, setLoading, setError, clearError],
  );

  const fetchPlanById = useCallback(
    async (planId: string) => {
      setLoading(true);
      clearError();
      try {
        const execute = GetPlanById(repository);
        const plan = await execute(planId);
        setCurrentPlan(plan);
        return { success: true, data: plan };
      } catch (err) {
        const errorMessage = getErrorMessage(err, "fetchPlanById");
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [repository, setCurrentPlan, setLoading, setError, clearError],
  );

  return {
    fetchPlans,
    fetchSubscription,
    fetchPlanById,
    changePlan,
    cancelSubscription,
    createSubscription,
  };
};
