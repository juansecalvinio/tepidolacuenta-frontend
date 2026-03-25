import type {
  UpdateSubscriptionRequest,
  UpdateSubscriptionResponse,
} from "../domain/models/Subscription";
import type { SubscriptionRepository } from "../domain/repositories/SubscriptionRepository";

export const UpdateSubscription = (repository: SubscriptionRepository) => {
  return async (
    subscriptionId: string,
    request: UpdateSubscriptionRequest,
  ): Promise<UpdateSubscriptionResponse> => {
    return await repository.updateSubscription(subscriptionId, request);
  };
};
