import type { GetRestaurantsResponse } from "../domain/models/Restaurant";
import type { RestaurantRepository } from "../domain/repositories/RestaurantRepository";

export const GetRestaurants = (repository: RestaurantRepository) => {
  return async (): Promise<GetRestaurantsResponse> => {
    return await repository.getRestaurants();
  };
};
