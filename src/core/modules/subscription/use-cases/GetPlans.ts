import type { GetPlansResponse } from "../domain/models/Subscription";
import type { SubscriptionRepository } from "../domain/repositories/SubscriptionRepository";

export const GetPlans = (repository: SubscriptionRepository) => {
  return async (): Promise<GetPlansResponse> => {
    return await repository.getPlans();
  };
};
