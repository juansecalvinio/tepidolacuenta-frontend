import type { GetSubscriptionByRestaurantResponse } from "../domain/models/Subscription";
import type { SubscriptionRepository } from "../domain/repositories/SubscriptionRepository";

export const GetSubscriptionByRestaurant = (repository: SubscriptionRepository) => {
  return async (restaurantId: string): Promise<GetSubscriptionByRestaurantResponse> => {
    return await repository.getSubscriptionByRestaurant(restaurantId);
  };
};
