import type {
  CreateRestaurantRequest,
  CreateRestaurantResponse,
  GetBranchesByRestaurantResponse,
  GetRestaurantByIdResponse,
  GetRestaurantsResponse,
} from "../models/Restaurant";

export interface RestaurantRepository {
  createRestaurant(
    request: CreateRestaurantRequest,
  ): Promise<CreateRestaurantResponse>;
  getRestaurants(): Promise<GetRestaurantsResponse>;
  getRestaurantById(restaurantId: string): Promise<GetRestaurantByIdResponse>;
  getBranchesByRestaurant(
    restaurantId: string,
  ): Promise<GetBranchesByRestaurantResponse>;
}
