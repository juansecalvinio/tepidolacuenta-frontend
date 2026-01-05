import type {
  CreateRestaurantRequest,
  CreateRestaurantResponse,
} from "../domain/models/Restaurant";
import type { RestaurantRepository } from "../domain/repositories/RestaurantRepository";

export const CreateRestaurant = (repository: RestaurantRepository) => {
  return async (
    request: CreateRestaurantRequest
  ): Promise<CreateRestaurantResponse> => {
    return await repository.createRestaurant(request);
  };
};
