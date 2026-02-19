import { api } from "../../../../api/http-client";
import type {
  CreateRestaurantRequest,
  CreateRestaurantResponse,
  GetBranchesByRestaurantResponse,
  GetRestaurantByIdResponse,
  GetRestaurantsResponse,
} from "../../domain/models/Restaurant";
import type { RestaurantRepository } from "../../domain/repositories/RestaurantRepository";

export class ApiRestaurantRepository implements RestaurantRepository {
  async createRestaurant(
    request: CreateRestaurantRequest,
  ): Promise<CreateRestaurantResponse> {
    return await api.post<CreateRestaurantResponse>(
      "/api/v1/setup/restaurant",
      request,
    );
  }

  async getRestaurants(): Promise<GetRestaurantsResponse> {
    return await api.get<GetRestaurantsResponse>("/api/v1/restaurants");
  }

  async getRestaurantById(
    restaurantId: string,
  ): Promise<GetRestaurantByIdResponse> {
    return await api.get<GetRestaurantByIdResponse>(
      `/api/v1/restaurants/${restaurantId}`,
    );
  }

  async getBranchesByRestaurant(
    restaurantId: string,
  ): Promise<GetBranchesByRestaurantResponse> {
    return await api.get<GetBranchesByRestaurantResponse>(
      `/api/v1/branches/restaurant/${restaurantId}`,
    );
  }
}
