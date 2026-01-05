import { api } from "../../../../api/http-client";
import type {
  CreateRestaurantRequest,
  CreateRestaurantResponse,
  GetRestaurantsResponse,
} from "../../domain/models/Restaurant";
import type { RestaurantRepository } from "../../domain/repositories/RestaurantRepository";

export class ApiRestaurantRepository implements RestaurantRepository {
  async createRestaurant(
    request: CreateRestaurantRequest
  ): Promise<CreateRestaurantResponse> {
    return await api.post<CreateRestaurantResponse>(
      "/api/v1/restaurants",
      request
    );
  }

  async getRestaurants(): Promise<GetRestaurantsResponse> {
    return await api.get<GetRestaurantsResponse>("/api/v1/restaurants");
  }
}
