import type { SubscriptionRepository } from "../domain/repositories/SubscriptionRepository";

export const CancelSubscription = (repository: SubscriptionRepository) => {
  return async (subscriptionId: string): Promise<void> => {
    return await repository.cancelSubscription(subscriptionId);
  };
};
