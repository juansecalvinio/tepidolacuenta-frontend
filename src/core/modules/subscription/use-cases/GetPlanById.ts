import type { GetPlanByIdResponse } from "../domain/models/Subscription";
import type { SubscriptionRepository } from "../domain/repositories/SubscriptionRepository";

export const GetPlanById = (repository: SubscriptionRepository) => {
  return async (planId: string): Promise<GetPlanByIdResponse> => {
    return await repository.getPlanById(planId);
  };
};
