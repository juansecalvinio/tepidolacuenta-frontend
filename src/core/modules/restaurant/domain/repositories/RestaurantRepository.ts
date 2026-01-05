import type {
  CreateRestaurantRequest,
  CreateRestaurantResponse,
  GetRestaurantsResponse,
} from "../models/Restaurant";

export interface RestaurantRepository {
  createRestaurant(request: CreateRestaurantRequest): Promise<CreateRestaurantResponse>;
  getRestaurants(): Promise<GetRestaurantsResponse>;
}
