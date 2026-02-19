import type { GetRestaurantByIdResponse } from "../domain/models/Restaurant";
import type { RestaurantRepository } from "../domain/repositories/RestaurantRepository";

export const GetRestaurantById = (repository: RestaurantRepository) => {
  return async (restaurantId: string): Promise<GetRestaurantByIdResponse> => {
    return await repository.getRestaurantById(restaurantId);
  };
};
