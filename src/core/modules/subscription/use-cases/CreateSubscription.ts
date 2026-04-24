import type {
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
} from "../domain/models/Subscription";
import type { SubscriptionRepository } from "../domain/repositories/SubscriptionRepository";

export const CreateSubscription = (repository: SubscriptionRepository) => {
  return async (
    request: CreateSubscriptionRequest,
  ): Promise<CreateSubscriptionResponse> => {
    return await repository.createSubscription(request);
  };
};
