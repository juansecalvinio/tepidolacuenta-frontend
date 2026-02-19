import type { GetBranchesByRestaurantResponse } from "../domain/models/Restaurant";
import type { RestaurantRepository } from "../domain/repositories/RestaurantRepository";

export const GetBranchesByRestaurant = (repository: RestaurantRepository) => {
  return async (
    restaurantId: string,
  ): Promise<GetBranchesByRestaurantResponse> => {
    return await repository.getBranchesByRestaurant(restaurantId);
  };
};
