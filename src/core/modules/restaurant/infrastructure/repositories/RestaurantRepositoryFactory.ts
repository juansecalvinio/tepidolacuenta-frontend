import type { RestaurantRepository } from "../../domain/repositories/RestaurantRepository";
import { ApiRestaurantRepository } from "./ApiRestaurantRepository";

export const getRestaurantRepository = (): RestaurantRepository => {
  return new ApiRestaurantRepository();
};
